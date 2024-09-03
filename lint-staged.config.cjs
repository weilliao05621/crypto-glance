module.exports = {
  "*.{js,jsx,ts,tsx,cjs}": [
    "eslint --cache --fix --report-unused-disable-directives --max-warnings=0",
    // https://github.com/okonet/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
    () => "pnpm run check:types",
  ],
  "**": "pnpm run spell-check",
};
