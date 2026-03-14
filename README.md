<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/QuartzProject/VSCode-Extension/main/.github/assets/quartz-logo-rose.png">
    <img src="https://raw.githubusercontent.com/QuartzProject/VSCode-Extension/main/.github/assets/quartz-logo-ink-rose.png" alt="Quartz" width="360">
  </picture>
</p>

<h2 align="center">Quartz for Visual Studio Code</h2>

<p align="center">
  <strong>Highlighting, the language server and a debugger for Quartz.</strong>
</p>

<p align="center">
  <img alt="VS Code" src="https://img.shields.io/badge/VS_Code-1.82+-007ACC">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

## Features

- **Highlighting** of programs (`.qz`) and host interfaces (`.qzi`).
- **Language server** (`quartz-lsp`): diagnostics as you type, hover, go to definition, completion and formatting.
- **Debugger** (`quartz debug --dap`): breakpoints, stepping, the call stack, variables and stopping on traps. Press
  F5 on a Quartz file.

## Requirements

`quartz` and `quartz-lsp` on your `PATH`, or their paths in the `quartz.cli.path` and `quartz.server.path` settings.
Highlighting works without them.

## Building

```sh
npm install
npx @vscode/vsce package
```

The grammar comes from [Grammars](https://github.com/QuartzProject/Grammars): change it there and copy it with
`npm run sync-grammar -- ../Grammars`.

## License

[MIT](LICENSE).
