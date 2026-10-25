# PluginSDK examples

Example plugins and marketplaces for [PluginSDK](https://github.com/lucasacoutinho/pluginsdk). Each example is a separate branch, set up the way its own repository would be: plugin sources, the published marketplace, and the PluginSDK CLI as a development dependency.

| Branch | Example | Shows |
| --- | --- | --- |
| [`release-notes`](https://github.com/lucasacoutinho/pluginsdk-examples/tree/release-notes) | Release notes plugin | The smallest plugin: one skill and a template, with no external service. |
| [`platform-tools`](https://github.com/lucasacoutinho/pluginsdk-examples/tree/platform-tools) | Internal operations plugin | Shared incident and release workflows over existing internal MCP services. |
| [`schemaloom`](https://github.com/lucasacoutinho/pluginsdk-examples/tree/schemaloom) | Public marketplace for an open-source tool | Two plugins for a fictional migration CLI, including a bundled stdio MCP server that reads the user's files. |
| [`acme`](https://github.com/lucasacoutinho/pluginsdk-examples/tree/acme) | Private enterprise marketplace | Internal plugins with a session hook, a shared agent and internal MCP services, ready to connect to a Claude organization or ChatGPT workspace. |

Acme, its internal services and Schemaloom are fictional. Their MCP endpoints are placeholders.

## Use an example

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md). Clone one branch:

```sh
git clone --branch release-notes git@github.com:lucasacoutinho/pluginsdk-examples.git release-notes
cd release-notes
npm ci
npx pluginsdk build
npx pluginsdk preview
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it. Each branch's README describes its plugins, prompts to try, and how to release and install them.

## Branch layout

```text
definition.json or <plugin>/definition.json   source: what the author maintains
.claude-plugin/marketplace.json               generated: Claude marketplace index
.agents/plugins/marketplace.json              generated: Codex and ChatGPT marketplace index
.pluginsdk/publications.json                  generated: published release records
plugins/<id>/<digest>/                        generated: Claude Code and Codex packages
```

Every definition publishes to its own branch. `npx pluginsdk publish` commits the generated files next to the sources, so a branch always shows a plugin's source together with its published releases.

## Connect to an organization

A ChatGPT Enterprise workspace imports any example from **Workspace settings > Plugins** by entering its branch. A Claude organization connects a private repository and reads its root. Claude's documentation does not describe choosing a branch, so copy an example to its own repository before you connect it. The [`acme` README](https://github.com/lucasacoutinho/pluginsdk-examples/tree/acme) covers both admin flows.
