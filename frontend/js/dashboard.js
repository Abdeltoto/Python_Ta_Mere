/**
 * Dashboard Personnel pour PythonTaMère
 * Statistiques, graphiques et progression détaillée
 */

class PersonalDashboard {
    constructor() {
        this.stats = {
            totalTimeSpent: 0,
            exercisesCompleted: 0,
            lessonsCompleted: 0,
            averageTimePerExercise: 0,
            streakDays: 0,
            favoriteModule: '',
            progressByModule: {},
            dailyActivity: {},
            achievements: []
        };
        
        this.init();
    }

    init() {
        this.loadStats();
        this.createDashboard();
    }

    loadStats() {
        // Charger les stats depuis le gaming system
        if (window.gamingSystem) {
            const gamingStats = window.gamingSystem.getStats();
            this.stats = { ...this.stats, ...gamingStats };
        }
        
        // Charger les stats depuis localStorage
        const savedStats = localStorage.getItem('dashboardStats');
        if (savedStats) {
            this.stats = { ...this.stats, ...JSON.parse(savedStats) };
        }
    }

    createDashboard() {
        // Ajouter l'onglet Dashboard dans la navigation
        this.addDashboardTab();
        
        // Créer la page dashboard
        this.createDashboardPage();
    }

    addDashboardTab() {
        const nav = document.querySelector('.nav-links');
        if (nav && !document.getElementById('dashboardTab')) {
            const dashboardTab = document.createElement('a');
            dashboardTab.id = 'dashboardTab';
            dashboardTab.href = '#';
            dashboardTab.className = 'nav-link';
            dashboardTab.dataset.page = 'dashboard';
            dashboardTab.innerHTML = '<i class="fas fa-chart-line"></i> Dashboard';
            nav.appendChild(dashboardTab);
        }
    }

    createDashboardPage() {
        const pagesContainer = document.getElementById('pages');
        if (pagesContainer && !document.getElementById('page-dashboard')) {
            const dashboardPage = document.createElement('div');
            dashboardPage.id = 'page-dashboard';
            dashboardPage.className = 'page';
            dashboardPage.innerHTML = this.getDashboardHTML();
            pagesContainer.appendChild(dashboardPage);
        }
    }

    getDashboardHTML() {
        return `
            <div class="container">
                <div class="page-header">
                    <h1><i class="fas fa-chart-line"></i> Mon Dashboard</h1>
                    <p>Suivez votre progression et vos statistiques</p>
                </div>

                <div class="dashboard-grid">
                    <!-- Statistiques Générales -->
                    <div class="dashboard-card stats-overview">
                        <h3><i class="fas fa-trophy"></i> Vue d'ensemble</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value" id="totalPoints">${this.stats.totalPoints || 0}</div>
                                <div class="stat-label">Points Totaux</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value" id="totalExercises">${this.stats.exercisesCompleted || 0}</div>
                                <div class="stat-label">Exercices Complétés</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value" id="totalLessons">${this.stats.lessonsCompleted || 0}</div>
                                <div class="stat-label">Leçons Complétées</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value" id="currentStreak">${this.stats.streakDays || 0}</div>
                                <div class="stat-label">Streak Actuel</div>
                            </div>
                        </div>
                    </div>

                    <!-- Progression par Module -->
                    <div class="dashboard-card module-progress">
                        <h3><i class="fas fa-layer-group"></i> Progression par Module</h3>
                        <div id="moduleProgressChart" class="progress-chart">
                            ${this.getModuleProgressHTML()}
                        </div>
                    </div>

                    <!-- Activité Récente -->
                    <div class="dashboard-card recent-activity">
                        <h3><i class="fas fa-history"></i> Activité Récente</h3>
                        <div id="recentActivity" class="activity-list">
                            ${this.getRecentActivityHTML()}
                        </div>
                    </div>

                    <!-- Badges et Achievements -->
                    <div class="dashboard-card achievements">
                        <h3><i class="fas fa-medal"></i> Badges Obtenus</h3>
                        <div id="achievementsList" class="achievements-grid">
                            ${this.getAchievementsHTML()}
                        </div>
                    </div>

                    <!-- Graphique de Temps -->
                    <div class="dashboard-card time-chart">
                        <h3><i class="fas fa-clock"></i> Temps Passé</h3>
                        <div id="timeChart" class="chart-container">
                            <canvas id="timeChartCanvas" width="400" height="200"></canvas>
                        </div>
                    </div>

                    <!-- Objectifs -->
                    <div class="dashboard-card goals">
                        <h3><i class="fas fa-target"></i> Objectifs</h3>
                        <div class="goals-list">
                            ${this.getGoalsHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getModuleProgressHTML() {
        const modules = ['Les Bases', 'Contrôle de Flux', 'Structures de Données', 'Programmation Modulaire', 'Programmation Avancée'];
        let html = '';
        
        modules.forEach(module => {
            const progress = this.stats.progressByModule?.[module] || 0;
            html += `
                <div class="module-progress-item">
                    <div class="module-name">${module}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-percentage">${progress}%</div>
                </div>
            `;
        });
        
        return html;
    }

    getRecentActivityHTML() {
        const activities = this.stats.recentActivities || [];
        if (activities.length === 0) {
            return '<p class="no-activity">Aucune activité récente</p>';
        }
        
        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    getAchievementsHTML() {
        const badges = window.gamingSystem?.getBadges() || [];
        if (badges.length === 0) {
            return '<p class="no-achievements">Aucun badge obtenu pour le moment</p>';
        }
        
        return badges.map(badge => `
            <div class="achievement-item">
                <div class="achievement-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="achievement-name">${badge}</div>
            </div>
        `).join('');
    }

    getGoalsHTML() {
        return `
            <div class="goal-item">
                <div class="goal-progress">
                    <div class="goal-bar" style="width: 60%"></div>
                </div>
                <div class="goal-text">Compléter 5 exercices cette semaine</div>
                <div class="goal-status">3/5</div>
            </div>
            <div class="goal-item">
                <div class="goal-progress">
                    <div class="goal-bar" style="width: 80%"></div>
                </div>
                <div class="goal-text">Maintenir une streak de 7 jours</div>
                <div class="goal-status">6/7</div>
            </div>
            <div class="goal-item">
                <div class="goal-progress">
                    <div class="goal-bar" style="width: 40%"></div>
                </div>
                <div class="goal-text">Atteindre 100 points</div>
                <div class="goal-status">40/100</div>
            </div>
        `;
    }

    updateStats() {
        this.loadStats();
        this.updateDashboard();
    }

    updateDashboard() {
        // Mettre à jour les valeurs
        const elements = {
            totalPoints: this.stats.totalPoints || 0,
            totalExercises: this.stats.exercisesCompleted || 0,
            totalLessons: this.stats.lessonsCompleted || 0,
            currentStreak: this.stats.streakDays || 0
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Mettre à jour les graphiques
        this.updateCharts();
    }

    updateCharts() {
        // Graphique de temps (simplifié)
        const canvas = document.getElementById('timeChartCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dessiner un graphique simple
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 150);
            ctx.lineTo(100, 120);
            ctx.lineTo(150, 100);
            ctx.lineTo(200, 80);
            ctx.lineTo(250, 60);
            ctx.lineTo(300, 40);
            ctx.stroke();
        }
    }

    addActivity(text, icon = 'fa-check') {
        const activities = this.stats.recentActivities || [];
        activities.unshift({
            text,
            icon,
            time: new Date().toLocaleString()
        });
        
        // Garder seulement les 10 dernières activités
        this.stats.recentActivities = activities.slice(0, 10);
        this.saveStats();
        this.updateDashboard();
    }

    saveStats() {
        localStorage.setItem('dashboardStats', JSON.stringify(this.stats));
    }
}

// Instance globale
const personalDashboard = new PersonalDashboard();

// Exporter pour utilisation globale
window.personalDashboard = personalDashboard;
