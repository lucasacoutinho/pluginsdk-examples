# Platform tools plugin

A [PluginSDK](https://github.com/lucasacoutinho/pluginsdk) example for a central plugin team that maintains workflows over existing internal services. The plugin connects Acme's service catalog and deployment application through their MCP endpoints.

This branch is set up the way the platform team's plugin repository would be: the source and its published marketplace together. Each example in this repository is a separate branch. The [`main` branch](https://github.com/lucasacoutinho/pluginsdk-examples) lists them.

Acme and its services are fictional. The two `.acme.internal` endpoints are placeholders.

## Repository layout

```text
definition.json                     source: plugin definition and MCP endpoints
skills/triage-incident/             source: incident timeline workflow and report template
skills/release-readiness/           source: rollout readiness workflow and report template

.claude-plugin/marketplace.json     generated: Claude marketplace index
.agents/plugins/marketplace.json    generated: Codex and ChatGPT marketplace index
.pluginsdk/publications.json        generated: published release records
plugins/platform-tools/<digest>/    generated: Claude Code and Codex packages for each release
```

Edit only the sources. `npx pluginsdk publish` writes the generated files and commits them to this branch.

- `triage-incident` builds an incident timeline using service ownership, runbooks and deployment records.
- `release-readiness` checks a candidate release against the service's rollout prerequisites and rollback criteria.

## Try it

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

```sh
git clone --branch platform-tools git@github.com:lucasacoutinho/pluginsdk-examples.git platform-tools
cd platform-tools
npm ci
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it.

Replace the two URLs in `definition.json` with your existing endpoints. Configure service authentication in each client through your organization's supported route. The example does not include a server or a sign-in implementation.

```sh
npx pluginsdk build
npx pluginsdk preview
```

In a fresh session, ask:

> Triage the checkout incident between 14:00 and 14:30 UTC. Error rates rose after the latest deployment. Find the service owner and runbook, compare recent deployments, and give me an evidence-backed timeline and next checks.

Or:

> Check whether checkout version 2.8.0 is ready for a production rollout at 16:00 UTC. Report missing prerequisites and the applicable rollback criteria. Do not deploy anything.

The services determine which tools each user can call. The skills report missing access or records instead of inventing results.

## Release

Increment `version` in `definition.json`, then build and publish:

```sh
npx pluginsdk build
npx pluginsdk publish
```

`publish` adds a commit to this branch with the new package and index entries. Publishing the same version again with different content fails. Commit the source change after publishing.

To approve a version before it reaches developers, use the [release catalog](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/catalog-usage.md) and [distribution review](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/distribution-usage.md). Both guides use this plugin.

## Connect to your organization

A ChatGPT Enterprise workspace can import this marketplace from **Workspace settings > Plugins** by entering `platform-tools` as the branch. See [Plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).

A Claude organization marketplace reads the repository root and follows one branch. Claude's documentation does not describe choosing a branch, so give this plugin its own private repository with the published files on the default branch before you connect it. See [Manage plugins for your organization](https://support.claude.com/en/articles/13837433).

For CLI users:

```sh
git clone --branch platform-tools git@github.com:lucasacoutinho/pluginsdk-examples.git platform-tools-plugin

# Claude Code
claude plugin marketplace add ./platform-tools-plugin --scope user
claude plugin install platform-tools@platform-tools --scope user

# Codex
codex plugin marketplace add ./platform-tools-plugin
codex plugin add platform-tools@platform-tools
```

See [Manage plugins for a team](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/teams.md) for release management and RBAC responsibilities.
