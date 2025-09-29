// Cliente para conectar com a API FastAPI
class ApiClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            throw error;
        }
    }

    // Endpoints da API
    async login(usuario, senha) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({
                Usuario: usuario,
                Senha: senha
            })
        });
    }

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

    async listarUsuarios() {
        return this.request('/listaUsuarios');
    }

    async listarFuncoes() {
        return this.request('/listaFuncoes');
    }

    async checkHealth() {
        return this.request('/health');
    }
}

// Instância global do cliente da API
const apiClient = new ApiClient();

// Função para testar conexão com a API
async function testarConexaoAPI() {
    try {
        const health = await apiClient.checkHealth();
        console.log('Conexão com API OK:', health);
        return true;
    } catch (error) {
        console.error('Erro ao conectar com API:', error);
        return false;
    }
}

// Testa conexão ao carregar o script
testarConexaoAPI();
