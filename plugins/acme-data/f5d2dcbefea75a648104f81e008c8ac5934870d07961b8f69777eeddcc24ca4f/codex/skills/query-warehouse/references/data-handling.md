# Data handling rules

| Classification | Catalog tag | Rule |
| --- | --- | --- |
| Public | `public` | No restriction. |
| Internal | `internal` | Aggregate results may appear in answers. |
| Confidential | `confidential` | Return aggregates over at least 20 customers. Do not list individual customers. |
| Restricted | `pii`, `payment` | Do not select these columns. Count or join on them only through the catalog's hashed keys. |

Treat a column without a classification tag as confidential.

Do not copy query results into files, tickets or messages unless the user asks and the classification allows it.
