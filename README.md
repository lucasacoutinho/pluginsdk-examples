# Schemaloom agent plugins

Schemaloom is a fictional open-source database migration CLI. This branch is set up the way its maintainers' public plugin repository would be: plugin sources and the published marketplace together, maintained with [PluginSDK](https://github.com/lucasacoutinho/pluginsdk).

Each example in this repository is a separate branch. The [`main` branch](https://github.com/lucasacoutinho/pluginsdk-examples) lists them.

## Repository layout

```text
.claude-plugin/marketplace.json     generated: Claude marketplace index
.agents/plugins/marketplace.json    generated: Codex and ChatGPT marketplace index
.pluginsdk/publications.json        generated: published release records
plugins/<id>/<digest>/              generated: Claude Code and Codex packages for each release

schemaloom/                         source: migration review plugin
  definition.json
  server/index.mjs                  MCP server, Node only, no dependencies
  skills/review-migration/          SKILL.md and a report template
  skills/plan-schema-change/        SKILL.md and expand-and-contract steps
  sample-project/                   migrations to try the plugin on; not packaged
schemaloom-docs/                    source: documentation plugin
  definition.json
  skills/schemaloom-docs/SKILL.md
```

Edit only the sources. `npx pluginsdk publish` writes the generated files and commits them to this branch.

| Plugin | Contents | Purpose |
| --- | --- | --- |
| [schemaloom](schemaloom/) | Two skills, bundled stdio MCP server | Reviews migrations and plans zero-downtime schema changes. Nothing needs to be hosted. |
| [schemaloom-docs](schemaloom-docs/) | Skill, remote MCP endpoint | Answers configuration and upgrade questions from the project documentation. |

`schemaloom-docs` points at `https://docs.schemaloom.dev/mcp`, which does not exist. It builds and installs, but its tools are unavailable until you replace the URL with a real endpoint.

## Install

```sh
git clone --branch schemaloom git@github.com:lucasacoutinho/pluginsdk-examples.git schemaloom-plugins

# Claude Code
claude plugin marketplace add ./schemaloom-plugins --scope user
claude plugin install schemaloom@schemaloom --scope user

# Codex
codex plugin marketplace add ./schemaloom-plugins
codex plugin add schemaloom@schemaloom
```

Pull the checkout to get new releases, then update the plugin in the client.

A ChatGPT Enterprise workspace can import this marketplace from **Workspace settings > Plugins** by entering `schemaloom` as the branch. See [Plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).

A Claude organization cannot connect it. Organization marketplaces accept only private or internal repositories, and a real Schemaloom repository would be public. Claude users install it in Claude Code instead. See [Manage plugins for your organization](https://support.claude.com/en/articles/13837433).

## Try the migration review

The bundled server needs Node 24.18+ on the client's `PATH`. It exposes two tools:

- `list_migrations` lists migrations by version and reports missing up or down files.
- `check_migration` flags statements that delete data, take long locks or break application versions during a rolling deploy.

Open a fresh session in `schemaloom/sample-project/` and ask:

> Review the pending Schemaloom migrations. Is 20261015090000 safe to run in production?

The sample migration adds a required column without a default, renames a column and creates an index without `CONCURRENTLY`. It also has no down migration. The skill asks the agent to confirm each finding and propose a multi-release plan.

## Develop and release

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

```sh
git clone --branch schemaloom git@github.com:lucasacoutinho/pluginsdk-examples.git schemaloom-plugins
cd schemaloom-plugins
npm ci
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it. To try a change, run `npx pluginsdk preview` in the plugin directory. It installs a development copy in your local Claude Code and Codex.

To release, increment `version` in the plugin's `definition.json`, then build and publish:

```sh
cd schemaloom
npx pluginsdk build
npx pluginsdk publish
```

Both definitions publish to this branch under the `schemaloom` marketplace name. Each plugin releases on its own schedule, and publishing one keeps the other's entries. Publishing the same version again with different content fails. Commit the source change after publishing.

See [Publish a plugin](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/publishing.md) for the destination rules.
