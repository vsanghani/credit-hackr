/* eslint-env node */
module.exports = {
    root: true,
    env: { browser: true, es2022: true },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
    plugins: ['react', 'react-hooks', 'react-refresh'],
    settings: { react: { version: 'detect' } },
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    overrides: [
        {
            files: ['api/**/*.js'],
            env: { browser: false, node: true }
        },
        {
            files: ['src/context/**/*.{js,jsx}'],
            rules: { 'react-refresh/only-export-components': 'off' }
        }
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    },
    ignorePatterns: ['dist', '.vite', 'node_modules']
};
