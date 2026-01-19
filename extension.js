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

function activate(context) {
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
