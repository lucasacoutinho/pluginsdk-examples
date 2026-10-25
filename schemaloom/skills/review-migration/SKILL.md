---
name: review-migration
description: Use when reviewing Schemaloom migrations before merge or release, or when asked whether a migration is safe to run in production.
---

# Review Schemaloom migrations

Find the migrations directory. Schemaloom reads it from `migrations.directory` in `schemaloom.toml` and defaults to `migrations/`. Pass absolute paths to the tools.

Call `list_migrations` with the directory. Report every issue it returns. A missing down migration is a finding, not an error in the tool.

Select the migrations to review. Use the versions named in the request. Otherwise use the migrations added or changed on the current branch, which you can find with `git diff --name-only` against the base branch.

Call `check_migration` for each selected up and down file. The tool flags statements by pattern. Read each flagged statement in the file and confirm or dismiss the finding with a reason. Also read the unflagged statements. The tool does not parse dollar-quoted function bodies or detect data backfills that run in one large transaction.

For each confirmed finding, explain the production effect: data loss, lock duration, or breakage for application versions still running during rollout. Propose a concrete rewrite. Use the [plan-schema-change](../plan-schema-change/SKILL.md) steps when a change needs more than one release.

Check that each down migration reverses its up migration. State when a down migration cannot restore deleted data.

Use the [review report template](references/review-report.md). Do not run migrations, connect to a database or edit migration files unless the user asks.
