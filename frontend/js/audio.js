/**
 * Système Audio pour PythonTaMère
 * Gestionnaire d'effets sonores pour une expérience gaming immersive
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.7;
        this.init();
    }

    init() {
        // Créer les sons synthétiques avec Web Audio API
        this.createSounds();
        
        // Vérifier les préférences utilisateur
        this.loadPreferences();
        
        // Ajouter les contrôles audio à l'interface
        this.addAudioControls();
    }

    createSounds() {
        // Son de clic/bouton - Plus riche
        this.sounds.click = this.createRichTone([800, 1000], 0.1, 'sine');
        
        // Son de succès - Accord majeur
        this.sounds.success = this.createChord([523, 659, 784, 1047], 0.4, 'triangle');
        
        // Son d'échec - Accord mineur dissonant
        this.sounds.error = this.createChord([200, 250, 300], 0.6, 'sawtooth');
        
        // Son de notification - Plus mélodieux
        this.sounds.notification = this.createMelody([1000, 1200, 1400], 0.15);
        
        // Son de progression - Ascendant
        this.sounds.progress = this.createAscendingMelody([400, 500, 600, 700], 0.2);
        
        // Son de victoire - Fanfare complète
        this.sounds.victory = this.createVictoryFanfare();
        
        // Son de hover - Plus subtil
        this.sounds.hover = this.createTone(1200, 0.08, 'sine');
        
        // Son de chargement - Pulsation
        this.sounds.loading = this.createPulsingTone(400, 0.3);
        
        // Son de validation - Accord de confirmation
        this.sounds.validation = this.createChord([440, 554, 659, 880], 0.3, 'triangle');
        
        // Son de navigation - Glissando
        this.sounds.navigation = this.createGlissando(600, 800, 0.2);
        
        // Son de code exécuté - Séquence de notes
        this.sounds.codeRun = this.createMelody([600, 700, 800, 900], 0.25);
        
        // Son de test réussi - Accord joyeux
        this.sounds.testPass = this.createChord([523, 659, 784], 0.25, 'triangle');
        
        // Son de test échoué - Son plus dramatique
        this.sounds.testFail = this.createDramaticError();
        
        // Son de leçon complétée - Mélodie triomphante
        this.sounds.lessonComplete = this.createTriumphantMelody();
        
        // Son de connexion - Accord d'accueil
        this.sounds.login = this.createChord([440, 554, 659, 784, 1047], 0.4, 'triangle');
        
        // Son de déconnexion - Descendant
        this.sounds.logout = this.createDescendingMelody([600, 500, 400, 300], 0.3);
        
        // Son de modal ouvert - Ascendant doux
        this.sounds.modalOpen = this.createAscendingMelody([500, 600, 700], 0.15);
        
        // Son de modal fermé - Descendant doux
        this.sounds.modalClose = this.createDescendingMelody([700, 600, 500], 0.15);
        
        // Nouveaux sons avancés
        this.sounds.levelUp = this.createLevelUpSound();
        this.sounds.badgeEarned = this.createBadgeSound();
        this.sounds.streakBonus = this.createStreakSound();
        this.sounds.search = this.createSearchSound();
        this.sounds.themeChange = this.createThemeChangeSound();
        this.sounds.fullscreen = this.createFullscreenSound();
        this.sounds.typing = this.createTypingSound();
        this.sounds.delete = this.createDeleteSound();
        this.sounds.save = this.createSaveSound();
        this.sounds.load = this.createLoadSound();
    }

    createTone(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    createChord(frequencies, duration, waveType = 'sine') {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                oscillator.connect(gainNode);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = waveType;
                
                oscillator.start(audioContext.currentTime + index * 0.05);
                oscillator.stop(audioContext.currentTime + duration);
            });
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        };
    }

    createMelody(frequencies, noteDuration) {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    // Nouvelles méthodes de création de sons avancés
    createRichTone(frequencies, duration, waveType = 'sine') {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                oscillator.connect(gainNode);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = waveType;
                
                oscillator.start(audioContext.currentTime + index * 0.02);
                oscillator.stop(audioContext.currentTime + duration);
            });
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        };
    }

    createAscendingMelody(frequencies, noteDuration) {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    createDescendingMelody(frequencies, noteDuration) {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    createGlissando(startFreq, endFreq, duration) {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(endFreq, audioContext.currentTime + duration);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    createPulsingTone(frequency, duration) {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'triangle';
            
            // Créer un effet de pulsation
            const pulseInterval = 0.1;
            const pulses = Math.floor(duration / pulseInterval);
            
            for (let i = 0; i < pulses; i++) {
                const startTime = audioContext.currentTime + i * pulseInterval;
                const endTime = startTime + pulseInterval * 0.5;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
            }
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    createVictoryFanfare() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523, 659, 784, 1047, 1319, 1568]; // Do Mi Sol Do Mi Sol
            const noteDuration = 0.2;
            
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    createDramaticError() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Son dramatique descendant
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.5);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        };
    }

    createTriumphantMelody() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523, 659, 784, 1047, 1319, 1568, 1760]; // Mélodie triomphante
            const noteDuration = 0.15;
            
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    // Nouveaux sons spécialisés
    createLevelUpSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [440, 554, 659, 880, 1109]; // Ascension de niveau
            const noteDuration = 0.1;
            
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    createBadgeSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [659, 784, 1047, 1319]; // Son de badge
            const noteDuration = 0.2;
            
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                const startTime = audioContext.currentTime + index * noteDuration;
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    createStreakSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Son de streak - pulsation rapide
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        };
    }

    createSearchSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }

    createThemeChangeSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.2);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        };
    }

    createFullscreenSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.15);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        };
    }

    createTypingSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.05, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        };
    }

    createDeleteSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.1);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }

    createSaveSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }

    createLoadSound() {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }

    // Méthodes pour jouer les sons
    playClick() { this.sounds.click(); }
    playSuccess() { this.sounds.success(); }
    playError() { this.sounds.error(); }
    playNotification() { this.sounds.notification(); }
    playProgress() { this.sounds.progress(); }
    playVictory() { this.sounds.victory(); }
    playHover() { this.sounds.hover(); }
    playLoading() { this.sounds.loading(); }
    playValidation() { this.sounds.validation(); }
    playNavigation() { this.sounds.navigation(); }
    playCodeRun() { this.sounds.codeRun(); }
    playTestPass() { this.sounds.testPass(); }
    playTestFail() { this.sounds.testFail(); }
    playLessonComplete() { this.sounds.lessonComplete(); }
    playLogin() { this.sounds.login(); }
    playLogout() { this.sounds.logout(); }
    playModalOpen() { this.sounds.modalOpen(); }
    playModalClose() { this.sounds.modalClose(); }
    
    // Nouvelles méthodes pour les sons avancés
    playLevelUp() { this.sounds.levelUp(); }
    playBadgeEarned() { this.sounds.badgeEarned(); }
    playStreakBonus() { this.sounds.streakBonus(); }
    playSearch() { this.sounds.search(); }
    playThemeChange() { this.sounds.themeChange(); }
    playFullscreen() { this.sounds.fullscreen(); }
    playTyping() { this.sounds.typing(); }
    playDelete() { this.sounds.delete(); }
    playSave() { this.sounds.save(); }
    playLoad() { this.sounds.load(); }

    // Contrôles audio
    toggle() {
        this.enabled = !this.enabled;
        this.savePreferences();
        this.updateAudioControls();
        
        if (this.enabled) {
            this.playNotification();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.savePreferences();
    }

    loadPreferences() {
        const saved = localStorage.getItem('pythontamere_audio');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.enabled = prefs.enabled !== false;
            this.volume = prefs.volume || 0.7;
        }
    }

    savePreferences() {
        localStorage.setItem('pythontamere_audio', JSON.stringify({
            enabled: this.enabled,
            volume: this.volume
        }));
    }

    addAudioControls() {
        // Créer le bouton de contrôle audio
        const audioControls = document.createElement('div');
        audioControls.id = 'audioControls';
        audioControls.innerHTML = `
            <div class="audio-controls">
                <button id="audioToggle" class="audio-btn" title="Activer/Désactiver les sons">
                    <i class="fas fa-volume-up"></i>
                </button>
                <input type="range" id="audioVolume" min="0" max="1" step="0.1" value="${this.volume}" title="Volume">
            </div>
        `;
        
        // Ajouter les styles
        const style = document.createElement('style');
        style.textContent = `
            .audio-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(0, 0, 0, 0.8);
                padding: 10px;
                border-radius: 25px;
                backdrop-filter: blur(10px);
            }
            
            .audio-btn {
                background: var(--primary-color);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .audio-btn:hover {
                transform: scale(1.1);
                background: var(--primary-hover);
            }
            
            .audio-btn.muted {
                background: #666;
            }
            
            .audio-btn.muted i::before {
                content: "\\f6a9";
            }
            
            #audioVolume {
                width: 80px;
                height: 5px;
                background: #333;
                outline: none;
                border-radius: 5px;
                cursor: pointer;
            }
            
            #audioVolume::-webkit-slider-thumb {
                appearance: none;
                width: 15px;
                height: 15px;
                background: var(--primary-color);
                border-radius: 50%;
                cursor: pointer;
            }
            
            #audioVolume::-moz-range-thumb {
                width: 15px;
                height: 15px;
                background: var(--primary-color);
                border-radius: 50%;
                cursor: pointer;
                border: none;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(audioControls);
        
        // Ajouter les événements
        document.getElementById('audioToggle').addEventListener('click', () => {
            this.toggle();
        });
        
        document.getElementById('audioVolume').addEventListener('input', (e) => {
            this.setVolume(parseFloat(e.target.value));
        });
        
        this.updateAudioControls();
    }

    updateAudioControls() {
        const toggleBtn = document.getElementById('audioToggle');
        const volumeSlider = document.getElementById('audioVolume');
        
        if (toggleBtn) {
            toggleBtn.classList.toggle('muted', !this.enabled);
        }
        
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
    }

    // Méthode pour ajouter des sons aux éléments
    addSoundToElement(element, soundType, eventType = 'click') {
        if (!element) return;
        
        element.addEventListener(eventType, () => {
            if (soundType === 'click') this.playClick();
            else if (soundType === 'hover') this.playHover();
            else if (soundType === 'success') this.playSuccess();
            else if (soundType === 'error') this.playError();
            else if (soundType === 'navigation') this.playNavigation();
            else if (soundType === 'modal') this.playModalOpen();
        });
        
        // Ajouter l'effet hover si c'est un clic
        if (eventType === 'click') {
            element.addEventListener('mouseenter', () => {
                this.playHover();
            });
        }
    }
}

// Instance globale
const audioManager = new AudioManager();

// Exporter pour utilisation globale
window.audioManager = audioManager;
