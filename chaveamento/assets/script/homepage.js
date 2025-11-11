// Puxa nome do usuário do localStorage (usuário logado)
function carregarUsuario() {
    try {
        // Tenta obter o usuário do localStorage
        const usuarioData = localStorage.getItem('usuario');
        
        if (usuarioData) {
            const usuario = JSON.parse(usuarioData);
            console.log('Usuário logado encontrado:', usuario);
            
            // Tenta diferentes campos possíveis para o nome
            const nomeUsuario = usuario.nome || usuario.Nome || usuario.username || 
                              usuario.Usuario || usuario.nome_completo || 'Usuário';
            
            console.log('Nome definido como:', nomeUsuario);
            document.getElementById("username").textContent = nomeUsuario;
        } else {
            console.log('Nenhum usuário encontrado no localStorage');
            document.getElementById("username").textContent = "Usuário";
            
            // Se não tem usuário no localStorage, redireciona para login
            setTimeout(() => {
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        document.getElementById("username").textContent = "Usuário";
    }
}

// Função para aplicar tema da configuração na homepage
function aplicarTemaHomepage() {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    const tema = settings.theme || 'orange';
    
    // Aplica o gradiente baseado no tema salvo
    switch(tema) {
        case 'dark':
            document.body.style.background = 'linear-gradient(90deg, #1a1a1a, #2d2d2d)';
            break;
        case 'orange':
        default:
            document.body.style.background = 'linear-gradient(90deg, #ff4b2b, #ff914d)';
            break;
    }
}

// Função de logout
function logout() {
    console.log('Fazendo logout...');
    
    // Limpa todos os dados de autenticação
    localStorage.removeItem('usuario');
    localStorage.removeItem('user_id');
    localStorage.removeItem('appSettings');
    localStorage.removeItem('token');
    
    // Redireciona para a página de login
    window.location.href = 'login.html';
}

// Adiciona a função logout ao escopo global
window.logout = logout;

// Redireciona para criar torneio
function irParaCriarTorneio() {
    window.location.href = "criar-torneio.html";
}

// Verifica autenticação ao carregar a página
function verificarAutenticacao() {
    const usuario = localStorage.getItem('usuario');
    const currentPage = window.location.pathname;
    
    // Lista de páginas que não requerem autenticação
    const publicPages = ['/login.html', '/register.html', '/cadastro.html'];
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    
    if (!usuario && !isPublicPage) {
        console.log('Usuário não autenticado, redirecionando para login...');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Configura o botão de configurações
function configurarBotaoConfig() {
    const configBtn = document.getElementById('config');
    if (configBtn) {
        configBtn.addEventListener('click', function() {
            window.location.href = 'configuração.html';
        });
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage carregada - Iniciando verificação...');
    
    if (verificarAutenticacao()) {
        carregarUsuario();
        configurarBotaoConfig();
        aplicarTemaHomepage(); // APLICA O TEMA SALVO NAS CONFIGURAÇÕES
        
        // Adiciona evento ao botão de criar torneio se existir
        const criarTorneioBtn = document.querySelector('.content-center button');
        if (criarTorneioBtn && !criarTorneioBtn.onclick) {
            criarTorneioBtn.addEventListener('click', function() {
                window.location.href = 'chaveamento.html';
            });
        }
    }
});