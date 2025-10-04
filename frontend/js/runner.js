/**
 * Python Runner - Exécute du code Python dans le navigateur avec Pyodide
 */

class PythonRunner {
    constructor() {
        this.pyodide = null;
        this.isLoading = false;
        this.isReady = false;
    }

    async init() {
        if (this.isReady) return;
        if (this.isLoading) {
            // Attendre que le chargement se termine
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return;
        }

        this.isLoading = true;
        
        try {
            console.log('Loading Pyodide...');
            this.pyodide = await loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            });
            this.isReady = true;
            console.log('Pyodide loaded successfully');
        } catch (error) {
            console.error('Failed to load Pyodide:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async runCode(code, timeout = 5000) {
        await this.init();

        const output = [];
        const startTime = Date.now();

        try {
            // Capturer stdout/stderr
            await this.pyodide.runPythonAsync(`
import sys
from io import StringIO
_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
            `);

            // Exécuter le code avec timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Execution timeout')), timeout);
            });

            const executionPromise = this.pyodide.runPythonAsync(code);
            await Promise.race([executionPromise, timeoutPromise]);

            // Récupérer les sorties
            const stdout = await this.pyodide.runPythonAsync('_stdout.getvalue()');
            const stderr = await this.pyodide.runPythonAsync('_stderr.getvalue()');

            if (stdout) output.push(stdout);
            if (stderr) output.push(`[Error] ${stderr}`);

            const runtime = Date.now() - startTime;

            return {
                success: true,
                output: output.join('\n') || '(no output)',
                runtime,
                error: null
            };

        } catch (error) {
            const runtime = Date.now() - startTime;
            return {
                success: false,
                output: output.join('\n'),
                runtime,
                error: error.message
            };
        } finally {
            // Restaurer stdout/stderr
            try {
                await this.pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
                `);
            } catch (e) {
                console.error('Failed to restore stdout/stderr:', e);
            }
        }
    }

    async runTests(userCode, testCases) {
        await this.init();

        const results = [];

        for (const testCase of testCases) {
            const startTime = Date.now();
            
            try {
                // Préparer l'environnement de test
                await this.pyodide.runPythonAsync(`
import sys
from io import StringIO
_test_stdout = StringIO()
_test_stderr = StringIO()
sys.stdout = _test_stdout
sys.stderr = _test_stderr

# Variables pour le test
user_code = ${JSON.stringify(userCode)}
                `);

                // Exécuter le code utilisateur
                await this.pyodide.runPythonAsync(userCode);

                // Exécuter le test
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Test timeout')), testCase.timeout_ms || 5000);
                });

                const testPromise = this.pyodide.runPythonAsync(testCase.code_snippet);
                await Promise.race([testPromise, timeoutPromise]);

                const runtime = Date.now() - startTime;

                results.push({
                    name: testCase.name,
                    passed: true,
                    runtime,
                    message: 'Test passed'
                });

            } catch (error) {
                const runtime = Date.now() - startTime;
                results.push({
                    name: testCase.name,
                    passed: false,
                    runtime,
                    message: error.message
                });
            } finally {
                // Nettoyer l'environnement
                try {
                    await this.pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
# Nettoyer les variables
import builtins
for name in list(dir()):
    if not name.startswith('_') and name not in dir(builtins):
        try:
            del globals()[name]
        except:
            pass
                    `);
                } catch (e) {
                    console.error('Failed to clean environment:', e);
                }
            }
        }

        const passedCount = results.filter(r => r.passed).length;
        const totalCount = results.length;

        return {
            passed: passedCount === totalCount,
            passedCount,
            totalCount,
            results,
            totalRuntime: results.reduce((sum, r) => sum + r.runtime, 0)
        };
    }
}

// Instance globale
const pythonRunner = new PythonRunner();

