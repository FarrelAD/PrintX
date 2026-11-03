import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import i18next from 'i18next';
import idJson from '../app/locales/id.json';
import enJson from '../app/locales/en.json';

type NestedDict = { [key: string]: string | NestedDict };

function flattenKeys(obj: NestedDict, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value as NestedDict, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

const idKeys = flattenKeys(idJson);
const enKeys = flattenKeys(enJson);

describe('i18n Localization Integrity', () => {
  it('should have exact key parity between English and Indonesian dictionaries', () => {
    const idKeySet = new Set(Object.keys(idKeys));
    const enKeySet = new Set(Object.keys(enKeys));

    const missingInId = [...enKeySet].filter((k) => !idKeySet.has(k));
    const missingInEn = [...idKeySet].filter((k) => !enKeySet.has(k));

    expect(missingInId, `Keys present in en.json but missing in id.json: ${missingInId.join(', ')}`).toEqual([]);
    expect(missingInEn, `Keys present in id.json but missing in en.json: ${missingInEn.join(', ')}`).toEqual([]);
  });

  it('should have non-empty translation strings for all keys', () => {
    for (const [key, value] of Object.entries(idKeys)) {
      expect(value.trim().length, `Empty Indonesian translation for key: ${key}`).toBeGreaterThan(0);
    }
    for (const [key, value] of Object.entries(enKeys)) {
      expect(value.trim().length, `Empty English translation for key: ${key}`).toBeGreaterThan(0);
    }
  });

  it('should contain all static translation keys referenced in app source code', () => {
    const appDir = path.resolve(__dirname, '../app');
    const tCallRegex = /\bt\(\s*['"]([a-zA-Z0-9_.]+)['"]/g;
    const missingInDicts: string[] = [];

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'locales' && entry.name !== 'node_modules') {
            scanDir(fullPath);
          }
        } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          let match: RegExpExecArray | null;
          while ((match = tCallRegex.exec(content)) !== null) {
            const key = match[1];
            if (!idKeys[key] || !enKeys[key]) {
              missingInDicts.push(`${key} (in ${path.relative(appDir, fullPath)})`);
            }
          }
        }
      }
    }

    scanDir(appDir);
    expect(missingInDicts, `Source code references missing translation keys: \n${missingInDicts.join('\n')}`).toEqual([]);
  });

  it('should resolve wizard.step3.nav_next and dynamic interpolation accurately', async () => {
    const i18n = i18next.createInstance();
    await i18n.init({
      lng: 'id',
      fallbackLng: 'id',
      resources: {
        id: { translation: idJson },
        en: { translation: enJson },
      },
      interpolation: { escapeValue: false },
    });

    // Check Indonesian
    expect(i18n.t('wizard.step3.nav_next')).toBe('Pratinjau & Selesai');
    expect(i18n.t('wizard.step3.click_hint', { column: 'Nama' })).toBe('Klik di mana saja untuk menempatkan "Nama"');
    expect(i18n.t('wizard.step5.processing_desc', { count: 25 })).toBe('Memproses 25 data dengan resolusi tinggi');

    // Switch to English
    await i18n.changeLanguage('en');
    expect(i18n.t('wizard.step3.nav_next')).toBe('Preview & Finish');
    expect(i18n.t('wizard.step3.click_hint', { column: 'Nama' })).toBe('Click anywhere to place "Nama"');
    expect(i18n.t('wizard.step5.processing_desc', { count: 25 })).toBe('Processing 25 records with high resolution');
  });
});
