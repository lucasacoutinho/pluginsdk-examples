# Expand and contract

| Change | Release 1: expand | Release 2: migrate | Release 3: contract |
| --- | --- | --- | --- |
| Rename a column | Add the new column. Write both columns. | Backfill the new column. Read the new column. | Stop writing the old column. Drop it. |
| Change a column type | Add a column with the new type. Write both. | Backfill. Read the new column. | Drop the old column. |
| Add a required column | Add the column as nullable with a default. Write it. | Backfill existing rows. Add a `NOT VALID` check constraint, then validate it. | Set `NOT NULL` and drop the check constraint. |
| Drop a table | Stop reading the table. | Stop writing the table. Keep a backup. | Drop the table. |
| Add an index | `CREATE INDEX CONCURRENTLY` in a migration with `transaction = false`. | None. | None. |

Backfill in batches of bounded size. Commit each batch separately so locks stay short.

A down migration for a contract step cannot restore dropped data. Say so in the plan and name the backup that does.
