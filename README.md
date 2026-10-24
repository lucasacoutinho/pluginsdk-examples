# PluginSDK examples

This repository is set up as Acme's agent plugin marketplace, maintained with [PluginSDK](https://github.com/lucasacoutinho/pluginsdk). An organization admin can connect it to Claude or ChatGPT without further changes. The plugin sources and the published marketplace live together on `main`.

Acme, its internal services and Schemaloom are fictional. The `.acme.internal` and `docs.schemaloom.dev` MCP endpoints are placeholders.

## Repository layout

```text
.claude-plugin/marketplace.json     generated: Claude marketplace index
.agents/plugins/marketplace.json    generated: Codex and ChatGPT marketplace index
.pluginsdk/publications.json        generated: published release records
plugins/<id>/<digest>/claude_code/  generated: Claude package for each release
plugins/<id>/<digest>/codex/        generated: Codex package for each release

release-notes/                      source: release notes plugin
platform-tools/                     source: incident and release readiness plugin
private-marketplace/                source: acme-data and acme-engineering plugins
public-marketplace/                 source: Schemaloom plugins, published to the schemaloom branch
```

Edit only the sources. `npx pluginsdk publish` writes the generated files and commits them to the branch in each definition.

## The acme marketplace

| Plugin | Contents | Purpose |
| --- | --- | --- |
| [acme-engineering](private-marketplace/acme-engineering/) | Skill, `SessionStart` hook | Reviews changes against Acme's engineering standards. Adds the team's working context to each session. |
| [acme-data](private-marketplace/acme-data/) | Skill, agent, two remote MCP services | Answers business questions from certified warehouse tables. |
| [platform-tools](platform-tools/) | Two skills, two remote MCP services | Incident triage and release readiness over the service catalog and deployment service. |
| [release-notes](release-notes/) | Skill, template | Drafts release notes from a Git range. Needs no external service. |

The [private marketplace guide](private-marketplace/README.md) describes these plugins and the prompts to try.

The `schemaloom` branch holds a second marketplace for Schemaloom, a fictional open-source migration tool. See the [public marketplace guide](public-marketplace/README.md).

## Connect to Claude

Requires a Claude Team or Enterprise plan, with Cowork and Skills enabled for the organization. An owner connects the repository once:

1. Open **Organization settings > Plugins** and select **Add plugin**.
2. Choose **GitHub** as the source and select this repository.
3. Leave automatic sync on.

Claude reads `.claude-plugin/marketplace.json` from the repository root. Organization marketplaces must be private or internal repositories on github.com, so connect the `acme` marketplace only. Members then find its plugins in the plugin directory and install them without a terminal.

See [Manage plugins for your organization](https://support.claude.com/en/articles/13837433).

## Connect to ChatGPT

Requires ChatGPT Enterprise. A workspace owner or admin imports the repository once:

1. Open **Workspace settings > Plugins** and add a GitHub marketplace.
2. Enter the repository URL. Leave **Path** empty.
3. Leave the branch empty to follow `main`. To import the Schemaloom marketplace, enter `schemaloom` as the branch.
4. Set installation and authentication policies for each plugin in the workspace.

ChatGPT reads `.agents/plugins/marketplace.json` and syncs daily. **Sync now** requests an earlier update. Policy values written in the repository do not override workspace settings.

See [Plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).

## Release a change

1. Edit the plugin's skills, templates or definition.
2. Increment `version` in its `definition.json`.
3. Preview, build and publish from the plugin directory:

   ```sh
   npx pluginsdk preview
   npx pluginsdk build
   npx pluginsdk publish
   ```

4. Commit the source change.

`publish` adds a commit to `main` with the new package and index entries. It keeps the other plugins' entries. Publishing the same version again with different content fails.

Claude syncs on pushes to the followed branch. If an update does not appear, select **Re-sync** for the marketplace. ChatGPT picks up the change at its next daily sync, or immediately with **Sync now**. In both products, members keep the previous version if a sync fails.

## Access

The plugins contain instructions and MCP endpoint declarations. They grant no roles. Admins choose which members can install each plugin in the Claude or ChatGPT admin settings. Acme's services authenticate each user and decide which tools and data that user can access.

## Not yet verified

No real Claude organization or ChatGPT workspace has been connected to this repository. The generated indexes and packages have been checked with the Claude Code and Codex CLIs only.

- Claude: which plugin contents Cowork and Claude Desktop support. Hooks, bundled MCP servers and agents run on the user's computer in Claude Code, and may behave differently or be unavailable elsewhere.
- ChatGPT: which of the generated Codex package formats the workspace import accepts.

## Develop locally

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

```sh
git clone git@github.com:lucasacoutinho/pluginsdk-examples.git
cd pluginsdk-examples
npm ci
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it. Then `npx pluginsdk` works in every plugin directory:

```sh
cd release-notes
npx pluginsdk build
npx pluginsdk preview
```

`preview` installs a development copy in your local Claude Code and Codex. It does not publish. Remove it with `npx pluginsdk preview --remove`.

Try a plugin in a fresh session. For example, with `release-notes`:

> Use the release-notes skill to draft the next release from v1.4.0 to HEAD. Include breaking changes and upgrade steps, with evidence for each note.

With `platform-tools`, after replacing its endpoints with real services:

> Triage the checkout incident between 14:00 and 14:30 UTC. Error rates rose after the latest deployment. Find the service owner and runbook, compare recent deployments, and give me an evidence-backed timeline and next checks.

See [Define a plugin](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/authoring.md) and [Publish a plugin](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/publishing.md).

## Use your own repository

Copy this repository into a private repository in your organization. Replace `publish.repository` in each `definition.json` with the new repository's URL, and replace the placeholder MCP endpoints with your services. Delete the generated files and run `npx pluginsdk build && npx pluginsdk publish` in each plugin directory. Then connect the new repository as described above.
