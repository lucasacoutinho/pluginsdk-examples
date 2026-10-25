Acme engineering context:
- Before opening a pull request, review the change with the change-review skill.
- Production changes ship behind a feature flag and roll out through the deployment service. Do not deploy from a developer machine.
- Ask the user before reading or changing anything in a `secrets/` directory or a `.env` file.
- Use the platform-tools plugin for incidents and release readiness, and the acme-data plugin for warehouse questions.
