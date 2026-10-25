# Acme engineering standards

| Area | Standard |
| --- | --- |
| Secrets | No credentials, tokens or connection strings in code, tests or fixtures. Read them from the secret manager at runtime. |
| Rollout | User-visible behavior changes ship behind a feature flag with a named owner and removal date. |
| Data | Schema changes follow expand and contract. Migrations must not lock large tables. |
| Observability | New endpoints and jobs emit request count, error count and latency. Errors are logged with a request identifier. |
| Dependencies | New third-party dependencies need a license on the approved list and a pinned version. |
| Access | Authorization is checked in the service that owns the data, not only in the client or gateway. |
| Tests | Bug fixes include a test that fails without the fix. |
