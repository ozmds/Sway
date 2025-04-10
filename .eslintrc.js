module.exports = {
    extends: [
        'airbnb-base',
        'plugin:react/recommended',
        'plugin:cypress/recommended',
        'plugin:storybook/recommended'
    ],
    plugins: ['@typescript-eslint', 'react-hooks'],
    parser: '@typescript-eslint/parser',
    ignorePatterns: [
        'src/serviceWorker.js',
        'src/reportWebVitals.js',
        'build/**/*.js',
        'cypress/e2e/examples/*.js',
        'cypress/support/*.ts'
    ],
    rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-unused-vars': 'off',
        'operator-linebreak': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'object-curly-newline': 'off',
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
        'comma-spacing': 'off',
        indent: 'off',
        'comma-dangle': ['error', 'never'],
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true
            }
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'jsx-quotes': ['error', 'prefer-single'],
        'react/jsx-no-literals': ['error'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['draft']
            }
        ],
        'no-confusing-arrow': 'off',
        'no-spaced-func': 'off',
        'func-call-spacing': 'off',
        'sort-imports': [
            'warn',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true
            }
        ],
        'import/order': [
            'warn',
            {
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                },
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                    'type'
                ]
            }
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never'
            }
        ],
        'newline-per-chained-call': 'off',
        'no-unsafe-optional-chaining': 'off'
    },
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            excludedFiles: ['*.test.tsx'],
            rules: {
                'max-lines': ['warn', 250]
            }
        },
        {
            files: ['*Display.tsx'],
            rules: {
                'max-lines': ['warn', 250]
            }
        },
        {
            files: ['*App.tsx'],
            rules: {
                'max-lines': ['warn', 500]
            }
        },
        {
            files: ['*.spec.ts', '*.spec.tsx'],
            extends: ['plugin:playwright/recommended']
        }
    ],
    env: {
        browser: true,
        jest: true
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    }
};
