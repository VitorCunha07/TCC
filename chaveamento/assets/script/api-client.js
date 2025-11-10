// Cliente para conectar com a API FastAPI - VERSÃO INTEGRADA
class ApiClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: options.body
        };

        try {
            console.log(`Fazendo requisição para: ${url}`, config);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            throw error;
        }
    }

    // LOGIN - usa a tabela Usuarios do Supabase via FastAPI
    async login(usuario, senha) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({
                Usuario: usuario,
                Senha: senha
            })
        });
    }

    // CADASTRO - cria usuário na tabela Usuarios do Supabase
    async criarUsuario(nome, usuario, senha, funcao = null) {
        return this.request('/usuarios', {
            method: 'POST',
            body: JSON.stringify({
                Nome: nome,
                Usuario: usuario,
                Senha: senha,
                Funcao: funcao
            })
        });
    }

    // LISTAR USUÁRIOS - da tabela Usuarios do Supabase
    async listarUsuarios() {
        return this.request('/listaUsuarios');
    }

    // LISTAR FUNÇÕES - da tabela Funcoes do Supabase
    async listarFuncoes() {
        return this.request('/listaFuncoes');
    }

    // HEALTH CHECK - verifica conexão com Supabase
    async checkHealth() {
        return this.request('/health');
    }

    // DEBUG - verifica conexão com Supabase
    async debugSupabase() {
        return this.request('/debug/supabase');
    }

    // DEBUG TABELAS - verifica estrutura das tabelas
    async debugTabelas() {
        return this.request('/debug/tabelas');
    }
}

// Instância global do cliente da API
const apiClient = new ApiClient();

// Função para testar conexão completa
async function testarConexaoCompleta() {
    try {
        console.log('=== TESTANDO CONEXÃO COMPLETA ===');
        
        // 1. Testa saúde da API
        const health = await apiClient.checkHealth();
        console.log('1. Health API:', health);
        
        // 2. Testa conexão com Supabase
        const supabaseDebug = await apiClient.debugSupabase();
        console.log('2. Conexão Supabase:', supabaseDebug);
        
        // 3. Testa tabelas
        const tabelas = await apiClient.debugTabelas();
        console.log('3. Estrutura Tabelas:', tabelas);
        
        // 4. Testa funções
        const funcoes = await apiClient.listarFuncoes();
        console.log('4. Funções disponíveis:', funcoes);
        
        console.log('=== CONEXÃO TESTADA COM SUCESSO ===');
        return true;
    } catch (error) {
        console.error('=== ERRO NA CONEXÃO ===', error);
        return false;
    }
}

// Testa conexão ao carregar o script
document.addEventListener('DOMContentLoaded', async () => {
    const connected = await testarConexaoCompleta();
    if (!connected) {
        console.warn('Sistema parcialmente indisponível. Algumas funcionalidades podem não funcionar.');
    }
});