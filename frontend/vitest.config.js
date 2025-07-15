import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    css: true,
    coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
            'node_modules/',
            'src/test-setup.js',
            'src/**/*.test.{js,jsx}',
            'src/**/*.spec.{js,jsx}',
            'src/**/__tests__/**',
            'src/**/__mocks__/**',
            'src/**/test-utils.{js,jsx}',
            'dist/',
            'coverage/',
            'public/',
            '*.config.js',
            '*.config.ts',
        ],
        thresholds: {
            global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
            },
        },
    },
    },
    resolve: {
        alias: {
        '@': resolve(__dirname, './src'),
        '@/test-utils': resolve(__dirname, './src/__tests__/test-utils'),
        '@/mocks': resolve(__dirname, './src/__tests__/__mocks__'),
        '@/helpers': resolve(__dirname, './src/__tests__/helpers'),
        },
    },
});
