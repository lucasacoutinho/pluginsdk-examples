---
name: query-warehouse
description: Use when answering a business or product question with data from Acme's internal warehouse, such as revenue, usage, retention or funnel metrics.
---

# Query the Acme warehouse

Restate the question as a metric, a time range with timezone, and the segments to compare. Ask only for parts that are missing and change the answer.

Find the source tables with the `data-catalog` MCP server before writing SQL. Prefer tables marked certified. Read each table's owner, freshness and column descriptions. Use the catalog's metric definition when one exists instead of writing your own.

Run queries with the `warehouse` MCP server's read-only tools. Read each tool's description before calling it. Start with a row count or a small sample to check joins and filters, then run the full query.

Follow the [data handling rules](references/data-handling.md). The warehouse enforces column and row access for the signed-in user. When a query fails for permissions, report the table and the access request route from the catalog. Do not look for another table that exposes the same data.

Report:

- The answer, with units and the time range.
- Each query you ran, and the tables it read.
- Table freshness and any caveat from the catalog.
- Assumptions you made about the question.

Do not create tables, schedule queries or export results outside the conversation.
