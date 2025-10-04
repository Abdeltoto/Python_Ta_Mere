/**
 * Application principale PythonTaMère
 */

// État de l'application
const appState = {
    currentUser: null,
    currentLesson: null,
    currentExercise: null,
    lessons: []
};

// Navigation
function showPage(pageName) {
    // Son de navigation
    if (window.audioManager) {
        window.audioManager.playNavigation();
    }
    
    // Cacher toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Afficher la page demandée
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Mettre à jour les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    // Mettre à jour l'URL
    window.location.hash = pageName;
}

// Gestion de l'authentification
function updateAuthUI() {
    const isAuth = api.isAuthenticated();
    document.getElementById('loginBtn').style.display = isAuth ? 'none' : 'inline-flex';
    document.getElementById('logoutBtn').style.display = isAuth ? 'inline-flex' : 'none';

    if (isAuth) {
        loadUserData();
    }
}

function updateAdminUI() {
    const isAdmin = appState.currentUser && appState.currentUser.is_admin;
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'flex' : 'none';
    }
}

async function loadUserData() {
    try {
        appState.currentUser = await api.getCurrentUser();
        updateAdminUI();
    } catch (error) {
        console.error('Failed to load user data:', error);
        api.logout();
        updateAuthUI();
    }
}

// Modal de connexion
function showLoginModal() {
    // Son d'ouverture de modal
    if (window.audioManager) {
        window.audioManager.playModalOpen();
    }
    
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    
    // Reset
    document.getElementById('loginStep1').style.display = 'block';
    document.getElementById('loginStep2').style.display = 'none';
    document.getElementById('loginSuccess').style.display = 'none';
    document.getElementById('emailInput').value = '';
}

function hideLoginModal() {
    // Son de fermeture de modal
    if (window.audioManager) {
        window.audioManager.playModalClose();
    }
    
    document.getElementById('loginModal').classList.remove('active');
}

// Leçons
async function loadLessons() {
    const container = document.getElementById('lessonsContainer');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';

    try {
        appState.lessons = await api.getLessons();
        
        if (appState.lessons.length === 0) {
            container.innerHTML = '<p>Aucune leçon disponible pour le moment.</p>';
            return;
        }

        // Grouper par module
        const modules = {};
        appState.lessons.forEach(lesson => {
            if (!modules[lesson.module]) {
                modules[lesson.module] = [];
            }
            modules[lesson.module].push(lesson);
        });

        // Définir l'ordre des modules (Les Bases en premier)
        const moduleOrder = [
            'Les Bases',
            'Contrôle de Flux', 
            'Structures de Données',
            'Programmation Modulaire',
            'Programmation Avancée'
        ];

        let html = '';
        
        // Afficher les modules dans l'ordre défini
        moduleOrder.forEach(moduleName => {
            if (modules[moduleName]) {
                const lessons = modules[moduleName];
                
                html += `<div class="module-section" style="grid-column: 1/-1;">
                    <h2>${moduleName}</h2>
                </div>`;
                
                lessons.forEach(lesson => {
                    const statusClass = lesson.status.replace('_', '-');
                    const statusLabel = {
                        'not_started': 'Pas commencé',
                        'seen': 'En cours',
                        'completed': 'Terminé'
                    }[lesson.status] || 'Pas commencé';

                    html += `
                        <div class="lesson-card" onclick="loadLesson(${lesson.id})">
                            <div class="lesson-module">${lesson.module}</div>
                            <h3>${lesson.title}</h3>
                            <div class="lesson-meta">
                                <span><i class="fas fa-tasks"></i> ${lesson.exercise_count} exercice(s)</span>
                                <span class="lesson-status ${statusClass}">${statusLabel}</span>
                            </div>
                        </div>
                    `;
                });
            }
        });
        
        // Afficher les modules non listés (au cas où il y en aurait)
        Object.keys(modules).forEach(moduleName => {
            if (!moduleOrder.includes(moduleName)) {
                const lessons = modules[moduleName];
                
                html += `<div class="module-section" style="grid-column: 1/-1;">
                    <h2>${moduleName}</h2>
                </div>`;
                
                lessons.forEach(lesson => {
                    const statusClass = lesson.status.replace('_', '-');
                    const statusLabel = {
                        'not_started': 'Pas commencé',
                        'seen': 'En cours',
                        'completed': 'Terminé'
                    }[lesson.status] || 'Pas commencé';

                    html += `
                        <div class="lesson-card" onclick="loadLesson(${lesson.id})">
                            <div class="lesson-module">${lesson.module}</div>
                            <h3>${lesson.title}</h3>
                            <div class="lesson-meta">
                                <span><i class="fas fa-tasks"></i> ${lesson.exercise_count} exercice(s)</span>
                                <span class="lesson-status ${statusClass}">${statusLabel}</span>
                            </div>
                        </div>
                    `;
                });
            }
        });

        container.innerHTML = html;

    } catch (error) {
        console.error('Failed to load lessons:', error);
        container.innerHTML = '<p class="error">Erreur lors du chargement des leçons.</p>';
    }
}

async function loadLesson(lessonId) {
    showPage('lesson-detail');
    
    const container = document.getElementById('lessonContent');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';

    try {
        appState.currentLesson = await api.getLesson(lessonId);
        
        // Rendre le contenu markdown
        const bodyHtml = marked.parse(appState.currentLesson.body_md);
        
        // Créer la liste des exercices
        let exercisesHtml = '<div class="exercises-list"><h2>Exercices</h2>';
        appState.currentLesson.exercises.forEach(exercise => {
            const difficultyStars = '⭐'.repeat(exercise.difficulty);
            const completedIcon = exercise.completed ? 
                '<i class="fas fa-check-circle exercise-completed"></i>' : '';

            exercisesHtml += `
                <div class="exercise-item" onclick="loadExercise(${exercise.id})">
                    <div class="exercise-item-info">
                        <span class="difficulty-badge difficulty-${exercise.difficulty}">${difficultyStars}</span>
                        <span>${exercise.title}</span>
                    </div>
                    ${completedIcon}
                </div>
            `;
        });
        exercisesHtml += '</div>';

        container.innerHTML = `
            <article class="markdown-content">
                <h1>${appState.currentLesson.title}</h1>
                ${bodyHtml}
            </article>
            ${exercisesHtml}
        `;

    } catch (error) {
        console.error('Failed to load lesson:', error);
        container.innerHTML = '<p class="error">Erreur lors du chargement de la leçon.</p>';
    }
}

async function loadExercise(exerciseId) {
    showPage('exercise');
    
    // Démarrer le timer pour l'exercice
    window.exerciseStartTime = Date.now();
    
    document.getElementById('exerciseTitle').textContent = 'Chargement...';
    document.getElementById('exercisePrompt').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i></div>';

    try {
        appState.currentExercise = await api.getExercise(exerciseId);
        
        // Mettre à jour l'interface
        document.getElementById('exerciseTitle').textContent = appState.currentExercise.title;
        document.getElementById('exercisePrompt').innerHTML = `
            <div class="markdown-content">
                ${marked.parse(appState.currentExercise.prompt_md)}
            </div>
        `;

        // Initialiser l'éditeur avec le code de départ
        const editor = getEditor();
        await editor.init(appState.currentExercise.starter_code);

        // Effacer la console et les tests
        document.getElementById('consoleOutput').innerHTML = '';
        document.getElementById('testsOutput').innerHTML = '';

    } catch (error) {
        console.error('Failed to load exercise:', error);
        document.getElementById('exercisePrompt').innerHTML = '<p class="error">Erreur lors du chargement.</p>';
    }
}

// Exécution et validation du code
async function runCode() {
    const editor = getEditor();
    const code = editor.getValue();
    const consoleOutput = document.getElementById('consoleOutput');

    // Son de chargement
    if (window.audioManager) {
        window.audioManager.playLoading();
    }

    consoleOutput.innerHTML = '<div class="console-line"><i class="fas fa-spinner fa-spin"></i> Exécution...</div>';

    try {
        const result = await pythonRunner.runCode(code);
        
        // Son d'exécution du code
        if (window.audioManager) {
            window.audioManager.playCodeRun();
        }

        let output = '';
        if (result.success) {
            output = `<div class="console-line console-success">✓ Exécution terminée (${result.runtime}ms)</div>`;
            output += `<div class="console-line">${escapeHtml(result.output)}</div>`;
        } else {
            output = `<div class="console-line console-error">✗ Erreur d'exécution</div>`;
            output += `<div class="console-line console-error">${escapeHtml(result.error)}</div>`;
            if (result.output) {
                output += `<div class="console-line">${escapeHtml(result.output)}</div>`;
            }
        }

        consoleOutput.innerHTML = output;

    } catch (error) {
        consoleOutput.innerHTML = `<div class="console-line console-error">Erreur: ${escapeHtml(error.message)}</div>`;
    }
}

async function submitCode() {
    if (!appState.currentExercise) return;

    const editor = getEditor();
    const code = editor.getValue();
    const testsOutput = document.getElementById('testsOutput');

    // Basculer vers l'onglet des tests
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="tests"]').classList.add('active');
    document.getElementById('tab-tests').classList.add('active');

    testsOutput.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Exécution des tests...</div>';

    try {
        // Exécuter les tests localement
        const testResults = await pythonRunner.runTests(code, appState.currentExercise.testcases);

        // Afficher les résultats
        let html = '';
        testResults.results.forEach(result => {
            const statusClass = result.passed ? 'passed' : 'failed';
            const icon = result.passed ? 'fa-check-circle' : 'fa-times-circle';

            // Son pour chaque test
            if (window.audioManager) {
                if (result.passed) {
                    window.audioManager.playTestPass();
                } else {
                    window.audioManager.playTestFail();
                }
            }

            html += `
                <div class="test-item ${statusClass}">
                    <i class="fas ${icon}"></i>
                    <div class="test-item-content">
                        <div class="test-item-name">${escapeHtml(result.name)}</div>
                        <div class="test-item-message">${escapeHtml(result.message)}</div>
                    </div>
                </div>
            `;
        });

        const summary = `
            <div class="test-summary" style="padding: 1rem; margin-bottom: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;">
                <strong>Résultats:</strong> ${testResults.passedCount}/${testResults.totalCount} tests réussis
                <br><strong>Temps total:</strong> ${testResults.totalRuntime}ms
            </div>
        `;

        testsOutput.innerHTML = summary + html;

        // Soumettre au serveur si l'utilisateur est connecté
        if (api.isAuthenticated()) {
            try {
                const response = await api.submitSolution(
                    appState.currentExercise.id,
                    code,
                    testResults.passed,
                    testResults.passedCount,
                    testResults.totalCount,
                    testResults.totalRuntime,
                    testResults.passed ? '' : 'Some tests failed'
                );

                if (testResults.passed) {
                    // Son de victoire
                    if (window.audioManager) {
                        window.audioManager.playVictory();
                    }
                    
                    // Points et gaming
                    if (window.gamingSystem) {
                        const timeSpent = Date.now() - (window.exerciseStartTime || Date.now());
                        window.gamingSystem.completeExercise(appState.currentExercise.id, timeSpent);
                    }
                    
                    testsOutput.innerHTML = `
                        <div class="success-message success-animation">
                            <i class="fas fa-trophy"></i>
                            <p>Bravo ! Tous les tests sont passés !</p>
                            <p>${response.message}</p>
                        </div>
                    ` + testsOutput.innerHTML;
                }

            } catch (error) {
                console.error('Failed to submit solution:', error);
            }
        }

    } catch (error) {
        console.error('Failed to run tests:', error);
        testsOutput.innerHTML = `<div class="console-line console-error">Erreur: ${escapeHtml(error.message)}</div>`;
    }
}

// Profil
async function loadProfile() {
    const container = document.getElementById('profileContent');

    if (!api.isAuthenticated()) {
        container.innerHTML = `
            <div class="profile-guest">
                <i class="fas fa-user-circle"></i>
                <p>Vous n'êtes pas connecté.</p>
                <button class="btn btn-primary" onclick="showLoginModal()">
                    Se connecter pour sauvegarder la progression
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';

    try {
        const progress = await api.getMyProgress();

        const completionRate = progress.total_lessons > 0 
            ? Math.round((progress.completed_lessons / progress.total_lessons) * 100)
            : 0;

        const exerciseRate = progress.total_exercises > 0
            ? Math.round((progress.completed_exercises / progress.total_exercises) * 100)
            : 0;

        container.innerHTML = `
            <div class="profile-info">
                <h2><i class="fas fa-user"></i> ${appState.currentUser.email}</h2>
            </div>

            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-value">${progress.completed_lessons}</div>
                    <div class="stat-label">Leçons complétées</div>
                    <div class="stat-sublabel">${completionRate}% de ${progress.total_lessons}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${progress.completed_exercises}</div>
                    <div class="stat-label">Exercices réussis</div>
                    <div class="stat-sublabel">${exerciseRate}% de ${progress.total_exercises}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${progress.recent_submissions.length}</div>
                    <div class="stat-label">Soumissions récentes</div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Failed to load progress:', error);
        container.innerHTML = '<p class="error">Erreur lors du chargement du profil.</p>';
    }
}

// Admin
async function loadAdminPage() {
    if (!appState.currentUser || !appState.currentUser.is_admin) {
        showPage('home');
        alert('Accès réservé aux administrateurs');
        return;
    }

    // Charger les leçons pour les selects
    try {
        const lessons = await api.getLessons();
        const lessonSelect = document.getElementById('lessonSelect');
        lessonSelect.innerHTML = '<option value="">-- Sélectionner une leçon --</option>';
        lessons.forEach(lesson => {
            lessonSelect.innerHTML += `<option value="${lesson.id}">${lesson.title}</option>`;
        });

        // Charger les exercices quand une leçon est sélectionnée
        lessonSelect.addEventListener('change', async (e) => {
            if (e.target.value) {
                const lesson = await api.getLesson(e.target.value);
                const exerciseSelect = document.getElementById('exerciseSelect');
                exerciseSelect.innerHTML = '<option value="">-- Sélectionner un exercice --</option>';
                lesson.exercises.forEach(ex => {
                    exerciseSelect.innerHTML += `<option value="${ex.id}">${ex.title}</option>`;
                });
            }
        });
    } catch (error) {
        console.error('Failed to load lessons for admin:', error);
    }
}

async function createLesson(formData) {
    try {
        const response = await api.request('/lessons', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        alert('Leçon créée avec succès !');
        document.getElementById('createLessonForm').reset();
        return response;
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

async function createExercise(formData) {
    try {
        formData.lesson_id = parseInt(formData.lesson_id);
        formData.difficulty = parseInt(formData.difficulty);
        formData.order = parseInt(formData.order);
        
        const response = await api.request('/exercises', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        alert('Exercice créé avec succès !');
        document.getElementById('createExerciseForm').reset();
        return response;
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

async function createTest(formData) {
    try {
        formData.exercise_id = parseInt(formData.exercise_id);
        formData.timeout_ms = parseInt(formData.timeout_ms);
        formData.order = parseInt(formData.order);
        
        const response = await api.request('/exercises/testcases', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        alert('Test créé avec succès !');
        document.getElementById('createTestForm').reset();
        return response;
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Utilitaires
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialiser les effets sonores sur les éléments
function initializeAudioEffects() {
    if (!window.audioManager) return;
    
    // Sons sur les boutons
    document.querySelectorAll('button').forEach(btn => {
        window.audioManager.addSoundToElement(btn, 'click');
    });
    
    // Sons sur les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        window.audioManager.addSoundToElement(link, 'navigation');
    });
    
    // Sons sur les cartes de leçons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.lesson-card')) {
            window.audioManager.playClick();
        }
        if (e.target.closest('.exercise-item')) {
            window.audioManager.playClick();
        }
    });
    
    // Sons sur les boutons d'exercice
    const runBtn = document.getElementById('runCode');
    const submitBtn = document.getElementById('submitCode');
    
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            window.audioManager.playCodeRun();
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            window.audioManager.playValidation();
        });
    }
    
    // Sons sur les onglets
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            window.audioManager.playClick();
        });
    });
    
    // Sons sur les formulaires admin
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            window.audioManager.playSuccess();
        });
    });
}

// Initialiser la sauvegarde automatique
function initializeAutoSave() {
    // Sauvegarde auto toutes les 30 secondes
    setInterval(() => {
        const editor = getEditor();
        if (editor && appState.currentExercise) {
            const code = editor.getValue();
            localStorage.setItem(`auto_save_${appState.currentExercise.id}`, code);
            
            // Son de sauvegarde
            if (window.audioManager) {
                window.audioManager.playSave();
            }
        }
    }, 30000);
    
    // Sauvegarde lors des changements (debounced)
    let saveTimeout;
    const originalLoadExercise = loadExercise;
    loadExercise = async function(exerciseId) {
        await originalLoadExercise(exerciseId);
        
        // Charger la sauvegarde auto si elle existe
        const savedCode = localStorage.getItem(`auto_save_${exerciseId}`);
        if (savedCode) {
            const editor = getEditor();
            if (editor) {
                editor.setValue(savedCode);
                
                // Son de chargement
                if (window.audioManager) {
                    window.audioManager.playLoad();
                }
            }
        }
        
        // Sauvegarde lors des modifications
        const editor = getEditor();
        if (editor) {
            editor.onDidChangeModelContent(() => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    const code = editor.getValue();
                    localStorage.setItem(`auto_save_${exerciseId}`, code);
                    
                    // Son de sauvegarde silencieux
                    if (window.audioManager) {
                        window.audioManager.playSave();
                    }
                }, 2000); // Sauvegarde après 2 secondes d'inactivité
            });
            
            // Son de frappe (avec throttling)
            let typingTimeout;
            editor.onDidChangeModelContent(() => {
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    if (window.audioManager) {
                        window.audioManager.playTyping();
                    }
                }, 100);
            });
        }
    };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            
            if (page === 'lessons') {
                loadLessons();
            } else if (page === 'profile') {
                loadProfile();
            } else if (page === 'admin') {
                loadAdminPage();
            }
            
            showPage(page);
        });
    });

    // Auth
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('loginFromProfile').addEventListener('click', showLoginModal);
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // Son de déconnexion
        if (window.audioManager) {
            window.audioManager.playLogout();
        }
        
        api.logout();
        updateAuthUI();
        showPage('home');
    });

    document.querySelector('.modal-close').addEventListener('click', hideLoginModal);

    document.getElementById('sendMagicLink').addEventListener('click', async () => {
        const email = document.getElementById('emailInput').value;
        if (!email) return;

        try {
            const response = await api.requestMagicLink(email);
            document.getElementById('loginStep1').style.display = 'none';
            document.getElementById('loginStep2').style.display = 'block';
            document.getElementById('tokenInput').value = response.dev_token;
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });

    document.getElementById('verifyToken').addEventListener('click', async () => {
        const token = document.getElementById('tokenInput').value;
        if (!token) return;

        try {
            await api.verifyToken(token);
            
            // Son de connexion réussie
            if (window.audioManager) {
                window.audioManager.playLogin();
            }
            
            document.getElementById('loginStep2').style.display = 'none';
            document.getElementById('loginSuccess').style.display = 'block';
            
            setTimeout(() => {
                hideLoginModal();
                updateAuthUI();
            }, 1500);
        } catch (error) {
            // Son d'erreur
            if (window.audioManager) {
                window.audioManager.playError();
            }
            alert('Erreur: ' + error.message);
        }
    });

    // Exercise
    document.getElementById('backToLessons').addEventListener('click', () => {
        loadLessons();
        showPage('lessons');
    });

    document.getElementById('backToLesson').addEventListener('click', () => {
        if (appState.currentLesson) {
            loadLesson(appState.currentLesson.id);
        } else {
            loadLessons();
            showPage('lessons');
        }
    });

    document.getElementById('runCode').addEventListener('click', runCode);
    document.getElementById('submitCode').addEventListener('click', submitCode);

    // Output tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });

    // Admin forms
    document.getElementById('createLessonForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        formData.order = parseInt(formData.order);
        await createLesson(formData);
    });

    document.getElementById('createExerciseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        await createExercise(formData);
    });

    document.getElementById('createTestForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        await createTest(formData);
    });

    // Initialisation
    updateAuthUI();
    
    // Initialiser les sons sur les éléments
    initializeAudioEffects();
    
    // Initialiser la sauvegarde auto
    initializeAutoSave();
    
    // Router simple
    const hash = window.location.hash.slice(1);
    if (hash) {
        showPage(hash);
        if (hash === 'lessons') loadLessons();
        if (hash === 'profile') loadProfile();
    } else {
        showPage('home');
    }

    // Précharger Pyodide en arrière-plan
    pythonRunner.init().catch(err => {
        console.error('Failed to preload Pyodide:', err);
    });
});

