/**
 * Système de Recherche Avancé pour PythonTaMère
 * Recherche intelligente dans les leçons, exercices et contenu
 */

class AdvancedSearch {
    constructor() {
        this.searchIndex = [];
        this.searchHistory = [];
        this.filters = {
            module: 'all',
            difficulty: 'all',
            status: 'all',
            type: 'all'
        };
        
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.createSearchUI();
        this.loadSearchHistory();
    }

    async buildSearchIndex() {
        try {
            // Charger les leçons
            const lessons = await api.getLessons();
            
            this.searchIndex = lessons.map(lesson => ({
                id: lesson.id,
                type: 'lesson',
                title: lesson.title,
                module: lesson.module,
                content: lesson.body_md,
                difficulty: this.getDifficultyFromModule(lesson.module),
                status: lesson.status,
                tags: this.extractTags(lesson.body_md),
                searchableText: `${lesson.title} ${lesson.module} ${lesson.body_md}`.toLowerCase()
            }));

            // Charger les exercices
            for (const lesson of lessons) {
                try {
                    const exercises = await api.getExercises(lesson.id);
                    exercises.forEach(exercise => {
                        this.searchIndex.push({
                            id: exercise.id,
                            type: 'exercise',
                            title: exercise.title,
                            module: lesson.module,
                            content: exercise.prompt_md,
                            difficulty: this.getDifficultyFromModule(lesson.module),
                            status: 'not_started', // À améliorer avec le vrai statut
                            tags: this.extractTags(exercise.prompt_md),
                            searchableText: `${exercise.title} ${exercise.prompt_md}`.toLowerCase(),
                            lessonId: lesson.id
                        });
                    });
                } catch (error) {
                    console.warn(`Could not load exercises for lesson ${lesson.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Failed to build search index:', error);
        }
    }

    getDifficultyFromModule(module) {
        const difficultyMap = {
            'Les Bases': 'beginner',
            'Contrôle de Flux': 'intermediate',
            'Structures de Données': 'intermediate',
            'Programmation Modulaire': 'advanced',
            'Programmation Avancée': 'advanced'
        };
        return difficultyMap[module] || 'beginner';
    }

    extractTags(content) {
        const tags = [];
        
        // Extraire les concepts Python
        const pythonConcepts = [
            'variables', 'fonctions', 'boucles', 'conditions', 'listes', 'dictionnaires',
            'classes', 'modules', 'exceptions', 'fichiers', 'regex', 'json', 'requests',
            'numpy', 'pandas', 'matplotlib', 'django', 'flask', 'fastapi'
        ];
        
        pythonConcepts.forEach(concept => {
            if (content.toLowerCase().includes(concept)) {
                tags.push(concept);
            }
        });
        
        return tags;
    }

    createSearchUI() {
        // Améliorer le modal de recherche existant
        this.enhanceSearchModal();
        
        // Ajouter des filtres avancés
        this.addAdvancedFilters();
        
        // Ajouter l'historique de recherche
        this.addSearchHistory();
    }

    enhanceSearchModal() {
        // Le modal de recherche est déjà créé par keyboardShortcuts
        // On va l'améliorer
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            
            // Améliorer l'input
            searchInput.addEventListener('input', (e) => {
                this.performAdvancedSearch(e.target.value, searchResults);
            });
            
            // Ajouter des suggestions en temps réel
            searchInput.addEventListener('focus', () => {
                this.showSuggestions(searchResults);
            });
        }
    }

    addAdvancedFilters() {
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            const filtersHTML = `
                <div class="search-filters" style="margin-bottom: 15px;">
                    <div class="filter-group">
                        <label>Module:</label>
                        <select id="moduleFilter" onchange="window.advancedSearch.setFilter('module', this.value)">
                            <option value="all">Tous les modules</option>
                            <option value="Les Bases">Les Bases</option>
                            <option value="Contrôle de Flux">Contrôle de Flux</option>
                            <option value="Structures de Données">Structures de Données</option>
                            <option value="Programmation Modulaire">Programmation Modulaire</option>
                            <option value="Programmation Avancée">Programmation Avancée</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Difficulté:</label>
                        <select id="difficultyFilter" onchange="window.advancedSearch.setFilter('difficulty', this.value)">
                            <option value="all">Toutes</option>
                            <option value="beginner">Débutant</option>
                            <option value="intermediate">Intermédiaire</option>
                            <option value="advanced">Avancé</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Type:</label>
                        <select id="typeFilter" onchange="window.advancedSearch.setFilter('type', this.value)">
                            <option value="all">Tout</option>
                            <option value="lesson">Leçons</option>
                            <option value="exercise">Exercices</option>
                        </select>
                    </div>
                </div>
            `;
            
            const searchInput = searchContainer.querySelector('.search-input').parentElement;
            searchInput.insertAdjacentHTML('afterend', filtersHTML);
        }
    }

    addSearchHistory() {
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            const historyHTML = `
                <div id="searchHistory" class="search-history" style="margin-top: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: var(--text-color);">Recherches récentes</div>
                    <div id="historyList" class="history-list"></div>
                </div>
            `;
            
            searchContainer.insertAdjacentHTML('beforeend', historyHTML);
            this.updateSearchHistory();
        }
    }

    performAdvancedSearch(query, resultsContainer) {
        if (!query.trim()) {
            this.showSuggestions(resultsContainer);
            return;
        }
        
        // Ajouter à l'historique
        this.addToHistory(query);
        
        // Recherche avec filtres
        const results = this.search(query);
        
        let html = '';
        
        if (results.length > 0) {
            // Grouper par type
            const lessons = results.filter(r => r.type === 'lesson');
            const exercises = results.filter(r => r.type === 'exercise');
            
            if (lessons.length > 0) {
                html += '<div style="font-weight: bold; margin-bottom: 10px; color: var(--text-color);">Leçons</div>';
                lessons.forEach(item => {
                    html += this.createSearchResultHTML(item);
                });
            }
            
            if (exercises.length > 0) {
                html += '<div style="font-weight: bold; margin-bottom: 10px; color: var(--text-color); margin-top: 20px;">Exercices</div>';
                exercises.forEach(item => {
                    html += this.createSearchResultHTML(item);
                });
            }
        } else {
            html = '<div style="color: var(--text-muted); padding: 20px; text-align: center;">Aucun résultat trouvé</div>';
        }
        
        resultsContainer.innerHTML = html;
    }

    search(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return this.searchIndex.filter(item => {
            // Vérifier les filtres
            if (this.filters.module !== 'all' && item.module !== this.filters.module) return false;
            if (this.filters.difficulty !== 'all' && item.difficulty !== this.filters.difficulty) return false;
            if (this.filters.type !== 'all' && item.type !== this.filters.type) return false;
            
            // Recherche textuelle
            return searchTerms.every(term => item.searchableText.includes(term));
        }).sort((a, b) => {
            // Score de pertinence
            const scoreA = this.calculateRelevanceScore(a, searchTerms);
            const scoreB = this.calculateRelevanceScore(b, searchTerms);
            return scoreB - scoreA;
        }).slice(0, 20); // Limiter à 20 résultats
    }

    calculateRelevanceScore(item, searchTerms) {
        let score = 0;
        const text = item.searchableText;
        
        searchTerms.forEach(term => {
            // Score plus élevé si le terme est dans le titre
            if (item.title.toLowerCase().includes(term)) {
                score += 10;
            }
            
            // Score pour les occurrences dans le contenu
            const occurrences = (text.match(new RegExp(term, 'g')) || []).length;
            score += occurrences * 2;
            
            // Score pour les tags
            if (item.tags.some(tag => tag.includes(term))) {
                score += 5;
            }
        });
        
        return score;
    }

    createSearchResultHTML(item) {
        const icon = item.type === 'lesson' ? 'fa-book' : 'fa-code';
        const onClick = item.type === 'lesson' 
            ? `loadLesson(${item.id})`
            : `loadExercise(${item.id})`;
        
        return `
            <div class="search-result-item" onclick="${onClick}; this.parentElement.parentElement.parentElement.classList.remove('active');">
                <div style="display: flex; align-items: center;">
                    <i class="fas ${icon}" style="margin-right: 10px; color: var(--primary);"></i>
                    <div style="flex: 1;">
                        <strong>${item.title}</strong><br>
                        <small style="color: var(--text-muted);">
                            ${item.module} • ${this.getDifficultyLabel(item.difficulty)}
                        </small>
                    </div>
                    <div style="margin-left: 10px;">
                        ${item.tags.slice(0, 3).map(tag => 
                            `<span class="tag" style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem; margin: 1px;">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showSuggestions(resultsContainer) {
        const suggestions = [
            'variables Python',
            'boucles for',
            'conditions if',
            'fonctions',
            'listes',
            'dictionnaires',
            'gestion erreurs',
            'modules'
        ];
        
        let html = '<div style="font-weight: bold; margin-bottom: 10px; color: var(--text-color);">Suggestions</div>';
        suggestions.forEach(suggestion => {
            html += `
                <div class="search-result-item" onclick="document.getElementById('searchInput').value='${suggestion}'; window.advancedSearch.performAdvancedSearch('${suggestion}', document.getElementById('searchResults'));">
                    <i class="fas fa-lightbulb" style="margin-right: 10px; color: var(--warning);"></i>
                    ${suggestion}
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }

    setFilter(filterName, value) {
        this.filters[filterName] = value;
        
        // Re-lancer la recherche avec les nouveaux filtres
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
            this.performAdvancedSearch(searchInput.value, document.getElementById('searchResults'));
        }
    }

    addToHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Garder seulement 10 recherches
            this.saveSearchHistory();
            this.updateSearchHistory();
        }
    }

    updateSearchHistory() {
        const historyList = document.getElementById('historyList');
        if (historyList) {
            let html = '';
            this.searchHistory.forEach(query => {
                html += `
                    <div class="history-item" onclick="document.getElementById('searchInput').value='${query}'; window.advancedSearch.performAdvancedSearch('${query}', document.getElementById('searchResults'));">
                        <i class="fas fa-history" style="margin-right: 5px; color: var(--text-muted);"></i>
                        ${query}
                    </div>
                `;
            });
            historyList.innerHTML = html || '<div style="color: var(--text-muted); font-style: italic;">Aucune recherche récente</div>';
        }
    }

    loadSearchHistory() {
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            this.searchHistory = JSON.parse(saved);
        }
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            'beginner': 'Débutant',
            'intermediate': 'Intermédiaire',
            'advanced': 'Avancé'
        };
        return labels[difficulty] || 'Débutant';
    }
}

// Styles pour la recherche avancée
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .search-filters {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        align-items: center;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .filter-group label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: bold;
    }
    
    .filter-group select {
        padding: 5px 10px;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 0.9rem;
    }
    
    .search-history {
        border-top: 1px solid var(--border-color);
        padding-top: 15px;
    }
    
    .history-item {
        padding: 8px;
        cursor: pointer;
        border-radius: 5px;
        transition: background 0.3s ease;
        font-size: 0.9rem;
        color: var(--text-muted);
    }
    
    .history-item:hover {
        background: var(--primary);
        color: white;
    }
    
    .tag {
        display: inline-block;
        margin: 1px;
    }
`;
document.head.appendChild(searchStyle);

// Instance globale
const advancedSearch = new AdvancedSearch();

// Exporter pour utilisation globale
window.advancedSearch = advancedSearch;
