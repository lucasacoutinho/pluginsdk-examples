---
name: plan-schema-change
description: Use when planning a Schemaloom schema change that must run without downtime, such as renaming a column, changing a type or adding a required column.
---

# Plan a zero-downtime schema change

Identify the table, the target schema and the application code that reads or writes the affected columns. Search the repository for those reads and writes before writing a plan.

Assume old and new application versions run at the same time during rollout. Each migration must work with the application version before it and the version after it.

Split the change with the [expand and contract steps](references/expand-contract.md). For each release, list:

- The migration files to add, named `<version>_<name>.up.sql` and `<version>_<name>.down.sql`.
- The application change shipped in the same release.
- The check that must pass before the next release starts, such as a completed backfill or zero reads of the old column.

Write migration SQL only when the user asks for it. Run `check_migration` on each file you write and resolve its findings or explain why they do not apply.

Do not combine the expand and contract steps into one release to save time. State the cost of each extra release instead.
