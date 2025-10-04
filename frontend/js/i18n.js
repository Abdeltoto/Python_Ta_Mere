/**
 * Système i18n - Traductions Anglais/Français 🌍
 */

const translations = {
    fr: {
        // Navigation
        nav_home: "Home",
        nav_lessons: "Leçons",
        nav_profile: "Profil",
        nav_admin: "Admin",
        nav_login: "GO!",
        nav_logout: "Logout",
        
        // Hero
        hero_title: "🐍 Python Ta Mère! 💥",
        hero_subtitle: "Code Python comme un WARRIOR! Zéro install, feedback instantané, résultats qui claquent! 🔥",
        hero_start: "LET'S GO! 🚀",
        hero_discover: "Découvrir",
        
        // Features
        features_title: "Pourquoi PythonTaMère Déchire Tout? 💪",
        feature_fast_title: "⚡ Ultra Rapide",
        feature_fast_desc: "Code exécuté DIRECT dans ton navigateur. Zéro installation, zéro galère!",
        feature_feedback_title: "✅ Feedback Instant",
        feature_feedback_desc: "Tests auto qui te disent si t'as tout pété ou si faut retry!",
        feature_progress_title: "📈 Track ta Prog",
        feature_progress_desc: "Suis ton évolution et deviens un Python Master!",
        feature_gaming_title: "🎮 Style Gaming",
        feature_gaming_desc: "Apprends en t'amusant comme si tu jouais à un jeu!",
        
        // Lessons
        lessons_title: "🔥 Mes Leçons Python 🐍",
        lessons_loading: "Python se réveille...",
        lesson_back: "Retour aux leçons",
        
        // Exercise
        exercise_title: "💻 Exercice",
        exercise_run: "RUN",
        exercise_submit: "GO!",
        exercise_back: "Retour",
        exercise_console: "Console",
        exercise_tests: "Tests",
        
        // Profile
        profile_title: "🏆 Mon Profil de Warrior",
        profile_guest: "T'es pas encore connecté!",
        profile_login: "Connexion pour sauver ta prog!",
        
        // Login Modal
        login_title: "🚀 Connexion",
        login_subtitle: "Entre ton email pour recevoir un lien magique!",
        login_send: "Envoyer le lien!",
        login_sent: "Lien envoyé! En mode dev, utilise le token ci-dessous:",
        login_connect: "Se connecter!",
        login_success: "BOOM! Connecté! 🎉",
        
        // Admin
        admin_title: "Admin Zone 🔧",
        admin_lesson_create: "Créer une Leçon",
        admin_exercise_create: "Créer un Exercice",
        admin_test_create: "Créer un Test",
        
        // Messages
        msg_loading: "🐍 Python se réveille...",
        msg_success: "🎉 BOOM! T'as explosé cet exercice!",
        msg_error: "💥 Presque! Retry, tu peux le défoncer!",
        msg_testing: "🧪 Tests en cours... Ça va péter!",
        msg_running: "⚡ Exécution en cours...",
    },
    
    en: {
        // Navigation
        nav_home: "Home",
        nav_lessons: "Lessons",
        nav_profile: "Profile",
        nav_admin: "Admin",
        nav_login: "GO!",
        nav_logout: "Logout",
        
        // Hero
        hero_title: "🐍 Python Your Mom! 💥",
        hero_subtitle: "Code Python like a WARRIOR! Zero install, instant feedback, results that BANG! 🔥",
        hero_start: "LET'S GO! 🚀",
        hero_discover: "Discover",
        
        // Features
        features_title: "Why PythonTaMère ROCKS? 💪",
        feature_fast_title: "⚡ Ultra Fast",
        feature_fast_desc: "Code executed DIRECT in your browser. Zero install, zero hassle!",
        feature_feedback_title: "✅ Instant Feedback",
        feature_feedback_desc: "Auto tests that tell you if you crushed it or need to retry!",
        feature_progress_title: "📈 Track Progress",
        feature_progress_desc: "Follow your evolution and become a Python Master!",
        feature_gaming_title: "🎮 Gaming Style",
        feature_gaming_desc: "Learn while having fun like playing a game!",
        
        // Lessons
        lessons_title: "🔥 My Python Lessons 🐍",
        lessons_loading: "Python is waking up...",
        lesson_back: "Back to lessons",
        
        // Exercise
        exercise_title: "💻 Exercise",
        exercise_run: "RUN",
        exercise_submit: "GO!",
        exercise_back: "Back",
        exercise_console: "Console",
        exercise_tests: "Tests",
        
        // Profile
        profile_title: "🏆 My Warrior Profile",
        profile_guest: "You're not connected yet!",
        profile_login: "Login to save your progress!",
        
        // Login Modal
        login_title: "🚀 Login",
        login_subtitle: "Enter your email to receive a magic link!",
        login_send: "Send the link!",
        login_sent: "Link sent! In dev mode, use the token below:",
        login_connect: "Connect!",
        login_success: "BOOM! Connected! 🎉",
        
        // Admin
        admin_title: "Admin Zone 🔧",
        admin_lesson_create: "Create Lesson",
        admin_exercise_create: "Create Exercise",
        admin_test_create: "Create Test",
        
        // Messages
        msg_loading: "🐍 Python is waking up...",
        msg_success: "🎉 BOOM! You crushed this exercise!",
        msg_error: "💥 Almost! Retry, you can crush it!",
        msg_testing: "🧪 Tests running... It's gonna blow!",
        msg_running: "⚡ Executing...",
    }
};

// Langue actuelle (par défaut français)
let currentLang = localStorage.getItem('pythontamere_lang') || 'fr';

// Fonction pour obtenir une traduction
function t(key) {
    return translations[currentLang][key] || key;
}

// Fonction pour changer de langue
function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('pythontamere_lang', lang);
        updatePageTranslations();
        
        // Mettre à jour le sélecteur
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = lang;
        }
    }
}

// Fonction pour mettre à jour toutes les traductions de la page
function updatePageTranslations() {
    // Mettre à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        // Si c'est un input ou textarea, mettre à jour le placeholder
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Mettre à jour le titre de la page
    document.title = currentLang === 'fr' 
        ? '🐍 PythonTaMère - Code Python Comme un Boss!'
        : '🐍 PythonTaMère - Code Python Like a Boss!';
}

// Initialiser les traductions au chargement
document.addEventListener('DOMContentLoaded', () => {
    updatePageTranslations();
    
    // Ajouter l'écouteur sur le sélecteur de langue
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});

// Export pour utilisation globale
window.i18n = {
    t: t,
    setLanguage: setLanguage,
    getCurrentLang: () => currentLang
};

