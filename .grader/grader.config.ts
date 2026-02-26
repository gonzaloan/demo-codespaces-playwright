import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './checks',
    fullyParallel: false,
    retries: 0,
    workers: 1, //Check run sequentially.
    reporter: [
        ['html', { outputFolder: '../grader-report', open: 'never' }],
        ['json', { outputFile: '../grader-results.json' }], //This can be process after by github actions. to score
        ['list']
    ],
    use: {
        baseURL: 'https://demo.nopcommerce.com',
    },
});