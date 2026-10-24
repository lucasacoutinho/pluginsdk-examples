import { readdir, readFile } from "node:fs/promises"
import { isAbsolute } from "node:path"
import { createInterface } from "node:readline"

const migrationName = /^(\d+)_([a-z0-9_]+)\.(up|down)\.sql$/

const rules = [
  {
    id: "drop-table",
    severity: "high",
    test: (sql) => /\bDROP\s+TABLE\b/i.test(sql),
    guidance: "Dropping a table deletes data. Confirm a backup and that no deployed version reads the table."
  },
  {
    id: "drop-column",
    severity: "high",
    test: (sql) => /\bDROP\s+COLUMN\b/i.test(sql),
    guidance: "Stop reading and writing the column in a released application version before dropping it."
  },
  {
    id: "truncate",
    severity: "high",
    test: (sql) => /\bTRUNCATE\b/i.test(sql),
    guidance: "TRUNCATE deletes every row. Data migrations should not truncate production tables."
  },
  {
    id: "not-null-without-default",
    severity: "high",
    test: (sql) => /\bADD\s+COLUMN\b/i.test(sql) && /\bNOT\s+NULL\b/i.test(sql) && !/\bDEFAULT\b/i.test(sql),
    guidance: "Adding a NOT NULL column without a default fails on tables with rows. Add it nullable, backfill, then set NOT NULL."
  },
  {
    id: "column-type-change",
    severity: "medium",
    test: (sql) => /\bALTER\s+COLUMN\s+\S+\s+(SET\s+DATA\s+)?TYPE\b/i.test(sql),
    guidance: "Changing a column type can rewrite the table under an exclusive lock. Prefer a new column and a backfill."
  },
  {
    id: "set-not-null",
    severity: "medium",
    test: (sql) => /\bALTER\s+COLUMN\s+\S+\s+SET\s+NOT\s+NULL\b/i.test(sql),
    guidance: "SET NOT NULL scans the table under a lock. Validate a CHECK constraint first on large tables."
  },
  {
    id: "index-not-concurrent",
    severity: "medium",
    test: (sql) => /\bCREATE\s+(UNIQUE\s+)?INDEX\b/i.test(sql) && !/\bCONCURRENTLY\b/i.test(sql),
    guidance: "CREATE INDEX blocks writes for its duration. Use CREATE INDEX CONCURRENTLY in a migration without a transaction."
  },
  {
    id: "rename",
    severity: "medium",
    test: (sql) => /\bRENAME\s+(COLUMN\b|TO\b)/i.test(sql),
    guidance: "A rename breaks application versions that still use the old name during rollout. Use expand and contract."
  }
]

// Splits on semicolons outside quotes and comments. Dollar-quoted bodies are not parsed.
function statements(source) {
  const found = []
  let text = ""
  let line = 1
  let start = 0
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    const next = source[index + 1]
    if (char === "-" && next === "-") {
      while (index < source.length && source[index] !== "\n") index++
      index--
      continue
    }
    if (char === "/" && next === "*") {
      index += 2
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        if (source[index] === "\n") line++
        index++
      }
      index++
      continue
    }
    if (char === "'") {
      text += char
      index++
      while (index < source.length && source[index] !== "'") {
        if (source[index] === "\n") line++
        text += source[index]
        index++
      }
      text += "'"
      continue
    }
    if (char === "\n") line++
    if (char === ";") {
      if (text.trim() !== "") found.push({ line: start, sql: text.trim() })
      text = ""
      start = 0
      continue
    }
    if (start === 0 && char.trim() !== "") start = line
    text += char
  }
  if (text.trim() !== "") found.push({ line: start, sql: text.trim() })
  return found
}

function excerpt(sql) {
  const flat = sql.replace(/\s+/g, " ")
  return flat.length > 160 ? `${flat.slice(0, 157)}...` : flat
}

async function listMigrations({ directory }) {
  if (typeof directory !== "string" || !isAbsolute(directory)) throw new Error("directory must be an absolute path")
  const entries = await readdir(directory, { withFileTypes: true })
  const versions = new Map()
  const unrecognized = []
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".sql")) continue
    const match = migrationName.exec(entry.name)
    if (match === null) {
      unrecognized.push(entry.name)
      continue
    }
    const [, version, name, direction] = match
    const migration = versions.get(version) ?? { version, names: new Set(), up: null, down: null }
    migration.names.add(name)
    migration[direction] = entry.name
    versions.set(version, migration)
  }
  const migrations = [...versions.values()]
    .sort((left, right) => (BigInt(left.version) < BigInt(right.version) ? -1 : 1))
    .map(({ version, names, up, down }) => ({ version, name: [...names].join(", "), up, down }))
  const issues = [
    ...unrecognized.map((file) => `Unrecognized migration file name: ${file}`),
    ...migrations.filter((m) => m.name.includes(",")).map((m) => `Version ${m.version} has more than one name: ${m.name}`),
    ...migrations.filter((m) => m.up === null).map((m) => `Version ${m.version} has no up migration`),
    ...migrations.filter((m) => m.down === null).map((m) => `Version ${m.version} has no down migration`)
  ]
  return { directory, migrations, issues }
}

async function checkMigration({ file }) {
  if (typeof file !== "string" || !isAbsolute(file) || !file.endsWith(".sql")) {
    throw new Error("file must be an absolute path to a .sql file")
  }
  const parsed = statements(await readFile(file, "utf8"))
  const findings = parsed.flatMap(({ line, sql }) => rules
    .filter((rule) => rule.test(sql))
    .map((rule) => ({ rule: rule.id, severity: rule.severity, line, statement: excerpt(sql), guidance: rule.guidance })))
  return { file, statements: parsed.length, findings }
}

const tools = {
  list_migrations: {
    description: "List Schemaloom migrations in a directory by version and report missing up or down files.",
    inputSchema: {
      type: "object",
      properties: { directory: { type: "string", description: "Absolute path to the migrations directory." } },
      required: ["directory"],
      additionalProperties: false
    },
    run: listMigrations
  },
  check_migration: {
    description: "Check one SQL migration file for statements that lose data, take long locks or break rolling deploys.",
    inputSchema: {
      type: "object",
      properties: { file: { type: "string", description: "Absolute path to a .sql migration file." } },
      required: ["file"],
      additionalProperties: false
    },
    run: checkMigration
  }
}

const methods = {
  initialize: async (params) => ({
    protocolVersion: typeof params?.protocolVersion === "string" ? params.protocolVersion : "2025-06-18",
    capabilities: { tools: {} },
    serverInfo: { name: "schemaloom", version: "0.9.0" }
  }),
  ping: async () => ({}),
  "tools/list": async () => ({
    tools: Object.entries(tools).map(([name, { description, inputSchema }]) => ({ name, description, inputSchema }))
  }),
  "tools/call": async (params) => {
    const tool = Object.hasOwn(tools, params?.name) ? tools[params.name] : undefined
    if (tool === undefined) return { content: [{ type: "text", text: `Unknown tool: ${params?.name}` }], isError: true }
    try {
      const result = await tool.run(params.arguments ?? {})
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], isError: false }
    } catch (error) {
      return { content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }], isError: true }
    }
  }
}

const send = (frame) => process.stdout.write(`${JSON.stringify(frame)}\n`)

for await (const line of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
  let request
  try {
    request = JSON.parse(line)
  } catch {
    continue
  }
  if (request === null || typeof request !== "object" || !Object.hasOwn(request, "id")) continue
  const method = Object.hasOwn(methods, request.method) ? methods[request.method] : undefined
  if (method === undefined) {
    send({ jsonrpc: "2.0", id: request.id, error: { code: -32601, message: "Method not found" } })
  } else {
    send({ jsonrpc: "2.0", id: request.id, result: await method(request.params) })
  }
}
