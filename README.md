# PluginSDK examples

Example plugins and marketplaces for [PluginSDK](https://github.com/lucasacoutinho/pluginsdk). Each plugin directory has one JSON definition and the workflows or reference files you want to share. Build any of them for Claude Code and Codex with the same CLI.

## Set up

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

```sh
git clone git@github.com:lucasacoutinho/pluginsdk-examples.git
cd pluginsdk-examples
npm ci
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it. Then `npx pluginsdk` works in every example directory.

## Examples

| Example | Shows |
| --- | --- |
| [release-notes](release-notes/) | The smallest plugin: one skill and a template, with no external service. |
| [platform-tools](platform-tools/) | Shared workflows over existing internal MCP services. |
| [Schemaloom plugin](public-marketplace/schemaloom/) | A plugin for a fictional open-source CLI, with a bundled stdio MCP server that reads the user's migration files. |
| [Public marketplace](public-marketplace/) | An open-source project publishing two plugins from one public GitHub repository. |
| [Private marketplace](private-marketplace/) | Internal plugins with a session hook, a shared agent and internal MCP services, published to one private repository and released through approval. |

## Release notes from your repository

Use [release-notes](release-notes/) to draft a release from Git history. It identifies the commit range, reads the changes, separates user-visible behavior from refactors, and produces notes with commit and file evidence.

The plugin has three authored files:

```text
release-notes/
  definition.json
  skills/release-notes/
    SKILL.md
    references/template.md
```

From the repository root:

```sh
cd release-notes
npx pluginsdk build
npx pluginsdk preview
```

Follow [Get started](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/getting-started.md) to use the preview. In either client, ask:

> Use the release-notes skill to draft the next release from v1.4.0 to HEAD. Include breaking changes and upgrade steps, with evidence for each note.

Use a tag that exists in your repository. No external service is needed. Change the shared template once to update both clients' release format.

## Operations across internal applications

Use [platform-tools](platform-tools/) when a central plugin team maintains workflows for existing internal services. The example connects a service catalog and a deployment application through their MCP endpoints.

The plugin contains two workflows and their report templates:

- `triage-incident` builds an incident timeline using service ownership, runbooks and deployment records.
- `release-readiness` checks a candidate release against the service's rollout prerequisites and rollback criteria.

Replace the two `.acme.internal` URLs in [definition.json](platform-tools/definition.json) with your existing endpoints. Configure service authentication in each client through your organization's supported route. The example does not include a server or a sign-in implementation.

```sh
cd platform-tools
npx pluginsdk build
npx pluginsdk preview
```

Replace the example's Git `publish.repository` with your team's marketplace and run `npx pluginsdk publish` to release the captured packages. See [Publish a plugin](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/publishing.md) for client installation. In either client, ask:

> Triage the checkout incident between 14:00 and 14:30 UTC. Error rates rose after the latest deployment. Find the service owner and runbook, compare recent deployments, and give me an evidence-backed timeline and next checks.

Or:

> Check whether checkout version 2.8.0 is ready for a production rollout at 16:00 UTC. Report missing prerequisites and the applicable rollback criteria. Do not deploy anything.

The services determine which tools each user can call. The skills report missing access or records instead of inventing results.

## Open-source and enterprise marketplaces

A marketplace is a Git repository that several plugin definitions publish to under one marketplace name. PluginSDK generates the Claude Code and Codex indexes and keeps each plugin's entries when another plugin publishes.

The [public marketplace](public-marketplace/) belongs to Schemaloom, a fictional open-source migration tool. Its main plugin reviews migrations with a bundled server, so users need nothing hosted. A sample project is included to try it.

The [private marketplace](private-marketplace/) belongs to Acme's platform team. It combines `platform-tools` with a data plugin and an engineering standards plugin. Its README shows how to release through the catalog and distribution review when versions need approval.

## What PluginSDK handles

| You maintain | PluginSDK handles |
| --- | --- |
| Shared workflow Markdown and templates | Capturing the same content in both packages |
| One plugin definition and MCP endpoint declarations | Native Claude Code and Codex manifests |
| The intended plugin version and publish destination | Captured releases and native marketplace entries |
| Local source edits | Development previews, owned updates and removal |

If the incident report needs a new field, edit its template once and run `preview` to update both clients. For a team release, increment the version, then build and publish. The application teams keep their existing MCP servers. See [Manage plugins for a team](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/teams.md) for release management and RBAC responsibilities.

