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

## Install

Every commit to `main` publishes a release, numbered `0.<n>` until 1.0, on the
[releases page](https://github.com/QuartzProject/VSCode-Extension/releases). Download the `.vsix` for your
system (`linux-x64`, `linux-arm64`, `darwin-arm64`, `win32-x64` or `win32-arm64`) and pick
**Extensions: Install from VSIX...** in the command palette. It carries `quartz-lsp` and `quartz`, so nothing else
needs installing.

The `.vsix` without a platform looks for `quartz` and `quartz-lsp` from a
[Quartz release](https://github.com/QuartzProject/Quartz/releases) on your `PATH`. The `quartz.cli.path` and
`quartz.server.path` settings point at other copies.

## Building

```sh
npm install
npx @vscode/vsce package
```

Copy `quartz` and `quartz-lsp` into `bin/` and add `--target <platform>` to build a platform package.

The grammar comes from [Grammars](https://github.com/QuartzProject/Grammars): change it there and copy it here with
`npm run sync-grammar -- <Grammars sources>`.

## License

[MIT](LICENSE).
