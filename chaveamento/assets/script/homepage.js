// Puxa nome do usuário do localStorage (usuário logado)
function carregarUsuario() {
    try {
        // Tenta obter o usuário do localStorage (sistema de login atual)
        const usuarioData = localStorage.getItem('usuario');
        
        if (usuarioData) {
            const usuario = JSON.parse(usuarioData);
            console.log('Usuário logado:', usuario);
            
            // Usa o campo "nome" conforme estrutura da API
            const nomeUsuario = usuario.nome || usuario.Nome || 'Usuário';
            document.getElementById("username").textContent = nomeUsuario;
        } else {
            // Fallback para a API antiga se necessário
            carregarUsuarioAPI();
        }
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        document.getElementById("username").textContent = "Usuário";
    }
}

// Fallback: Puxa nome do usuário via API (sistema antigo)
async function carregarUsuarioAPI() {
    try {
        const userId = localStorage.getItem("user_id") || "1";
        const response = await fetch(`http://localhost:8000/usuarios/${userId}`);
        if (!response.ok) throw new Error("Erro ao buscar usuário");

        const data = await response.json();
        document.getElementById("username").textContent = data.usuario.nome;
    } catch (error) {
        console.error(error);
        document.getElementById("username").textContent = "Usuário";
    }
}

// Função de logout (será usada nas configurações)
function logout() {
    console.log('Fazendo logout...');
    
    // Limpa todos os dados de autenticação
    localStorage.removeItem('usuario');
    localStorage.removeItem('user_id');
    localStorage.removeItem('appSettings');
    
    // Redireciona para a página de login
    window.location.href = 'login.html';
}

// Adiciona a função logout ao escopo global para acesso nas configurações
window.logout = logout;

// Redireciona para criar torneio
function irParaCriarTorneio() {
  window.location.href = "criar-torneio.html";
}

// Verifica autenticação ao carregar a página
function verificarAutenticacao() {
    const usuario = localStorage.getItem('usuario');
    if (!usuario && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        console.log('Usuário não autenticado, redirecionando para login...');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (verificarAutenticacao()) {
        carregarUsuario();
    }
});

// Configura o botão de configurações para redirecionar
document.addEventListener('DOMContentLoaded', function() {
    const configBtn = document.getElementById('config');
    if (configBtn) {
        configBtn.addEventListener('click', function() {
            window.location.href = 'configuração.html';
        });
    }
});