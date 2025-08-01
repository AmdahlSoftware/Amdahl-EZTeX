/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

/**
 * Activates the LaTeX Compiler extension.
 * Registers the compile command for LaTeX files.
 */
export function activate(context: vscode.ExtensionContext) {
	const compileCommand = vscode.commands.registerCommand('latex-compiler.compile', () => {
		let filePath = '';
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			filePath = editor.document.fileName;
			if (!filePath.endsWith('.tex')) {
				vscode.window.showErrorMessage('Active file is not a LaTeX (.tex) file.');
				return;
			}
		}

		if (!editor) {
			vscode.window.showErrorMessage('No active editor.');
			return;
		}

		const dir = path.dirname(filePath);
		vscode.window.showInformationMessage(`Compiling LaTeX file: ${filePath}`);
		exec(`pdflatex -interaction=nonstopmode -halt-on-error -output-directory "${dir}" "${filePath}"`, { timeout: 10000 }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`LaTeX compile error: ${stderr || stdout}`);
			} else {
				vscode.window.showInformationMessage('LaTeX file compiled successfully.');
			}
			console.log(stdout);
		});
	});
	context.subscriptions.push(compileCommand);
}

/**
 * Deactivates the extension.
 */
export function deactivate() { }
