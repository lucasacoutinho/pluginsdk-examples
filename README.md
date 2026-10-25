# Acme agent plugins

Acme's platform team publishes internal plugins from a private Git repository with [PluginSDK](https://github.com/lucasacoutinho/pluginsdk). The plugins connect to internal MCP services, and the services keep enforcing each user's access.

This branch is set up the way that repository would be: plugin sources and the published marketplace together, ready for an organization admin to connect. Each example in this repository is a separate branch. The [`main` branch](https://github.com/lucasacoutinho/pluginsdk-examples) lists them.

Acme and its services are fictional. The `.acme.internal` endpoints are placeholders.

## Repository layout

```text
.claude-plugin/marketplace.json     generated: Claude marketplace index
.agents/plugins/marketplace.json    generated: Codex and ChatGPT marketplace index
.pluginsdk/publications.json        generated: published release records
plugins/<id>/<digest>/              generated: Claude Code and Codex packages for each release

acme-engineering/                   source: change review skill and SessionStart hook
acme-data/                          source: warehouse skill, analyst agent and MCP endpoints
```

Edit only the sources. `npx pluginsdk publish` writes the generated files and commits them to this branch.

| Plugin | Contents | Purpose |
| --- | --- | --- |
| [acme-engineering](acme-engineering/) | Skill, `SessionStart` hook | Reviews changes against Acme's engineering standards. Adds the team's working context to each session. |
| [acme-data](acme-data/) | Skill, agent, two remote MCP services | Answers business questions from certified warehouse tables, following Acme's data handling rules. |

Both definitions publish to this branch under the `acme` marketplace name. Each plugin can have its own owning team and release schedule. Publishing one keeps the other's entries.

## Connect to Claude

Requires a Claude Team or Enterprise plan, with Cowork and Skills enabled for the organization. An owner connects the repository once:

1. Open **Organization settings > Plugins** and select **Add plugin**.
2. Choose **GitHub** as the source and select the repository.
3. Leave automatic sync on.

Claude reads `.claude-plugin/marketplace.json` from the repository root. Organization marketplaces must be private or internal repositories on github.com. Claude's documentation does not describe choosing a branch, so in your organization keep this content on the repository's default branch. Members then find the plugins in the plugin directory and install them without a terminal.

See [Manage plugins for your organization](https://support.claude.com/en/articles/13837433).

## Connect to ChatGPT

Requires ChatGPT Enterprise. A workspace owner or admin imports the repository once:

1. Open **Workspace settings > Plugins** and add a GitHub marketplace.
2. Enter the repository URL. Leave **Path** empty.
3. Enter `acme` as the branch.
4. Set installation and authentication policies for each plugin in the workspace.

ChatGPT reads `.agents/plugins/marketplace.json` and syncs daily. **Sync now** requests an earlier update. Policy values written in the repository do not override workspace settings.

See [Plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).

## Try the plugins

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

```sh
git clone --branch acme git@github.com:lucasacoutinho/pluginsdk-examples.git acme-plugins
cd acme-plugins
npm ci
cd acme-data
npx pluginsdk build
npx pluginsdk preview
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it. `preview` installs a development copy in your local Claude Code and Codex.

The hook in `acme-engineering` needs Node 24.18+ on the client's `PATH`. Codex asks the user to approve a new or changed hook. Cursor rejects packages with hooks or agents. When Cursor is installed, preview these plugins with `--target claude_code` or `--target codex`.

In a fresh session with `acme-data`, ask:

> What was net revenue retention for enterprise accounts in Q3, by region? Use certified tables and show the queries.

With `acme-engineering`, ask:

> Review this branch against our engineering standards before I open a pull request.

## Release a change

1. Edit the plugin's skills, templates or definition.
2. Increment `version` in its `definition.json`.
3. Build and publish from the plugin directory:

   ```sh
   npx pluginsdk build
   npx pluginsdk publish
   ```

4. Commit the source change.

`publish` adds a commit with the new package and index entries. Publishing the same version again with different content fails.

Claude syncs on pushes to the followed branch. If an update does not appear, select **Re-sync** for the marketplace. ChatGPT picks up the change at its next daily sync, or immediately with **Sync now**. In both products, members keep the previous version if a sync fails.

When versions need approval before they reach developers, use the [release catalog](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/catalog-usage.md) and [distribution review](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/distribution-usage.md).

## Access

The plugins contain instructions and MCP endpoint declarations. They grant no roles. Admins choose which members can install each plugin in the Claude or ChatGPT admin settings. The warehouse decides which tables and columns each signed-in user can read. Users authenticate through each service's existing route.

Keep credentials out of the definitions. The headers are empty, and a build for both clients rejects environment-backed headers. The skills tell the agent to report a denied permission instead of working around it. Only the service enforces access.

## Not yet verified

No real Claude organization or ChatGPT workspace has been connected to this repository. The generated indexes and packages have been checked with the Claude Code and Codex CLIs only.

- Claude: which plugin contents Cowork and Claude Desktop support. The hook and the agent run on the user's computer in Claude Code, and may behave differently or be unavailable elsewhere.
- ChatGPT: which of the generated Codex package formats the workspace import accepts.

## Use your own repository

Copy this branch into a private repository in your organization. Replace `publish.repository` and `publish.branch` in each `definition.json`, and replace the placeholder MCP endpoints with your services. Delete the generated files, then build and publish each plugin. Connect the new repository as described above.
