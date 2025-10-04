/**
 * Système de Notifications pour PythonTaMère
 * Notifications push, rappels et alertes intelligentes
 */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.permission = 'default';
        this.settings = {
            enabled: true,
            sound: true,
            desktop: true,
            reminders: true,
            achievements: true
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.requestPermission();
        this.createNotificationUI();
        this.setupReminders();
    }

    async requestPermission() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
    }

    createNotificationUI() {
        // Container pour les notifications
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);

        // Bouton de paramètres des notifications
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'notification-settings-btn';
        settingsBtn.innerHTML = '<i class="fas fa-bell"></i>';
        settingsBtn.title = 'Paramètres des notifications';
        settingsBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 140px;
            z-index: 1000;
            background: var(--card-bg);
            border: none;
            color: var(--text-color);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            box-shadow: var(--shadow);
        `;
        
        settingsBtn.addEventListener('click', () => this.showSettings());
        document.body.appendChild(settingsBtn);
    }

    showNotification(title, message, type = 'info', duration = 5000) {
        if (!this.settings.enabled) return;

        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date()
        };

        this.notifications.unshift(notification);
        this.displayNotification(notification);
        
        // Son de notification amélioré selon le type
        if (this.settings.sound && window.audioManager) {
            switch(type) {
                case 'success':
                    window.audioManager.playSuccess();
                    break;
                case 'error':
                    window.audioManager.playError();
                    break;
                case 'achievement':
                    window.audioManager.playBadgeEarned();
                    break;
                case 'reminder':
                    window.audioManager.playNotification();
                    break;
                default:
                    window.audioManager.playNotification();
            }
        }

        // Notification desktop
        if (this.settings.desktop && this.permission === 'granted') {
            this.showDesktopNotification(title, message);
        }

        // Auto-suppression
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, duration);
    }

    displayNotification(notification) {
        const container = document.getElementById('notificationContainer');
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.style.cssText = `
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease-out;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            achievement: 'fa-trophy',
            reminder: 'fa-clock'
        };

        element.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 10px; color: var(--${notification.type === 'achievement' ? 'warning' : notification.type});">
                    <i class="fas ${iconMap[notification.type]}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: var(--text-color); margin-bottom: 5px;">
                        ${notification.title}
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">
                        ${notification.message}
                    </div>
                </div>
                <button onclick="window.notificationSystem.removeNotification(${notification.id})" 
                        style="background: none; border: none; color: var(--text-muted); cursor: pointer; margin-left: 10px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        element.addEventListener('click', () => {
            this.removeNotification(notification.id);
        });

        container.appendChild(element);
    }

    removeNotification(id) {
        const container = document.getElementById('notificationContainer');
        const element = container.querySelector(`[onclick*="${id}"]`)?.parentElement?.parentElement;
        if (element) {
            element.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                }
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    showDesktopNotification(title, message) {
        if (this.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }

    // Notifications spécifiques
    showSuccessNotification(message) {
        this.showNotification('Succès !', message, 'success');
    }

    showErrorNotification(message) {
        this.showNotification('Erreur', message, 'error');
    }

    showAchievementNotification(badgeName, description) {
        this.showNotification(`Badge Obtenu: ${badgeName}`, description, 'achievement', 8000);
    }

    showReminderNotification(message) {
        this.showNotification('Rappel', message, 'reminder');
    }

    showProgressNotification(progress) {
        this.showNotification('Progression', `Vous avez complété ${progress}% de votre objectif !`, 'info');
    }

    // Système de rappels
    setupReminders() {
        if (!this.settings.reminders) return;

        // Rappel quotidien
        this.scheduleDailyReminder();
        
        // Rappel de streak
        this.scheduleStreakReminder();
        
        // Rappel d'objectifs
        this.scheduleGoalReminder();
    }

    scheduleDailyReminder() {
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(19, 0, 0, 0); // 19h00
        
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }
        
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.showReminderNotification('Il est temps de pratiquer Python ! 🐍');
            this.scheduleDailyReminder(); // Programmer le prochain rappel
        }, timeUntilReminder);
    }

    scheduleStreakReminder() {
        const lastActivity = localStorage.getItem('lastActivity');
        const today = new Date().toDateString();
        
        if (lastActivity !== today) {
            // Pas d'activité aujourd'hui, rappeler demain
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0); // 9h00
            
            const timeUntilReminder = tomorrow.getTime() - Date.now();
            
            setTimeout(() => {
                this.showReminderNotification('N\'oubliez pas de maintenir votre streak ! 🔥');
            }, timeUntilReminder);
        }
    }

    scheduleGoalReminder() {
        // Rappel hebdomadaire des objectifs
        setInterval(() => {
            const stats = window.gamingSystem?.getStats() || {};
            const exercisesThisWeek = stats.exercisesThisWeek || 0;
            
            if (exercisesThisWeek < 5) {
                this.showReminderNotification(`Objectif hebdomadaire: ${5 - exercisesThisWeek} exercices restants !`);
            }
        }, 7 * 24 * 60 * 60 * 1000); // Toutes les semaines
    }

    showSettings() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.style.cssText = `
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
        
        modal.innerHTML = `
            <div style="background: var(--card-bg); padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--text-color);">Paramètres des Notifications</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="settings-list">
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.enabled ? 'checked' : ''} 
                                   onchange="window.notificationSystem.settings.enabled = this.checked; window.notificationSystem.saveSettings();">
                            Activer les notifications
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.sound ? 'checked' : ''} 
                                   onchange="window.notificationSystem.settings.sound = this.checked; window.notificationSystem.saveSettings();">
                            Sons de notification
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.desktop ? 'checked' : ''} 
                                   onchange="window.notificationSystem.settings.desktop = this.checked; window.notificationSystem.saveSettings();">
                            Notifications desktop
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.reminders ? 'checked' : ''} 
                                   onchange="window.notificationSystem.settings.reminders = this.checked; window.notificationSystem.saveSettings();">
                            Rappels automatiques
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.achievements ? 'checked' : ''} 
                                   onchange="window.notificationSystem.settings.achievements = this.checked; window.notificationSystem.saveSettings();">
                            Notifications d'achievements
                        </label>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                    <p style="color: var(--text-muted); margin: 0;">
                        <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                        Les notifications vous aident à rester motivé et à suivre vos progrès.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fermer avec Escape
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }

    loadSettings() {
        const saved = localStorage.getItem('notificationSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }
}

// Styles pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-success {
        border-left: 4px solid var(--success);
    }
    
    .notification-error {
        border-left: 4px solid var(--danger);
    }
    
    .notification-warning {
        border-left: 4px solid var(--warning);
    }
    
    .notification-info {
        border-left: 4px solid var(--secondary);
    }
    
    .notification-achievement {
        border-left: 4px solid var(--warning);
        background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 193, 7, 0.1) 100%);
    }
    
    .notification-reminder {
        border-left: 4px solid var(--primary);
    }
    
    .settings-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .setting-item label {
        display: flex;
        align-items: center;
        color: var(--text-color);
        cursor: pointer;
    }
    
    .setting-item input[type="checkbox"] {
        margin-right: 10px;
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);

// Instance globale
const notificationSystem = new NotificationSystem();

// Exporter pour utilisation globale
window.notificationSystem = notificationSystem;
