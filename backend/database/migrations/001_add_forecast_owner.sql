-- Adds ownership to forecasts created before the multi-user forecast model.
-- Safe to run repeatedly on PostgreSQL.
ALTER TABLE forecasts ADD COLUMN IF NOT EXISTS owner_id INTEGER;

UPDATE forecasts AS forecast
SET owner_id = product.owner_id
FROM products AS product
WHERE forecast.product_id = product.id
  AND forecast.owner_id IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM forecasts WHERE owner_id IS NULL) THEN
        RAISE EXCEPTION 'Cannot migrate forecasts: a forecast has no matching product owner.';
    END IF;

    ALTER TABLE forecasts ALTER COLUMN owner_id SET NOT NULL;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_forecasts_owner_id'
    ) THEN
        ALTER TABLE forecasts
        ADD CONSTRAINT fk_forecasts_owner_id
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS ix_forecasts_owner_id ON forecasts(owner_id);
