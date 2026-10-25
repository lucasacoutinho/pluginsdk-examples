# Migration review: <versions>

**Verdict:** Safe to run | Safe with changes | Requires a multi-release plan

## Migration set

| Version | Name | Up | Down | Issues |
| --- | --- | --- | --- | --- |
| <version> | <name> | <file> | <file or missing> | <issues from list_migrations> |

## Findings

### <rule>: <file>:<line>

- **Statement:** `<excerpt>`
- **Production effect:** <data loss, lock, or rollout breakage>
- **Rewrite:** <concrete SQL or plan step>

## Dismissed findings

| Rule | Location | Reason |
| --- | --- | --- |

## Rollback

<What each down migration restores, and what it cannot restore.>
