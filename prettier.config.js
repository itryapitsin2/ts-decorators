module.exports = {
  // Why include an unnecessary character at the end of every line? Break the habit (automatically)!
  semi: true,
  printWidth: 100,
  singleQuote: true,
  // Trailing commas help with git merging and conflict resolution
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  tabWidth: 4,
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' },
    },
    {
      files: 'LICENSE',
      options: { parser: 'markdown' },
    },
  ],
};
