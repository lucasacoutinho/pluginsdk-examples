# Public marketplace for an open-source tool

Schemaloom is a fictional open-source database migration CLI. Its maintainers publish agent plugins from a public GitHub repository so users can install them in Claude Code or Codex next to the tool. In this repository, the marketplace is published to the `schemaloom` branch.

The marketplace has two plugins. Both definitions publish to the same repository, branch and marketplace name:

| Plugin | What it shows |
| --- | --- |
| [schemaloom](schemaloom/) | Two skills and a bundled stdio MCP server that reads the user's migration files. Nothing needs to be hosted. |
| [schemaloom-docs](schemaloom-docs/) | One skill and a public remote MCP endpoint for the project's documentation. |

```text
schemaloom/
  definition.json
  server/index.mjs                # MCP server, Node only, no dependencies
  skills/review-migration/        # SKILL.md and a report template
  skills/plan-schema-change/      # SKILL.md and expand-and-contract steps
  sample-project/                 # migrations to try the plugin on; not packaged
schemaloom-docs/
  definition.json
  skills/schemaloom-docs/SKILL.md
```

## Try the tool plugin

After [setup](../README.md#develop-locally), from the repository root:

```sh
cd public-marketplace/schemaloom
npx pluginsdk build
npx pluginsdk preview
```

The bundled server needs Node 24.18+ on the client's `PATH`. It exposes two tools:

- `list_migrations` lists migrations by version and reports missing up or down files.
- `check_migration` flags statements that delete data, take long locks or break application versions during a rolling deploy.

Open a fresh session in `sample-project/` and ask:

> Review the pending Schemaloom migrations. Is 20261015090000 safe to run in production?

The sample migration adds a required column without a default, renames a column and creates an index without `CONCURRENTLY`. It also has no down migration. The skill asks the agent to confirm each finding and propose a multi-release plan.

`schemaloom-docs` points at `https://docs.schemaloom.dev/mcp`, which does not exist. It builds and installs, but its tools are unavailable until you replace the URL with a real endpoint.

## Publish the marketplace

Each definition has the same destination:

```json
"publish": {
  "type": "git",
  "repository": "git@github.com:lucasacoutinho/pluginsdk-examples.git",
  "branch": "schemaloom",
  "marketplace": "schemaloom"
}
```

Build and publish each plugin from its directory:

```sh
cd public-marketplace/schemaloom && npx pluginsdk build && npx pluginsdk publish
cd ../schemaloom-docs && npx pluginsdk build && npx pluginsdk publish
```

The second publication adds its entry and keeps the first. The `schemaloom` branch then contains the Claude Code index in `.claude-plugin/marketplace.json`, the Codex index in `.agents/plugins/marketplace.json`, and the captured packages under `plugins/`. Release a plugin on its own schedule by incrementing its version and publishing again.

## Install as a user

```sh
git clone --branch schemaloom git@github.com:lucasacoutinho/pluginsdk-examples.git schemaloom-plugins

# Claude Code
claude plugin marketplace add ./schemaloom-plugins --scope user
claude plugin install schemaloom@schemaloom --scope user

# Codex
codex plugin marketplace add ./schemaloom-plugins
codex plugin add schemaloom@schemaloom
```

A ChatGPT Enterprise workspace can import the same marketplace by entering `schemaloom` as the branch. A Claude organization marketplace cannot use it: Claude reads the repository root of the followed branch, and a real Schemaloom marketplace would be a public repository, which organization marketplaces do not accept. Claude users install it in Claude Code instead.

Pull the checkout to get new releases, then update the plugin in the client. See [Publish a plugin](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/publishing.md) for the destination rules.
