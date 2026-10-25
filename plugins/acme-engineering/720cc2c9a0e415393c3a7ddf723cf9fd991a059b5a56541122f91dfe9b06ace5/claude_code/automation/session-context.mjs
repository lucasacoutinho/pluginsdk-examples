import { readFile } from "node:fs/promises"

let input = ""
for await (const chunk of process.stdin) input += chunk
const event = JSON.parse(input)

if (event.hook_event_name === "SessionStart") {
  const context = await readFile(new URL("context.md", import.meta.url), "utf8")
  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context }
  }))
}
