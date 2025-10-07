// CORREÇÃO: Verificação se Supabase foi carregado antes de usar
let supabaseClient = null;

try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        const { createClient } = supabase;
        const supabaseUrl = 'Sua_URL_Supabase_Aqui' // Substitua pela sua URL real
        const supabaseKey = 'Sua_Chave_Supabase_Aqui' // Substitua pela sua chave real
        supabaseClient = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase inicializado com sucesso');
    } else {
        console.error('Supabase não foi carregado');
    }
} catch (error) {
    console.error('Erro ao inicializar Supabase:', error);
}

// LOGIN COM API FASTAPI (NOVA VERSÃO)
async function loginAPI() {
    console.log('Login via API FastAPI');
    
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");

    if (!email || !senha) {
        if (errorDiv) errorDiv.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    try {
        // Verifica se existe o cliente da API
        if (typeof apiClient === 'undefined') {
            console.error('Cliente da API não carregado');
            throw new Error('Cliente da API não carregado');
        }

        console.log('Tentando login com:', { Usuario: email, Senha: '***' });
        const response = await apiClient.login(email, senha);
        console.log('Resposta do login:', response);
        
        if (response && response.status === 'authenticated') {
            console.log('Login realizado com sucesso via API');
            console.log('Dados do usuário:', response.usuario);
            
            // Salvar no localStorage
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            console.log('Usuário salvo no localStorage');
            
            // Mostrar mensagem de sucesso e redirecionar imediatamente
            if (errorDiv) {
                errorDiv.style.color = 'green';
                errorDiv.textContent = "Login realizado com sucesso! Redirecionando...";
            }
            
            // Redirecionamento imediato
            console.log('Redirecionando para chaveamento.html...');
            
            try {
                console.log('URL atual:', window.location.href);
                console.log('Tentando redirecionar para chaveamento.html...');
                
                window.location.href = "chaveamento.html";
                        
            } catch (redirectError) {
                console.error('Erro no redirecionamento:', redirectError);
                if (errorDiv) {
                    errorDiv.textContent = "Erro no redirecionamento. Clique aqui para ir para chaveamento.";
                    errorDiv.style.cursor = "pointer";
                    errorDiv.onclick = () => window.open("chaveamento.html", "_self");
                }
            }
            
        } else {
            console.error('Resposta inválida da API:', response);
            throw new Error('Falha na autenticação - resposta inválida');
        }
    } catch (error) {
        console.error('Erro no login via API:', error);
        if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.textContent = "Email ou senha incorretos.";
        }
        // Re-throw para que o fallback do Supabase seja tentado
        throw error;
    }
}

// parte do login (VERSÃO ORIGINAL COM SUPABASE)
async function login(event) {
  // Prevenir comportamento padrão do formulário
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  console.log('Função login chamada');
  
  // Tenta primeiro via API FastAPI
  try {
    await loginAPI();
    return false; // Prevenir submit do formulário
  } catch (error) {
    console.log('Tentando login via Supabase...');
  }
  
  // NOTE IDs corrigidos para coincidir com HTML (login-email e login-password)
  const email = document.getElementById("login-email").value
  const senha = document.getElementById("login-password").value
  // NOTE Adicionado elemento para mostrar erros
  const errorDiv = document.getElementById("login-error")

  // NOTE Adicionada validação de campos obrigatórios
  if (!email || !senha) {
    if (errorDiv) errorDiv.textContent = "Por favor, preencha todos os campos."
    return false
  }

  // CORREÇÃO: Verificar se Supabase está disponível
  if (!supabaseClient) {
    if (errorDiv) {
      errorDiv.textContent = "Erro: Sistema de autenticação não disponível."
    } else {
      alert("Erro: Sistema de autenticação não disponível.")
    }
    console.error('Supabase não inicializado');
    return false
  }

  try {
    // NOTE Usado supabaseClient em vez de supabase
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha })

    if (error) {
      if (errorDiv) {
        errorDiv.textContent = "Email ou senha incorretos."
      } else {
        alert("Você não possui cadastro ou os dados estão incorretos. Faça o cadastro primeiro.")
      }
      console.error('Erro de login:', error)
    } else {
      // NOTE Redirecionamento para chaveamento.html em vez de index.html
      console.log('Login realizado com sucesso');
      window.location.href = "chaveamento.html" // para onde vai depois de logar
    }
  } catch (err) {
    if (errorDiv) {
      errorDiv.textContent = "Erro de conexão. Tente novamente."
    } else {
      alert("Erro de conexão. Tente novamente.")
    }
    console.error('Erro na função login:', err)
  }
  
  return false; // Prevenir submit do formulário
}

// CADASTRO COM API FASTAPI (NOVA VERSÃO)
async function registerAPI() {
    console.log('Register via API FastAPI');
    
    const nome = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const senha = document.getElementById("register-password").value;
    const senha2 = document.getElementById("register-confirm-password").value;
    const funcao = document.getElementById("register-role").value;
    const errorDiv = document.getElementById("register-error");

    // Validações
    if (!nome || !email || !senha || !funcao) {
        if (errorDiv) errorDiv.textContent = "Todos os campos são obrigatórios.";
        return;
    }

    if (senha.length < 6) {
        if (errorDiv) errorDiv.textContent = "A senha deve ter pelo menos 6 caracteres.";
        return;
    }

    if (senha !== senha2) {
        if (errorDiv) errorDiv.textContent = "As senhas não coincidem.";
        return;
    }

    try {
        // Verifica se existe o cliente da API
        if (typeof apiClient === 'undefined') {
            throw new Error('Cliente da API não carregado');
        }

        const response = await apiClient.criarUsuario(nome, email, senha, parseInt(funcao));
        
        if (response.message === 'Usuário criado com sucesso') {
            alert("Usuário criado com sucesso!");
            console.log('Usuário criado via API:', response.data);
            window.location.href = "login.html";
        } else {
            throw new Error('Falha na criação do usuário');
        }
    } catch (error) {
        console.error('Erro no cadastro via API:', error);
        if (errorDiv) {
            errorDiv.textContent = "Erro ao criar usuário: " + error.message;
        }
    }
}

// parte do cadastro
// NOTE Função renomeada de 'cadastrar' para 'register' para coincidir com HTML
async function register(event) {
  // Prevenir comportamento padrão do formulário
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  console.log('Função register chamada');
  
  // Tenta primeiro via API FastAPI
  try {
    await registerAPI();
    return false; // Prevenir submit do formulário
  } catch (error) {
    console.log('Tentando cadastro via Supabase...');
  }
  
  // NOTE IDs corrigidos para coincidir com HTML
  const nome = document.getElementById("register-name").value
  const email = document.getElementById("register-email").value
  const senha = document.getElementById("register-password").value
  const senha2 = document.getElementById("register-confirm-password").value
  const funcao = document.getElementById("register-role").value
  // NOTE Adicionado elemento para mostrar erros
  const errorDiv = document.getElementById("register-error")

  // NOTE Adicionada validação de campos obrigatórios
  if (!nome || !email || !senha || !funcao) {
    if (errorDiv) errorDiv.textContent = "Todos os campos são obrigatórios."
    return false
  }

  // NOTE Adicionada validação de tamanho da senha
  if (senha.length < 6) {
    if (errorDiv) errorDiv.textContent = "A senha deve ter pelo menos 6 caracteres."
    return false
  }

  if (senha !== senha2) {
    if (errorDiv) {
      errorDiv.textContent = "As senhas não coincidem."
    } else {
      alert("As senhas não coincidem.")
    }
    return false
  }

  // CORREÇÃO: Verificar se Supabase está disponível
  if (!supabaseClient) {
    if (errorDiv) {
      errorDiv.textContent = "Erro: Sistema de autenticação não disponível."
    } else {
      alert("Erro: Sistema de autenticação não disponível.")
    }
    console.error('Supabase não inicializado');
    return false
  }

  try {
    // NOTE Usado supabaseClient em vez de supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          funcao
        }
      }
    })

    if (error) {
      if (errorDiv) {
        errorDiv.textContent = "Erro ao cadastrar: " + error.message
      } else {
        alert("Erro ao cadastrar: " + error.message)
      }
      console.error('Erro de cadastro:', error)
    } else {
      alert("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.")
      console.log('Cadastro realizado:', data)
      window.location.href = "login.html"
    }
  } catch (err) {
    if (errorDiv) {
      errorDiv.textContent = "Erro de conexão. Tente novamente."
    } else {
      alert("Erro de conexão. Tente novamente.")
    }
    console.error('Erro na função register:', err)
  }
  
  return false; // Prevenir submit do formulário
}

// carregar funções do banco Supabase
// NOTE Melhorada função para carregar papéis/funções
async function loadRoles() {
  // NOTE ID corrigido para coincidir com HTML
  const select = document.getElementById("register-role")
  
  if (!select) {
    console.error('Elemento register-role não encontrado')
    return
  }

  // CORREÇÃO: Verificar se Supabase está disponível
  if (!supabaseClient) {
    console.error('Supabase não inicializado para carregar funções')
    return
  }

  try {
    const { data, error } = await supabaseClient
      .from('funcoes')
      .select('*')

    if (error) {
      console.error('Erro ao carregar funções:', error)
      return
    }

    // NOTE Limpar opções existentes
    select.innerHTML = '<option value="">Selecione uma função</option>'

    if (data && data.length > 0) {
      data.forEach(funcao => {
        const option = document.createElement('option')
        option.value = funcao.id
        option.textContent = funcao.nome
        select.appendChild(option)
      })
      console.log('Funções carregadas:', data)
    } else {
      console.log('Nenhuma função encontrada')
    }
  } catch (error) {
    console.error('Erro ao buscar funções:', error)
  }
}

// NOTE Verificar autenticação quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  // Carregar funções disponíveis se estiver na página de cadastro
  const select = document.getElementById("register-role")
  if (select) {
    console.log('DOMContentLoaded - carregando roles...')
    loadRoles()
  }
  
  // ⚠️ VALIDAÇÃO DE LOGIN DESATIVADA
  // Verificar se usuário já está logado e redirecionar se necessário
  // const currentPage = window.location.pathname.split('/').pop()
  // if (currentPage === 'chaveamento.html') {
  //   const userData = localStorage.getItem('usuario')
  //   if (!userData) {
  //     console.log('Usuário não logado, redirecionando para login')
  //     window.location.href = 'login.html'
  //   }
  // }
})

// Função de logout
function logout() {
  console.log('Fazendo logout...');
  
  // Limpar localStorage
  localStorage.removeItem('usuario');
  console.log('Dados do usuário removidos do localStorage');
  
  // Limpar sessão do Supabase se estiver logado
  if (supabaseClient) {
    try {
      supabaseClient.auth.signOut();
      console.log('Sessão do Supabase encerrada');
    } catch (error) {
      console.error('Erro ao encerrar sessão do Supabase:', error);
    }
  }
  
  // Redirecionar para homepage
  console.log('Redirecionando para homepage...');
  window.location.href = 'homepage.html';
}

// Função para verificar se usuário está logado
function checkAuth() {
  // ⚠️ VALIDAÇÃO DESATIVADA - SEMPRE RETORNA TRUE
  // const userData = localStorage.getItem('usuario');
  // const currentPage = window.location.pathname.split('/').pop();
  
  // if (currentPage === 'chaveamento.html' && !userData) {
  //   console.log('Usuário não autorizado, redirecionando para login');
  //   window.location.href = 'login.html';
  //   return false;
  // }
  
  return true; // SEMPRE PERMITE ACESSO
}

// Função para obter dados do usuário logado
function getCurrentUser() {
  const userData = localStorage.getItem('usuario');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Erro ao processar dados do usuário:', error);
      return null;
    }
  }
  return null;
}