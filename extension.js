'use strict';

const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { LanguageClient } = require('vscode-languageclient/node');

let client;
let extensionPath;

// The default name means the copy in the extension's bin/ (the platform packages carry one), then the PATH.
function tool(setting, name) {
    const configured = vscode.workspace.getConfiguration('quartz').get(setting) || name;
    if (configured !== name) {
        return configured;
    }
    const bundled = path.join(extensionPath, 'bin', process.platform === 'win32' ? `${name}.exe` : name);
    if (!fs.existsSync(bundled)) {
        return name;
    }
    if (process.platform !== 'win32') {
        try {
            fs.accessSync(bundled, fs.constants.X_OK);
        } catch {
            try {
                fs.chmodSync(bundled, 0o755);
            } catch {}
        }
    }
    return bundled;
}

async function start() {
    const config = vscode.workspace.getConfiguration('quartz');
    if (!config.get('server.enabled', true)) {
        return;
    }
    const command = tool('server.path', 'quartz-lsp');
    const serverOptions = { command, args: [] };
    const clientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'quartz' },
            { scheme: 'untitled', language: 'quartz' },
        ],
    };
    client = new LanguageClient('quartz', 'Quartz Language Server', serverOptions, clientOptions);
    try {
        await client.start();
    } catch (err) {
        client = undefined;
        vscode.window.showWarningMessage(`Quartz: could not start '${command}' (${err.message}). Set quartz.server.path.`);
    }
}

async function stop() {
    if (client) {
        const old = client;
        client = undefined;
        await old.stop();
    }
}

async function restart() {
    await stop();
    await start();
}

// The debugger is the CLI itself: `quartz debug --dap` speaks the Debug Adapter Protocol on stdin and stdout.
class QuartzDebugAdapterFactory {
    createDebugAdapterDescriptor() {
        return new vscode.DebugAdapterExecutable(tool('cli.path', 'quartz'), ['debug', '--dap']);
    }
}

class QuartzDebugConfigurationProvider {
    provideDebugConfigurations() {
        return [
            { type: 'quartz', request: 'launch', name: 'Run current file', program: '${file}' },
            { type: 'quartz', request: 'launch', name: 'Run tests', program: '${workspaceFolder}', tests: true },
        ];
    }

    resolveDebugConfiguration(folder, config) {
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'quartz') {
                return config;
            }
            return { type: 'quartz', request: 'launch', name: 'Run current file', program: '${file}' };
        }
        return config;
    }
}

function activate(context) {
    extensionPath = context.extensionPath;
    context.subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory('quartz', new QuartzDebugAdapterFactory()),
        vscode.debug.registerDebugConfigurationProvider('quartz', new QuartzDebugConfigurationProvider()),
        vscode.debug.registerDebugConfigurationProvider(
            'quartz',
            new QuartzDebugConfigurationProvider(),
            vscode.DebugConfigurationProviderTriggerKind.Dynamic,
        ),
    );
    context.subscriptions.push(vscode.commands.registerCommand('quartz.restartServer', restart));
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('quartz.server')) {
                restart();
            }
        }),
    );
    return start();
}

function deactivate() {
    return stop();
}

module.exports = { activate, deactivate };
