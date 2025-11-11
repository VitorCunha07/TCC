// Sistema de Configurações - Allian's Arena

// Configurações padrão
const defaultSettings = {
    theme: 'orange',
    notifications: true,
    language: 'pt',
    username: 'Usuário'
};

// Função para carregar configurações
function loadSettings() {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {...defaultSettings};
}

// Função para salvar configurações
function saveSettings(settings) {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    applySettings(settings);
}

// Função para aplicar configurações em todo o site
function applySettings(settings) {
    applyTheme(settings.theme);
    applyLanguage(settings.language);
    applyNotifications(settings.notifications);
    updateUsername(settings.username);
}

// Função para aplicar tema - COMPATÍVEL COM HOMEPAGE
function applyTheme(theme) {
    const body = document.body;
    
    // Remove todas as classes de tema
    body.classList.remove('light-theme', 'dark-theme', 'orange-theme');
    
    // Adiciona a classe do tema selecionado
    body.classList.add(theme + '-theme');
    
    // Aplica o gradiente de fundo baseado no tema (compatível com homepage)
    applyBackgroundGradient(theme);
    
    // Atualiza a seleção visual nos temas
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        }
    });
}

// Função para aplicar gradiente de fundo (compatível com homepage)
function applyBackgroundGradient(theme) {
    const body = document.body;
    
    switch(theme) {
        case 'dark':
            body.style.background = 'linear-gradient(90deg, #1a1a1a, #2d2d2d)';
            break;
        case 'orange':
        default:
            body.style.background = 'linear-gradient(90deg, #ff4b2b, #ff914d)';
            break;
    }
    
    // Salva também no localStorage para outras páginas
    const settings = loadSettings();
    settings.theme = theme;
    localStorage.setItem('appSettings', JSON.stringify(settings));
}

// Função para aplicar idioma
function applyLanguage(language) {
    const translations = {
        pt: {
            voltar: 'Voltar',
            configuracoes: 'Configurações',
            torneios: 'Torneios',
            ranking: 'Ranking',
            partidas: 'Partidas',
            agenda: 'Agenda',
            criarTorneio: 'Criar Novo Torneio',
            jogosSemana: 'Jogos da Semana',
            proximosJogos: 'Próximos Jogos',
            selecionarTema: 'Selecionar Tema',
            suporte: 'Suporte',
            minhaConta: 'Minha Conta',
            notificacoes: 'Notificações',
            idioma: 'Idioma',
            salvar: 'Salvar',
            escuro: 'Escuro',
            laranja: 'Laranja',
            sessao: 'Sessão',
            sair: 'Sair da Conta'
        },
        en: {
            voltar: 'Back',
            configuracoes: 'Settings',
            torneios: 'Tournaments',
            ranking: 'Ranking',
            partidas: 'Matches',
            agenda: 'Schedule',
            criarTorneio: 'Create New Tournament',
            jogosSemana: 'This Week Games',
            proximosJogos: 'Upcoming Games',
            selecionarTema: 'Select Theme',
            suporte: 'Support',
            minhaConta: 'My Account',
            notificacoes: 'Notifications',
            idioma: 'Language',
            salvar: 'Save',
            escuro: 'Dark',
            laranja: 'Orange',
            sessao: 'Session',
            sair: 'Logout'
        },
        es: {
            voltar: 'Volver',
            configuracoes: 'Configuraciones',
            torneios: 'Torneos',
            ranking: 'Ranking',
            partidas: 'Partidos',
            agenda: 'Agenda',
            criarTorneio: 'Crear Nuevo Torneo',
            jogosSemana: 'Juegos de la Semana',
            proximosJogos: 'Próximos Juegos',
            selecionarTema: 'Seleccionar Tema',
            suporte: 'Soporte',
            minhaConta: 'Mi Cuenta',
            notificacoes: 'Notificaciones',
            idioma: 'Idioma',
            salvar: 'Guardar',
            escuro: 'Oscuro',
            laranja: 'Naranja',
            sessao: 'Sesión',
            sair: 'Cerrar Sesión'
        }
    };

    const lang = translations[language] || translations.pt;
    
    // Atualizar textos comuns em todas as páginas
    updateElementText('[data-i18n="voltar"]', lang.voltar);
    updateElementText('[data-i18n="configuracoes"]', lang.configuracoes);
    updateElementText('[data-i18n="torneios"]', lang.torneios);
    updateElementText('[data-i18n="ranking"]', lang.ranking);
    updateElementText('[data-i18n="partidas"]', lang.partidas);
    updateElementText('[data-i18n="agenda"]', lang.agenda);
    updateElementText('[data-i18n="criarTorneio"]', lang.criarTorneio);
    updateElementText('[data-i18n="jogosSemana"]', lang.jogosSemana);
    updateElementText('[data-i18n="proximosJogos"]', lang.proximosJogos);
    updateElementText('[data-i18n="selecionarTema"]', lang.selecionarTema);
    updateElementText('[data-i18n="suporte"]', lang.suporte);
    updateElementText('[data-i18n="minhaConta"]', lang.minhaConta);
    updateElementText('[data-i18n="notificacoes"]', lang.notificacoes);
    updateElementText('[data-i18n="idioma"]', lang.idioma);
    updateElementText('[data-i18n="salvar"]', lang.salvar);
    updateElementText('[data-i18n="sessao"]', lang.sessao);
    updateElementText('[data-i18n="sair"]', lang.sair);
    
    // Atualizar opções de tema
    updateElementText('[data-theme="dark"] span', lang.escuro);
    updateElementText('[data-theme="orange"] span', lang.laranja);
}

// Função auxiliar para atualizar texto de elementos
function updateElementText(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
}

// Função para aplicar configurações de notificação
function applyNotifications(enabled) {
    const toggleStatus = document.getElementById('toggle-status');
    if (toggleStatus) {
        const settings = loadSettings();
        const lang = settings.language || 'pt';
        const statusText = lang === 'en' ? (enabled ? 'Enabled' : 'Disabled') : 
                          lang === 'es' ? (enabled ? 'Activado' : 'Desactivado') :
                          (enabled ? 'Ativado' : 'Desativado');
        
        toggleStatus.textContent = statusText;
        toggleStatus.style.color = enabled ? '#4caf50' : '#f44336';
    }
    
    if (enabled) {
        console.log('Notificações ativadas');
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    } else {
        console.log('Notificações desativadas');
    }
}

// Função para atualizar nome de usuário DO BANCO DE DADOS
function updateUsername(username) {
    const userElements = document.querySelectorAll('#username, .user-name, [data-username]');
    userElements.forEach(element => {
        if (element.tagName === 'INPUT') {
            element.value = username;
        } else {
            element.textContent = username;
        }
    });
}

// FUNÇÃO PARA CARREGAR USUÁRIO DO BANCO DE DADOS
function carregarUsuarioDoBanco() {
    try {
        const usuarioData = localStorage.getItem('usuario');
        
        if (usuarioData) {
            const usuario = JSON.parse(usuarioData);
            console.log('Usuário carregado do banco:', usuario);
            
            // Usa o campo correto conforme estrutura da API
            const nomeUsuario = usuario.nome || usuario.Nome || 'Usuário';
            
            // Atualiza o campo de username nas configurações
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.value = nomeUsuario;
            }
            
            return nomeUsuario;
        }
    } catch (error) {
        console.error('Erro ao carregar usuário do banco:', error);
    }
    return 'Usuário';
}

// FUNÇÃO DE LOGOUT
function logout() {
    console.log('Iniciando logout...');
    
    // Mostrar confirmação
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
        // Limpa todos os dados de autenticação
        localStorage.removeItem('usuario');
        localStorage.removeItem('user_id');
        localStorage.removeItem('appSettings');
        
        // Mostrar mensagem de sucesso
        showNotification('Logout realizado com sucesso!', 'success');
        
        // Redireciona para a página de login após 1 segundo
        setTimeout(() => {
            console.log('Redirecionando para login...');
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Função para copiar e-mail de suporte
function copyEmail() {
    const email = 'alinsarena.arena@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('E-mail copiado para a área de transferência!', 'success');
    }).catch(err => {
        console.error('Erro ao copiar e-mail:', err);
        showNotification('Erro ao copiar e-mail. Tente novamente.', 'error');
    });
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Função para salvar configurações da página de configurações
function saveUserSettings() {
    const settings = loadSettings();
    
    // Atualizar com valores atuais
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        settings.username = usernameInput.value || settings.username;
        
        // Atualiza também no localStorage do usuário se estiver logado
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            const usuario = JSON.parse(usuarioData);
            usuario.nome = usernameInput.value;
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }
    
    const notificationsToggle = document.getElementById('notifications');
    if (notificationsToggle) {
        settings.notifications = notificationsToggle.checked;
    }
    
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        settings.language = languageSelect.value;
    }
    
    saveSettings(settings);
    showNotification('Configurações salvas com sucesso!', 'success');
}

// Função para simular download do manual
function downloadManual() {
    showNotification('Manual disponível para download em breve!', 'info');
}

// Função para inicializar configurações em qualquer página
function initializeSettings() {
    const settings = loadSettings();
    applySettings(settings);
    
    // CARREGA O USUÁRIO DO BANCO DE DADOS
    carregarUsuarioDoBanco();
    
    // Inicializar elementos da página de configurações se existirem
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            const newSettings = {...loadSettings(), theme};
            saveSettings(newSettings);
            
            // Aplica o tema imediatamente
            applyBackgroundGradient(theme);
        });
    });
    
    // Inicializar toggle de notificações se existir
    const notificationsToggle = document.getElementById('notifications');
    if (notificationsToggle) {
        notificationsToggle.checked = settings.notifications;
        notificationsToggle.addEventListener('change', function() {
            const newSettings = {...loadSettings(), notifications: this.checked};
            saveSettings(newSettings);
        });
    }
    
    // Inicializar seletor de idioma se existir
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = settings.language;
        languageSelect.addEventListener('change', function() {
            const newSettings = {...loadSettings(), language: this.value};
            saveSettings(newSettings);
        });
    }
    
    // Inicializar botão de salvar se existir
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveUserSettings);
    }
    
    // Inicializar botão de copiar e-mail se existir
    const emailBtn = document.querySelector('.email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', copyEmail);
    }
    
    // Inicializar botão de download se existir
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadManual);
    }
}

// Adicionar estilos CSS para notificações e animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeSettings);

// Disponibiliza as funções globalmente
window.logout = logout;
window.applyBackgroundGradient = applyBackgroundGradient;