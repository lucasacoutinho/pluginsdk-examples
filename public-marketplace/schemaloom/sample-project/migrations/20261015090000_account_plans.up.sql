-- Move billing tier onto accounts and rename email for SSO.
ALTER TABLE accounts ADD COLUMN plan text NOT NULL;
ALTER TABLE accounts RENAME COLUMN email TO login_email;
CREATE INDEX accounts_plan_idx ON accounts (plan);
UPDATE accounts SET plan = 'free; legacy' WHERE created_at < '2026-01-01';
