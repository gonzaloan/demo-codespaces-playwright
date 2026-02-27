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

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('Code Quality Validation', () => {

    test('spec files use expect() assertions', () => {
        const specs = readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts');
        expect(specs.length, 'No .spec.ts files found in tests/').toBeGreaterThan(0);
        for (const spec of specs) {
            expect(spec.content, `${spec.name} has no expect() assertions`).toContain('expect(');
        }
    });

    test('project uses Playwright locators (getByRole, getByPlaceholder, etc)', () => {
        const locatorPatterns = /getByRole|getByPlaceholder|getByLabel|getByText|getByTestId/;
        const pages = readAllFiles(join(SRC_DIR, 'pages'), '.ts');
        const specs = readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts');
        const allFiles = [...pages, ...specs];
        const usesLocators = allFiles.some(f => locatorPatterns.test(f.content));
        expect(usesLocators, 'No Playwright locators found in pages/ or tests/').toBe(true);
    });

    test('page classes exist and export a class', () => {
        const pages = readAllFiles(join(SRC_DIR, 'pages'), '.ts');
        expect(pages.length, 'No page class files found in pages/').toBeGreaterThan(0);
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
        expect(allFiles.length, 'No source files found to validate imports').toBeGreaterThan(0);
        for (const file of allFiles) {
            const importMatches = [...file.content.matchAll(/^import\s+\{([^}]+)\}[^\n]*/gm)];
            for (const match of importMatches) {
                const names = match[1].split(',').map(n => n.trim()).filter(n => n.length > 0);
                // Remove the import line itself before checking for usage
                const contentWithoutImport = file.content.replace(match[0], '');
                for (const name of names) {
                    const usageRegex = new RegExp(`\\b${escapeRegex(name)}\\b`);
                    expect(
                        usageRegex.test(contentWithoutImport),
                        `${file.name}: '${name}' imported but never used`
                    ).toBe(true);
                }
            }
        }
    });

    test('tests navigate to the target application', () => {
        const specs = readAllFiles(join(SRC_DIR, 'tests'), '.spec.ts');
        expect(specs.length, 'No .spec.ts files found in tests/').toBeGreaterThan(0);
        const navigates = specs.some(f => f.content.includes('goto('));
        expect(navigates, 'No test calls page.goto() — make sure your test navigates to the application').toBe(true);
    });

});
