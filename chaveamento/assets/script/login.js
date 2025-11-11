// FUNÇÃO ESTÁTICA PARA MOSTRAR/OCULTAR SENHA
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    
    if (input.type === 'password') {
        // Mostrar senha
        input.type = 'text';
        toggleBtn.classList.add('showing');
        toggleBtn.setAttribute('title', 'Ocultar senha');
    } else {
        // Ocultar senha
        input.type = 'password';
        toggleBtn.classList.remove('showing');
        toggleBtn.setAttribute('title', 'Mostrar senha');
    }
}

// O RESTANTE DO CÓDIGO DO login.js PERMANECE EXATAMENTE COMO ESTAVA ANTES...
// SISTEMA DE LOGIN INTEGRADO (FastAPI + Supabase)
let supabaseClient = null;

// Inicializa Supabase apenas para consultas diretas (se necessário)
try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        const { createClient } = supabase;
        // Use as mesmas credenciais do seu api.py
        const supabaseUrl = "https://vvrubxrubmyqmhgiaqog.supabase.co";
        const supabaseKey = "sb_secret_gUTiHwcdYvr1os_jCCFKeQ_YJrf2Gsn";
        supabaseClient = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase inicializado para consultas');
    }
} catch (error) {
    console.error('Erro ao inicializar Supabase:', error);
}

// VALIDAÇÃO DE EMAIL
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// VALIDAÇÃO DE SENHA (mínimo 8 caracteres)
function validarSenha(senha) {
    return senha.length >= 8;
}

// CARREGAR FUNÇÕES DA TABELA Funcoes DO SUPABASE
async function loadRoles() {
    const select = document.getElementById("register-role");
    
    if (!select) {
        console.error('Elemento register-role não encontrado');
        return;
    }

    try {
        console.log('Carregando funções do Supabase via FastAPI...');
        const response = await apiClient.listarFuncoes();
        console.log('Resposta completa das funções:', response);

        if (response && response.success && response.data && response.data.length > 0) {
            select.innerHTML = '<option value="">Selecione uma função</option>';
            
            response.data.forEach(funcao => {
                const option = document.createElement('option');
                
                // USA ID_Funcao e Nome_Funcao conforme sua API
                const valor = funcao.ID_Funcao || funcao.id;
                const texto = funcao.Nome_Funcao || funcao.Name_Funcao || funcao.Nome || 'Função sem nome';
                
                option.value = valor;
                option.textContent = texto;
                select.appendChild(option);
            });
            
            console.log(`✅ ${response.data.length} funções carregadas com sucesso`);
            
        } else {
            console.error('❌ Nenhuma função encontrada ou resposta inválida:', response);
            select.innerHTML = '<option value="">Nenhuma função disponível</option>';
            await carregarFuncoesSupabaseDireto(select);
        }

    } catch (error) {
        console.error('❌ Erro ao carregar funções via API:', error);
        await carregarFuncoesSupabaseDireto(select);
    }
}

// FALLBACK: Carregar funções direto do Supabase
async function carregarFuncoesSupabaseDireto(select) {
    if (!supabaseClient) {
        console.error('Supabase não disponível para carregar funções');
        select.innerHTML = '<option value="">Erro ao carregar funções</option>';
        return;
    }

    try {
        console.log('Tentando carregar funções diretamente do Supabase...');
        
        const { data, error } = await supabaseClient
            .from('Funcoes')
            .select('*');

        if (error) {
            console.error('Erro do Supabase:', error);
            throw error;
        }

        if (data && data.length > 0) {
            select.innerHTML = '<option value="">Selecione uma função</option>';
            
            data.forEach(funcao => {
                const option = document.createElement('option');
                
                // USA ID_Funcao e Nome_Funcao
                const valor = funcao.ID_Funcao || funcao.id;
                const texto = funcao.Nome_Funcao || funcao.Name_Funcao || funcao.Nome || 'Função sem nome';
                
                option.value = valor;
                option.textContent = texto;
                select.appendChild(option);
            });
            
            console.log(`✅ ${data.length} funções carregadas diretamente do Supabase`);
        } else {
            console.log('Nenhuma função encontrada na tabela Funcoes');
            select.innerHTML = '<option value="">Nenhuma função cadastrada</option>';
            criarFuncoesPadrao(select);
        }

    } catch (error) {
        console.error('❌ Erro ao carregar funções direto:', error);
        select.innerHTML = '<option value="">Erro ao carregar funções</option>';
        criarFuncoesPadrao(select);
    }
}

// CRIAR FUNÇÕES PADRÃO SE A TABELA ESTIVER VAZIA
function criarFuncoesPadrao(select) {
    console.log('Criando funções padrão...');
    
    const funcoesPadrao = [
        { value: 1, text: 'Administrador' },
        { value: 2, text: 'Comum' },
        { value: 3, text: 'Teste' }
    ];
    
    select.innerHTML = '<option value="">Selecione uma função</option>';
    
    funcoesPadrao.forEach(funcao => {
        const option = document.createElement('option');
        option.value = funcao.value;
        option.textContent = funcao.text;
        select.appendChild(option);
    });
    
    console.log('Funções padrão criadas');
}

// LOGIN PRINCIPAL COM FASTAPI (que usa Supabase como banco)
async function login(event) {
    console.log('=== INICIANDO LOGIN VIA FASTAPI ===');
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");

    // Validação básica
    if (!email || !senha) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Por favor, preencha todos os campos.";
        }
        return false;
    }

    // Validação de email
    if (!validarEmail(email)) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Por favor, insira um email válido.";
        }
        return false;
    }

    // Validação de senha (mínimo 8 caracteres)
    if (!validarSenha(senha)) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "A senha deve ter pelo menos 8 caracteres.";
        }
        return false;
    }

    try {
        console.log('Tentando login via FastAPI -> Supabase...');
        
        // 1. Tenta login via FastAPI (que consulta o Supabase)
        const response = await apiClient.login(email, senha);
        console.log('Resposta do FastAPI:', response);

        if (response && (response.status === 'authenticated' || response.message === 'Login realizado com sucesso')) {
            console.log('✅ Login realizado com sucesso!');
            
            // Salvar usuário no localStorage corretamente
            if (response.usuario) {
                // Garante que todos os dados do usuário sejam salvos conforme estrutura da API
                const usuarioCompleto = {
                    id_usuario: response.usuario.ID_Usuario,
                    cod_usuario: response.usuario.Cod_Usuario,
                    nome: response.usuario.Nome,
                    usuario: response.usuario.Usuario,
                    email: response.usuario.Usuario, // Usando Usuario como email
                    funcao: response.usuario.Funcao,
                    data_criacao: response.usuario.Data_Criacao
                };
                
                localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
                console.log('Usuário salvo no localStorage:', usuarioCompleto);
            }

            // Mensagem de sucesso
            if (errorDiv) {
                errorDiv.style.color = 'green';
                errorDiv.textContent = "Login realizado com sucesso! Redirecionando...";
            }

            // Redirecionar para HOMEPAGE
            setTimeout(() => {
                console.log('Redirecionando para homepage.html...');
                window.location.href = "homepage.html";
            }, 1000);

        } else {
            console.error('❌ Resposta inválida da API:', response);
            throw new Error('Falha na autenticação');
        }

    } catch (error) {
        console.error('❌ Erro no login:', error);
        
        // Tenta fallback direto com Supabase se a API falhar
        await tentarLoginSupabaseDireto(email, senha, errorDiv);
    }
    
    return false;
}

// FALLBACK: Login direto com Supabase (se a API estiver offline)
async function tentarLoginSupabaseDireto(email, senha, errorDiv) {
    if (!supabaseClient) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Erro de conexão. Tente novamente.";
        }
        return;
    }

    try {
        console.log('Tentando login direto com Supabase...');
        
        // Busca usuário na tabela Usuarios
        const { data, error } = await supabaseClient
            .from('Usuarios')
            .select('*')
            .eq('Usuario', email)
            .single();

        if (error) {
            throw new Error('Usuário não encontrado');
        }

        if (data && data.Senha === senha) {
            console.log('✅ Login direto com Supabase realizado!');
            
            // Salvar usuário no localStorage
            const usuario = {
                id_usuario: data.ID_Usuario,
                cod_usuario: data.Cod_Usuario,
                nome: data.Nome,
                usuario: data.Usuario,
                funcao: data.Funcao,
                data_criacao: data.Data_Criacao
            };
            
            localStorage.setItem('usuario', JSON.stringify(usuario));
            
            if (errorDiv) {
                errorDiv.style.color = 'green';
                errorDiv.textContent = "Login realizado! Redirecionando...";
            }

            // Redirecionar para HOMEPAGE
            setTimeout(() => {
                window.location.href = "homepage.html";
            }, 1000);
        } else {
            throw new Error('Senha incorreta');
        }

    } catch (error) {
        console.error('❌ Erro no login direto:', error);
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Email ou senha incorretos.";
        }
    }
}

// CADASTRO COM FASTAPI (que salva no Supabase)
async function register(event) {
    console.log('=== INICIANDO CADASTRO VIA FASTAPI ===');
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const nome = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const senha = document.getElementById("register-password").value;
    const senha2 = document.getElementById("register-confirm-password").value;
    const funcao = document.getElementById("register-role").value;
    const errorDiv = document.getElementById("register-error");

    // Validações
    if (!nome || !email || !senha || !funcao) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Todos os campos são obrigatórios.";
        }
        return false;
    }

    // Validação de email
    if (!validarEmail(email)) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Por favor, insira um email válido.";
        }
        return false;
    }

    // Validação de senha (mínimo 8 caracteres)
    if (!validarSenha(senha)) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "A senha deve ter pelo menos 8 caracteres.";
        }
        return false;
    }

    if (senha !== senha2) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "As senhas não coincidem.";
        }
        return false;
    }

    try {
        console.log('Tentando criar usuário via FastAPI -> Supabase...');
        
        const response = await apiClient.criarUsuario(nome, email, senha, parseInt(funcao));
        console.log('Resposta do cadastro:', response);

        if (response && response.message === 'Usuário criado com sucesso') {
            alert("✅ Usuário criado com sucesso!");
            console.log('Usuário criado:', response.data);
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } else {
            throw new Error(response?.detail || 'Falha na criação do usuário');
        }

    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        
        // Tenta fallback direto com Supabase
        await tentarCadastroSupabaseDireto(nome, email, senha, funcao, errorDiv);
    }
    
    return false;
}

// FALLBACK: Cadastro direto no Supabase
async function tentarCadastroSupabaseDireto(nome, email, senha, funcao, errorDiv) {
    if (!supabaseClient) {
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Erro de conexão. Tente novamente.";
        }
        return;
    }

    try {
        console.log('Tentando cadastro direto no Supabase...');
        
        const { data, error } = await supabaseClient
            .from('Usuarios')
            .insert([
                {
                    Nome: nome,
                    Usuario: email,
                    Senha: senha,
                    Funcao: parseInt(funcao),
                    Data_Criacao: new Date().toISOString()
                }
            ])
            .select();

        if (error) throw error;

        alert("✅ Usuário criado com sucesso!");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {
        console.error('❌ Erro no cadastro direto:', error);
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Erro ao criar usuário: " + error.message;
        }
    }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== INICIALIZANDO SISTEMA ===');
    
    // Carregar funções se estiver na página de cadastro
    if (document.getElementById("register-role")) {
        console.log('Carregando roles para cadastro...');
        await loadRoles();
    }

    // Verificar se já está logado
    const usuarioLogado = localStorage.getItem('usuario');
    if (usuarioLogado && window.location.pathname.includes('login.html')) {
        console.log('Usuário já logado, redirecionando para homepage...');
        window.location.href = "homepage.html";
    }
});

// FUNÇÃO DE LOGOUT GLOBAL
function logout() {
    console.log('Fazendo logout...');
    
    // Limpa todos os dados de autenticação
    localStorage.removeItem('usuario');
    localStorage.removeItem('user_id');
    localStorage.removeItem('appSettings');
    
    // Redireciona para a página de login
    window.location.href = 'login.html';
}

// Funções auxiliares
function checkAuth() {
    return !!localStorage.getItem('usuario');
}

function getCurrentUser() {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
}

// Disponibiliza funções globalmente
window.logout = logout;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.togglePassword = togglePassword;