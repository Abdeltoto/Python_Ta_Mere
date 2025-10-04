/**
 * Système de Raccourcis Clavier pour PythonTaMère
 * Raccourcis pour une navigation rapide et efficace
 */

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        this.setupShortcuts();
        this.bindEvents();
        this.showHelp();
    }

    setupShortcuts() {
        // Navigation
        this.shortcuts.set('ctrl+k', () => this.showSearch());
        this.shortcuts.set('ctrl+1', () => showPage('home'));
        this.shortcuts.set('ctrl+2', () => showPage('lessons'));
        this.shortcuts.set('ctrl+3', () => showPage('profile'));
        this.shortcuts.set('ctrl+4', () => showPage('admin'));
        
        // Exercices
        this.shortcuts.set('ctrl+enter', () => {
            if (document.getElementById('runCode')) {
                runCode();
            }
        });
        this.shortcuts.set('ctrl+s', () => {
            if (document.getElementById('submitCode')) {
                submitCode();
            }
        });
        
        // Modals
        this.shortcuts.set('escape', () => this.closeModals());
        this.shortcuts.set('ctrl+l', () => {
            if (document.getElementById('loginBtn')) {
                showLoginModal();
            }
        });
        
        // Gaming
        this.shortcuts.set('ctrl+t', () => {
            if (window.gamingSystem) {
                window.gamingSystem.toggleTheme();
            }
        });
        this.shortcuts.set('f11', () => {
            if (window.gamingSystem) {
                window.gamingSystem.toggleFullscreen();
            }
        });
        
        // Aide
        this.shortcuts.set('ctrl+?', () => this.showShortcutsHelp());
        this.shortcuts.set('f1', () => this.showShortcutsHelp());
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombo(e);
            
            if (this.shortcuts.has(key)) {
                e.preventDefault();
                this.shortcuts.get(key)();
                
                // Son de raccourci utilisé
                if (window.audioManager) {
                    window.audioManager.playClick();
                }
            }
        });
    }

    getKeyCombo(event) {
        const parts = [];
        
        if (event.ctrlKey) parts.push('ctrl');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        if (event.metaKey) parts.push('meta');
        
        // Ajouter la touche principale
        if (event.key === ' ') {
            parts.push('space');
        } else if (event.key === 'Enter') {
            parts.push('enter');
        } else if (event.key === 'Escape') {
            parts.push('escape');
        } else if (event.key === 'Tab') {
            parts.push('tab');
        } else if (event.key === 'ArrowUp') {
            parts.push('arrowup');
        } else if (event.key === 'ArrowDown') {
            parts.push('arrowdown');
        } else if (event.key === 'ArrowLeft') {
            parts.push('arrowleft');
        } else if (event.key === 'ArrowRight') {
            parts.push('arrowright');
        } else if (event.key.length === 1) {
            parts.push(event.key.toLowerCase());
        } else if (event.key.startsWith('F') && event.key.length <= 3) {
            parts.push(event.key.toLowerCase());
        }
        
        return parts.join('+');
    }

    showSearch() {
        const searchContainer = document.getElementById('searchContainer');
        if (!searchContainer) {
            this.createSearchModal();
        }
        
        const searchContainer = document.getElementById('searchContainer');
        searchContainer.classList.add('active');
        
        const searchInput = document.getElementById('searchInput');
        searchInput.focus();
        
        // Son de recherche
        if (window.audioManager) {
            window.audioManager.playSearch();
        }
    }

    createSearchModal() {
        const modal = document.createElement('div');
        modal.id = 'searchContainer';
        modal.className = 'search-container';
        modal.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <i class="fas fa-search" style="margin-right: 10px; color: var(--text-muted);"></i>
                <input type="text" id="searchInput" class="search-input" placeholder="Rechercher une leçon ou un exercice...">
                <button onclick="this.parentElement.parentElement.classList.remove('active')" 
                        style="margin-left: 10px; background: none; border: none; color: var(--text-muted); cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="searchResults" class="search-results"></div>
        `;
        
        document.body.appendChild(modal);
        
        // Fonctionnalité de recherche
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value, searchResults);
        });
        
        // Fermer avec Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });
    }

    performSearch(query, resultsContainer) {
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        // Recherche dans les leçons
        const lessons = window.appState?.lessons || [];
        const matchingLessons = lessons.filter(lesson => 
            lesson.title.toLowerCase().includes(query.toLowerCase()) ||
            lesson.module.toLowerCase().includes(query.toLowerCase())
        );
        
        let html = '';
        
        if (matchingLessons.length > 0) {
            html += '<div style="font-weight: bold; margin-bottom: 10px; color: var(--text-color);">Leçons</div>';
            matchingLessons.forEach(lesson => {
                html += `
                    <div class="search-result-item" onclick="loadLesson(${lesson.id}); this.parentElement.parentElement.parentElement.classList.remove('active');">
                        <strong>${lesson.title}</strong><br>
                        <small style="color: var(--text-muted);">${lesson.module}</small>
                    </div>
                `;
            });
        }
        
        resultsContainer.innerHTML = html || '<div style="color: var(--text-muted); padding: 20px; text-align: center;">Aucun résultat trouvé</div>';
    }

    closeModals() {
        // Fermer tous les modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Fermer la recherche
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            searchContainer.classList.remove('active');
        }
    }

    showShortcutsHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal active';
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        helpModal.innerHTML = `
            <div style="background: var(--card-bg); padding: 30px; border-radius: 15px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--text-color);">Raccourcis Clavier</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h3 style="color: var(--primary); margin-bottom: 15px;">Navigation</h3>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>1</kbd> - Accueil
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>2</kbd> - Leçons
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>3</kbd> - Profil
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd> - Recherche
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Esc</kbd> - Fermer les modals
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: var(--primary); margin-bottom: 15px;">Exercices</h3>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>Entrée</kbd> - Exécuter le code
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>S</kbd> - Soumettre
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>L</kbd> - Se connecter
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: var(--primary); margin-bottom: 15px;">Interface</h3>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>T</kbd> - Changer de thème
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>F11</kbd> - Plein écran
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>?</kbd> - Aide
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: var(--primary); margin-bottom: 15px;">Gaming</h3>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> - Afficher les points
                        </div>
                        <div style="margin-bottom: 10px;">
                            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> - Afficher les badges
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                    <p style="color: var(--text-muted); margin: 0;">
                        <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                        Appuyez sur <kbd>Ctrl</kbd> + <kbd>?</kbd> ou <kbd>F1</kbd> pour afficher cette aide à tout moment.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        // Fermer avec Escape
        helpModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                helpModal.remove();
            }
        });
        
        // Focus sur le modal
        helpModal.focus();
    }

    showHelp() {
        // Ajouter un indicateur visuel des raccourcis disponibles
        const helpIndicator = document.createElement('div');
        helpIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 0.8rem;
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        helpIndicator.innerHTML = '<i class="fas fa-keyboard"></i> Raccourcis';
        helpIndicator.title = 'Cliquez pour voir les raccourcis clavier';
        
        helpIndicator.addEventListener('click', () => {
            this.showShortcutsHelp();
        });
        
        helpIndicator.addEventListener('mouseenter', () => {
            helpIndicator.style.transform = 'scale(1.05)';
        });
        
        helpIndicator.addEventListener('mouseleave', () => {
            helpIndicator.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(helpIndicator);
    }
}

// Styles pour les touches
const style = document.createElement('style');
style.textContent = `
    kbd {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.9em;
        color: var(--text-color);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Instance globale
const keyboardShortcuts = new KeyboardShortcuts();

// Exporter pour utilisation globale
window.keyboardShortcuts = keyboardShortcuts;
