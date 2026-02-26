import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SRC_DIR = join(__dirname, '../../src');

function readAllFiles(dir: string, ext: string): { name: string; content: string }[] {
    try {
        return readdirSync(dir)
            .filter(f => f.endsWith(ext))
            .map(f => ({ name: f, content: readFileSync(join(dir, f), 'utf-8') }));
    } catch {
        return [];
    }
}

test.describe('Code Quality Validation', () => {

    test('spec files use expect() assertions', () => {
        const specs = readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts');
        for (const spec of specs) {
            expect(spec.content, `${spec.name} has no expect() assertions`).toContain('expect(');
        }
    });

    test('spec files use Playwright locators (getByRole, getByPlaceholder, etc)', () => {
        const locatorPatterns = /getByRole|getByPlaceholder|getByLabel|getByText|getByTestId/;
        const specs = readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts');
        for (const spec of specs) {
            expect(spec.content, `${spec.name} should use Playwright locators`).toMatch(locatorPatterns);
        }
    });

    test('page classes exist and export a class', () => {
        const pages = readAllFiles(join(SRC_DIR, 'pages'), '.ts');
        for (const page of pages) {
            expect(page.content, `${page.name} should export a class`).toMatch(/export\s+(default\s+)?class\s+/);
        }
    });

    test('test data is loaded from JSON files', () => {
        const specs = readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts');
        const pages = readAllFiles(join(SRC_DIR, 'pages'), '.ts');
        const allFiles = [...specs, ...pages];
        const usesJson = allFiles.some(f => f.content.includes('.json'));
        expect(usesJson, 'No file imports data from a JSON file').toBe(true);
    });

    test('no unused imports detected', () => {
        const allFiles = [
            ...readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts'),
            ...readAllFiles(join(SRC_DIR, 'pages'), '.ts'),
        ];
        for (const file of allFiles) {
            const imports = [...file.content.matchAll(/import\s+\{([^}]+)\}/g)];
            for (const match of imports) {
                const names = match[1].split(',').map(n => n.trim());
                for (const name of names) {
                    const usageCount = file.content.split(name).length - 1;
                    // 1 from import + at least 1 usage = minimum 2
                    expect(usageCount, `${file.name}: '${name}' imported but never used`).toBeGreaterThan(1);
                }
            }
        }
    });

});