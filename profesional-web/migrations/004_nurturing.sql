-- Crear tabla leads si no existe (estructura completa)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  company VARCHAR(255),
  employees_current INTEGER,
  turnover_annual INTEGER,
  savings_annual INTEGER,
  payback_months INTEGER,
  calendly_booked BOOLEAN DEFAULT FALSE,
  calendly_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  nurturing_stage INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMP
);

-- Garantizar columnas de nurturing en caso de tabla previa
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nurturing_stage INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMP;

-- 0 = email inicial enviado
-- 1 = email día 1 enviado
-- 2 = email día 3 enviado
-- 3 = agendó (completado)
-- -1 = desuscrito
