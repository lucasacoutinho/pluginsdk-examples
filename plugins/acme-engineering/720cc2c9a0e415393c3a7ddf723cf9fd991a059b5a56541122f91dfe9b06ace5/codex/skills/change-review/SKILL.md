---
name: change-review
description: Use when reviewing a code change against Acme engineering standards before a pull request or merge.
---

# Review a change against Acme standards

Find the change. Use the pull request, commit range or files named in the request. Otherwise compare the current branch with its base branch.

Read the full diff and the code around each change. Check it against the [engineering standards](references/standards.md). Run the repository's existing test and lint commands for the affected packages when they are available.

For each finding, give the file and line, the standard it breaks, the effect in production and a concrete fix. Rank findings by severity. Do not report style preferences that the repository's linter does not enforce.

List the standards you could not check, such as a rollout plan that is not in the repository.

Do not push, merge, approve or comment on a pull request unless the user asks.
