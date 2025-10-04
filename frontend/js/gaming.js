/**
 * Système de Gaming pour PythonTaMère
 * Points, badges, streaks et achievements
 */

class GamingSystem {
    constructor() {
        this.points = 0;
        this.streak = 0;
        this.badges = [];
        this.achievements = [];
        this.stats = {
            exercisesCompleted: 0,
            lessonsCompleted: 0,
            totalTimeSpent: 0,
            fastestExercise: null,
            longestStreak: 0
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.createUI();
        this.updateDisplay();
    }

    // Système de Points
    addPoints(amount, reason = '') {
        this.points += amount;
        
        // Son de points gagnés
        if (window.audioManager) {
            window.audioManager.playSuccess();
        }
        
        // Animation de points
        this.showPointsAnimation(amount);
        
        // Vérifier les achievements
        this.checkAchievements();
        
        this.saveData();
        this.updateDisplay();
        
        console.log(`+${amount} points${reason ? ` (${reason})` : ''}`);
    }

    // Système de Streak
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = localStorage.getItem('lastActivity');
        
        if (lastActivity === today) {
            // Déjà actif aujourd'hui
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Streak continue
            this.streak++;
        } else if (lastActivity && lastActivity !== today) {
            // Streak cassé
            this.streak = 1;
        } else {
            // Premier jour
            this.streak = 1;
        }
        
        localStorage.setItem('lastActivity', today);
        
        // Bonus de streak
        if (this.streak > 1) {
            this.addPoints(this.streak * 5, `Streak ${this.streak} jours`);
        }
        
        this.saveData();
        this.updateDisplay();
    }

    // Système de Badges
    awardBadge(badgeId, badgeName, description) {
        if (this.badges.includes(badgeId)) {
            return; // Badge déjà obtenu
        }
        
        this.badges.push(badgeId);
        
        // Son de badge obtenu
        if (window.audioManager) {
            window.audioManager.playVictory();
        }
        
        // Animation de badge
        this.showBadgeAnimation(badgeName, description);
        
        // Notification de badge
        if (window.notificationSystem) {
            window.notificationSystem.showAchievementNotification(badgeName, description);
        }
        
        // Son de badge spécialisé
        if (window.audioManager) {
            window.audioManager.playBadgeEarned();
        }
        
        this.saveData();
        this.updateDisplay();
        
        console.log(`Badge obtenu: ${badgeName}`);
    }

    // Vérifier les Achievements
    checkAchievements() {
        // Premier exercice
        if (this.stats.exercisesCompleted === 1 && !this.badges.includes('first_exercise')) {
            this.awardBadge('first_exercise', 'Premier Code', 'Ton premier exercice Python !');
        }
        
        // 10 exercices
        if (this.stats.exercisesCompleted === 10 && !this.badges.includes('ten_exercises')) {
            this.awardBadge('ten_exercises', 'Débutant Confirmé', '10 exercices complétés !');
        }
        
        // 50 exercices
        if (this.stats.exercisesCompleted === 50 && !this.badges.includes('fifty_exercises')) {
            this.awardBadge('fifty_exercises', 'Python Warrior', '50 exercices complétés !');
        }
        
        // Streak de 7 jours
        if (this.streak === 7 && !this.badges.includes('week_streak')) {
            this.awardBadge('week_streak', 'Consistance', '7 jours de suite !');
        }
        
        // Streak de 30 jours
        if (this.streak === 30 && !this.badges.includes('month_streak')) {
            this.awardBadge('month_streak', 'Détermination', '30 jours de suite !');
        }
        
        // 100 points
        if (this.points >= 100 && !this.badges.includes('hundred_points')) {
            this.awardBadge('hundred_points', 'Centurion', '100 points atteints !');
        }
        
        // 500 points
        if (this.points >= 500 && !this.badges.includes('five_hundred_points')) {
            this.awardBadge('five_hundred_points', 'Maître', '500 points atteints !');
        }
    }

    // Exercice complété
    completeExercise(exerciseId, timeSpent = 0) {
        this.stats.exercisesCompleted++;
        this.stats.totalTimeSpent += timeSpent;
        
        // Points de base
        let points = 10;
        
        // Bonus de vitesse
        if (timeSpent < 30000) { // Moins de 30 secondes
            points += 5;
            if (!this.badges.includes('speed_coder')) {
                this.awardBadge('speed_coder', 'Speed Coder', 'Exercice résolu en moins de 30s !');
            }
        }
        
        // Bonus de streak
        points += this.streak;
        
        this.addPoints(points, 'Exercice complété');
        this.updateStreak();
        
        // Animation de succès
        this.showSuccessAnimation();
        
        // Notification de succès
        if (window.notificationSystem) {
            window.notificationSystem.showSuccessNotification(`Exercice complété ! +${points} points`);
        }
    }

    // Leçon complétée
    completeLesson(lessonId) {
        this.stats.lessonsCompleted++;
        this.addPoints(50, 'Leçon complétée');
        this.updateStreak();
    }

    // Créer l'interface utilisateur
    createUI() {
        // Barre de progression en haut
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        // Affichage des points
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'points-display';
        pointsDisplay.innerHTML = '<i class="fas fa-star"></i><span id="pointsValue">0</span>';
        document.body.appendChild(pointsDisplay);
        
        // Affichage du streak
        const streakDisplay = document.createElement('div');
        streakDisplay.className = 'streak-display';
        streakDisplay.innerHTML = '<i class="fas fa-fire"></i><span id="streakValue">0</span>';
        document.body.appendChild(streakDisplay);
        
        // Bouton de thème
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Changer de thème';
        themeToggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(themeToggle);
        
        // Bouton plein écran
        const fullscreenToggle = document.createElement('button');
        fullscreenToggle.className = 'fullscreen-toggle';
        fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenToggle.title = 'Mode plein écran';
        fullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
        document.body.appendChild(fullscreenToggle);
        
        // Container pour les animations
        const animationContainer = document.createElement('div');
        animationContainer.id = 'animationContainer';
        animationContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(animationContainer);
    }

    // Mettre à jour l'affichage
    updateDisplay() {
        const pointsElement = document.getElementById('pointsValue');
        const streakElement = document.getElementById('streakValue');
        const progressFill = document.querySelector('.progress-fill');
        
        if (pointsElement) {
            pointsElement.textContent = this.points;
        }
        
        if (streakElement) {
            streakElement.textContent = this.streak;
        }
        
        if (progressFill) {
            const totalLessons = 10; // Nombre total de leçons
            const progress = (this.stats.lessonsCompleted / totalLessons) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    // Animations
    showPointsAnimation(amount) {
        const container = document.getElementById('animationContainer');
        const animation = document.createElement('div');
        animation.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--warning);
            font-size: 2rem;
            font-weight: bold;
            animation: pulse 1s ease-out;
        `;
        animation.textContent = `+${amount}`;
        
        container.appendChild(animation);
        
        setTimeout(() => {
            container.removeChild(animation);
        }, 1000);
    }

    showBadgeAnimation(badgeName, description) {
        const container = document.getElementById('animationContainer');
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            padding: 20px;
            border-radius: 15px;
            box-shadow: var(--shadow);
            border: 2px solid var(--warning);
            text-align: center;
            animation: slideIn 0.5s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="color: var(--warning); font-size: 3rem; margin-bottom: 10px;">
                <i class="fas fa-trophy"></i>
            </div>
            <h3 style="color: var(--text-color); margin-bottom: 10px;">${badgeName}</h3>
            <p style="color: var(--text-muted);">${description}</p>
        `;
        
        container.appendChild(modal);
        
        setTimeout(() => {
            container.removeChild(modal);
        }, 3000);
    }

    showSuccessAnimation() {
        const container = document.getElementById('animationContainer');
        
        // Créer des particules
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: confetti ${Math.random() * 2 + 1}s ease-out forwards;
            `;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (container.contains(particle)) {
                    container.removeChild(particle);
                }
            }, 3000);
        }
    }

    // Thème
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Son de changement de thème amélioré
        if (window.audioManager) {
            window.audioManager.playThemeChange();
        }
    }

    // Plein écran
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        
        // Son de plein écran amélioré
        if (window.audioManager) {
            window.audioManager.playFullscreen();
        }
    }

    // Sauvegarder les données
    saveData() {
        const data = {
            points: this.points,
            streak: this.streak,
            badges: this.badges,
            stats: this.stats
        };
        
        localStorage.setItem('gamingData', JSON.stringify(data));
    }

    // Charger les données
    loadData() {
        const saved = localStorage.getItem('gamingData');
        if (saved) {
            const data = JSON.parse(saved);
            this.points = data.points || 0;
            this.streak = data.streak || 0;
            this.badges = data.badges || [];
            this.stats = { ...this.stats, ...data.stats };
        }
        
        // Charger le thème
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Méthodes publiques
    getPoints() { return this.points; }
    getStreak() { return this.streak; }
    getBadges() { return this.badges; }
    getStats() { return this.stats; }
}

// Instance globale
const gamingSystem = new GamingSystem();

// Exporter pour utilisation globale
window.gamingSystem = gamingSystem;
