import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '../..');

test.describe('Test Execution Validation', () => {

    test('student tests execute successfully', () => {
        try {
            const result = execSync('npx playwright test --config=playwright.config.ts --reporter=json', {
                cwd: ROOT_DIR,
                encoding: 'utf-8',
                timeout: 120_000,
            });

            const report = JSON.parse(result);
            const failed = report.suites
                ?.flatMap((s: any) => s.specs ?? [])
                ?.filter((s: any) => s.ok === false) ?? [];

            expect(failed.length, 'Some student tests failed').toBe(0);
        } catch (error: any) {
            expect(false, `Student tests failed to execute:\n${error.stdout || error.message}`).toBe(true);
        }
    });

    test('HTML reporter is configured', () => {
        const configPath = join(ROOT_DIR, 'playwright.config.ts');
        const configContent = readFileSync(configPath, 'utf-8');
        expect(configContent, 'playwright.config.ts should include html reporter').toContain('html');
    });

});