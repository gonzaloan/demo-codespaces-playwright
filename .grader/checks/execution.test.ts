import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
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
            // Si playwright sale con exit code != 0, hay fallos
            expect(false, `Student tests failed to execute:\n${error.stdout || error.message}`).toBe(true);
        }
    });

    test('HTML report was generated', () => {
        const reportPath = join(ROOT_DIR, 'playwright-report', 'index.html');
        expect(existsSync(reportPath), 'HTML report not generated').toBe(true);
    });

});