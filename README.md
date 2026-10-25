# Release notes plugin

The smallest [PluginSDK](https://github.com/lucasacoutinho/pluginsdk) example: one skill and a template, with no external service. The plugin drafts a release from Git history. It identifies the commit range, reads the changes, separates user-visible behavior from refactors, and produces notes with commit and file evidence.

This branch is set up the way the plugin's own repository would be: the source and its published marketplace together. Each example in this repository is a separate branch. The [`main` branch](https://github.com/lucasacoutinho/pluginsdk-examples) lists them.

## Repository layout

```text
definition.json                     source: plugin definition
skills/release-notes/
  SKILL.md                          source: the workflow
  references/template.md            source: the release notes format

.claude-plugin/marketplace.json     generated: Claude marketplace index
.agents/plugins/marketplace.json    generated: Codex and ChatGPT marketplace index
.pluginsdk/publications.json        generated: published release records
plugins/release-notes/<digest>/     generated: Claude Code and Codex packages for each release
```

Edit only the sources. `npx pluginsdk publish` writes the generated files and commits them to this branch.

## Try it

Use Node 24+ on Linux or Windows x64 and a [supported client](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

```sh
git clone --branch release-notes git@github.com:lucasacoutinho/pluginsdk-examples.git release-notes
cd release-notes
npm ci
npx pluginsdk build
npx pluginsdk preview
```

`npm ci` installs and builds PluginSDK from its Git repository, so you need read access to it. `preview` installs a development copy in your local Claude Code and Codex.

Open a fresh session in a Git repository and ask:

> Use the release-notes skill to draft the next release from v1.4.0 to HEAD. Include breaking changes and upgrade steps, with evidence for each note.

Use a tag that exists in your repository. Edit `skills/release-notes/references/template.md` and run `preview` again to change the format in both clients. Remove the development copy with `npx pluginsdk preview --remove`.

Follow [Get started](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/getting-started.md) for a walkthrough.

## Release

Increment `version` in `definition.json`, then build and publish:

```sh
npx pluginsdk build
npx pluginsdk publish
```

`publish` adds a commit to this branch with the new package and index entries. Publishing the same version again with different content fails. Commit the source change after publishing.

## Install the published plugin

```sh
git clone --branch release-notes git@github.com:lucasacoutinho/pluginsdk-examples.git release-notes-plugin

# Claude Code
claude plugin marketplace add ./release-notes-plugin --scope user
claude plugin install release-notes@release-notes --scope user

# Codex
codex plugin marketplace add ./release-notes-plugin
codex plugin add release-notes@release-notes
```

A ChatGPT Enterprise workspace can import it from **Workspace settings > Plugins** by entering `release-notes` as the branch. See [Plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).
