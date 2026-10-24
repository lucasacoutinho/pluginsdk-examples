# Private marketplace for internal plugins

Acme's platform team publishes internal plugins to a private Git repository: the root of this repository's `main` branch. The plugins connect to internal MCP services, and the services keep enforcing each user's access.

Four plugins share the `acme` marketplace:

| Plugin | Features | Purpose |
| --- | --- | --- |
| [acme-engineering](acme-engineering/) | Skill, `SessionStart` hook | Reviews changes against engineering standards. Adds the team's working context to every session. |
| [acme-data](acme-data/) | Skill, shared agent, two remote MCP services | Answers business questions from the warehouse with certified tables and data handling rules. |
| [platform-tools](../platform-tools/) | Two skills, two remote MCP services | Incident triage and release readiness over the service catalog and deployment service. |
| [release-notes](../release-notes/) | Skill, template | Drafts release notes from a Git range. |

All four definitions use the same destination:

```json
"publish": {
  "type": "git",
  "repository": "git@github.com:lucasacoutinho/pluginsdk-examples.git",
  "branch": "main",
  "marketplace": "acme"
}
```

Each plugin can have its own owning team and release schedule. To connect the marketplace to Claude or ChatGPT, follow the [repository README](../README.md#connect-to-claude). Publishing one plugin keeps the others' entries and files in the repository.

## Build and preview

Replace the `.acme.internal` URLs with your existing endpoints. Then, after [setup](../README.md#develop-locally), from the repository root:

```sh
cd private-marketplace/acme-data
npx pluginsdk build
npx pluginsdk preview
```

The hook in `acme-engineering` needs Node 24.18+ on the client's `PATH`. Codex asks the user to approve a new or changed hook. Cursor rejects packages with hooks or agents. When Cursor is installed, preview these two plugins with `--target claude_code` or `--target codex`. See [Supported clients](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/compatibility.md).

In a fresh session with `acme-data`, ask:

> What was net revenue retention for enterprise accounts in Q3, by region? Use certified tables and show the queries.

With `acme-engineering`, ask:

> Review this branch against our engineering standards before I open a pull request.

## Release with approval

Publishing to the repository is enough when the organization's Claude or ChatGPT admin settings control who can install each plugin. Developers who use the Claude Code or Codex CLI directly can also install with the commands in [Publish a plugin](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/publishing.md#install-the-published-plugin), using `acme` as the marketplace.

When releases need approval before they reach developers, use the release catalog:

1. [Package and admit](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/catalog-usage.md) each approved version under your organization and integration name.
2. [Plan and apply a distribution](https://github.com/lucasacoutinho/pluginsdk/blob/main/docs/distribution-usage.md) of that release to named Claude Code and Codex destinations.

The same steps apply to public plugins. To offer the [Schemaloom plugin](../public-marketplace/schemaloom/) internally, admit a reviewed release of it into your catalog instead of letting developers install from the public repository.

## Access stays in the services

The plugins contain instructions and endpoint declarations. They grant no roles. The warehouse decides which tables and columns each signed-in user can read, and the deployment service decides who can roll back. Users authenticate through each service's existing route. Keep credentials out of the definitions: the headers are empty, and a build for both clients rejects environment-backed headers.

The skills tell the agent to report a denied permission instead of working around it. That rule is guidance for the agent. Only the service enforces access.
