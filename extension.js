'use strict';

const vscode = require('vscode');
const { LanguageClient } = require('vscode-languageclient/node');

let client;

async function start() {
    const config = vscode.workspace.getConfiguration('quartz');
    if (!config.get('server.enabled', true)) {
        return;
    }
    const command = config.get('server.path') || 'quartz-lsp';
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
        const command = vscode.workspace.getConfiguration('quartz').get('cli.path') || 'quartz';
        return new vscode.DebugAdapterExecutable(command, ['debug', '--dap']);
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
