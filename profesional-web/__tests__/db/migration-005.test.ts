import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

const migrationPath = path.join(process.cwd(), 'migrations', '005_leads_patch.sql');

describe('Migration 005 leads patch', () => {
  it('incluye columnas faltantes y índices', async () => {
    const sql = await fs.readFile(migrationPath, 'utf-8');
    const requiredColumns = [
      'company_name',
      'sector',
      'company_size',
      'pains',
      'roi_data',
      'utm_campaign',
      'utm_source',
      'utm_medium',
      'unsubscribed',
      'updated_at',
    ];
    requiredColumns.forEach((column) => {
      expect(sql).toContain(`ADD COLUMN IF NOT EXISTS ${column}`);
    });
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_leads_email');
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_leads_created_at');
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_leads_nurturing');
  });
});
