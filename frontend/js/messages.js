/**
 * Messages fun et motivants style "Python Ta Mère" 🐍💥
 */

const MESSAGES = {
    // Messages de chargement
    loading: [
        "🐍 Python se réveille...",
        "⚡ Chargement à la vitesse de l'import antigravity...",
        "🚀 Démarrage du turbo Python...",
        "💪 On chauffe les imports...",
        "🔥 Python est dans la place !"
    ],

    // Messages de réussite
    success: [
        "🎉 BOOM! T'as explosé cet exercice!",
        "💪 Ta mère le serpent elle est fière!",
        "🔥 FIRE! Tu codes comme un pro!",
        "⚡ ULTRA COMBO! Tous les tests passent!",
        "🐍 Python t'a adopté frère!",
        "🎯 HEADSHOT! Code parfait!",
        "🏆 CHAMPION! Next level débloqué!",
        "✨ MAGIC! Tu maîtrises!",
        "💎 LEGENDARY! Code de ouf!",
        "🚀 ESPACE! T'es parti dans l'stratosphère!"
    ],

    // Messages d'échec (motivants!)
    failure: [
        "💥 Presque! Retry, tu peux le défoncer!",
        "🎮 Game Over... Mais appuie sur Continue!",
        "🔄 Bug détecté! Corrige et retente ta chance!",
        "⚠️ Oops! Python a fait un caprice, corrige ça!",
        "🐛 Un bug sauvage apparaît! Attrape-le!",
        "💡 Indice: Regarde bien le message d'erreur!",
        "🎯 Pas loin! T'approches du but!",
        "🔥 Chaud chaud! Encore un effort!"
    ],

    // Messages d'encouragement pendant l'écriture
    coding: [
        "✍️ Code comme si ta mère regardait!",
        "🐍 Le serpent attend ton génie...",
        "💻 Tape ce code, fais-le claquer!",
        "⚡ Déchire tout avec tes lignes!",
        "🎯 Concentre-toi, tu vas atomiser ça!"
    ],

    // Messages pour les tests
    testing: [
        "🧪 Tests en cours... Ça va péter!",
        "⚗️ On analyse ton code de warrior...",
        "🔬 Inspection du code... Suspense!",
        "🎲 Let's see si t'as tout bon...",
        "⏳ Validation en cours... Doigts croisés!"
    ],

    // Messages de démarrage des leçons
    lessonStart: [
        "📚 C'est parti pour du lourd!",
        "🎓 Prêt à apprendre comme un boss?",
        "🚀 Monte dans la fusée Python!",
        "💪 Time to level up!",
        "🔥 On va tout déchirer ensemble!"
    ],

    // Messages d'exécution
    running: [
        "⚡ Exécution... Que la force soit avec toi!",
        "🏃 Python court analyser ton code!",
        "💨 Ça décolle!",
        "🎬 Action! Ton code s'exécute!",
        "⏯️ Let's go!"
    ],

    // Messages de progression
    progress: [
        "📈 Tu montes en grade!",
        "⬆️ Level up!",
        "🎯 Un exercice de moins, t'es chaud!",
        "💯 Stats en augmentation!",
        "🏅 Badge débloqué!"
    ],

    // Messages d'erreur sympa
    error: [
        "🤔 Hmm... Y'a un truc qui coince!",
        "🐛 Bug spotted! Chasse-le!",
        "❌ Erreur détectée! Check le message rouge!",
        "⚠️ Python a dit non! Regarde pourquoi!",
        "💥 Boom! Répare vite!"
    ],

    // Tips Python fun
    tips: [
        "💡 Pro tip: print() c'est ton meilleur ami pour débugger!",
        "🐍 Fun fact: Python a été nommé d'après les Monty Python!",
        "⚡ Astuce: Utilise f-strings pour les strings, c'est 1000x mieux!",
        "🎯 Remember: L'indentation c'est la vie en Python!",
        "🔥 Conseil: Lis bien les messages d'erreur, ils t'aident vraiment!",
        "💪 Python power: List comprehensions = code compact et stylé!",
        "🚀 Speed tip: range() est ton ami pour les boucles!",
        "✨ Magic trick: dir() pour voir les méthodes d'un objet!",
        "🎓 Did you know: Python peut tout faire, de l'IA aux jeux!",
        "🐍 Python fact: Simple is better than complex!"
    ]
};

// Fonction pour obtenir un message aléatoire
function getRandomMessage(category) {
    const messages = MESSAGES[category] || MESSAGES.tips;
    return messages[Math.floor(Math.random() * messages.length)];
}

// Fonction pour afficher un tip aléatoire
function showRandomTip() {
    const tipElement = document.getElementById('randomTip');
    if (tipElement) {
        tipElement.textContent = getRandomMessage('tips');
        tipElement.style.animation = 'none';
        setTimeout(() => {
            tipElement.style.animation = 'fadeIn 0.5s';
        }, 10);
    }
}

// Changer le tip toutes les 10 secondes
setInterval(showRandomTip, 10000);

// Export pour utilisation dans app.js
window.PythonTaMèreMessages = {
    get: getRandomMessage,
    showTip: showRandomTip
};

