-- Añadir campos faltantes manteniendo SERIAL (opción A)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sector VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_size VARCHAR(20);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pains JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS roi_data JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'roi-calculator';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_nurturing ON leads(nurturing_stage, calendly_booked);
