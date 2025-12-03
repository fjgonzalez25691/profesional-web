import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

const migrationPath = path.join(process.cwd(), 'migrations', '004_nurturing.sql');

describe('Migration 004 nurturing', () => {
  it('incluye columnas nurturing_stage y last_email_sent_at', async () => {
    const sql = await fs.readFile(migrationPath, 'utf-8');

    expect(sql).toContain('CREATE TABLE IF NOT EXISTS leads');
    expect(sql).toContain('ALTER TABLE leads ADD COLUMN IF NOT EXISTS nurturing_stage INTEGER DEFAULT 0;');
    expect(sql).toContain('ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMP;');
  });
});
