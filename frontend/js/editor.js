/**
 * Code Editor - Monaco Editor wrapper
 */

class CodeEditor {
    constructor(containerId) {
        this.containerId = containerId;
        this.editor = null;
        this.isLoading = false;
    }

    async init(initialCode = '') {
        if (this.editor) {
            this.setValue(initialCode);
            return;
        }

        if (this.isLoading) {
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return;
        }

        this.isLoading = true;

        return new Promise((resolve) => {
            require.config({ 
                paths: { 
                    'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
                } 
            });

            require(['vs/editor/editor.main'], () => {
                const container = document.getElementById(this.containerId);
                
                this.editor = monaco.editor.create(container, {
                    value: initialCode,
                    language: 'python',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    tabSize: 4
                });

                this.isLoading = false;
                resolve(this.editor);
            });
        });
    }

    getValue() {
        return this.editor ? this.editor.getValue() : '';
    }

    setValue(code) {
        if (this.editor) {
            this.editor.setValue(code);
        }
    }

    focus() {
        if (this.editor) {
            this.editor.focus();
        }
    }

    dispose() {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }
    }
}

// Instance globale
let codeEditor = null;

function getEditor() {
    if (!codeEditor) {
        codeEditor = new CodeEditor('editor');
    }
    return codeEditor;
}

