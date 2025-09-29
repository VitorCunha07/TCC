from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = "https://vvrubxrubmyqmingiaqog.supabase.co"
SUPABASE_KEY = "sb_secret_gUTiHwcdYvr1os_jCCFKeQ_YJrf2Gsn" 

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Cliente Supabase inicializado com sucesso")
except Exception as e:
    logger.error(f"Erro ao inicializar cliente Supabase: {e}")
    supabase = None

app = FastAPI(
    title="API Supabase - Sistema de Autenticação",
    description="API para autenticação de usuários com Supabase",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UsuarioCreate(BaseModel):
    Nome: str
    Usuario: str
    Senha: str
    Funcao: Optional[int] = None


class UsuarioLogin(BaseModel):
    Usuario: str
    Senha: str


class UsuarioResponse(BaseModel):
    id_usuario: int
    cod_usuario: str
    nome: str
    usuario: str
    funcao: Optional[int] = None
    data_criacao: datetime


@app.middleware("http")
async def check_supabase_connection(request, call_next):
    if supabase is None:
        raise HTTPException(
            status_code=500, detail="Conexão com Supabase não inicializada")
    response = await call_next(request)
    return response


@app.get("/")
async def root():
    return {"message": "API Supabase ativa", "version": "1.0.0"}


@app.get("/debug/tabelas")
async def verificar_tabelas():
    """Endpoint para verificar quais tabelas existem no Supabase"""
    try:
        if supabase is None:
            return {"error": "Cliente Supabase não inicializado"}

        resultado = {}

        # Testar tabela funcoes
        try:
            funcoes = supabase.table("funcoes").select("*").limit(1).execute()
            resultado["funcoes"] = {
                "existe": True,
                "colunas": list(funcoes.data[0].keys()) if funcoes.data else [],
                "total_registros": len(funcoes.data)
            }
        except Exception as e:
            resultado["funcoes"] = {"existe": False, "erro": str(e)}

        # Testar tabela usuarios
        try:
            usuarios = supabase.table("usuarios").select(
                "*").limit(1).execute()
            resultado["usuarios"] = {
                "existe": True,
                "colunas": list(usuarios.data[0].keys()) if usuarios.data else [],
                "total_registros": len(usuarios.data)
            }
        except Exception as e:
            resultado["usuarios"] = {"existe": False, "erro": str(e)}

        return resultado

    except Exception as e:
        return {"error": f"Erro geral: {str(e)}"}


@app.get("/health")
async def health_check():
    # NOTE Teste real de conectividade com Supabase
    try:
        if supabase is None:
            return {"status": "unhealthy", "supabase_connected": False, "error": "Cliente não inicializado"}

        # NOTE Teste com tabela que existe - funcoes
        _ = supabase.table("funcoes").select("*").limit(1).execute()

        return {
            "status": "healthy",
            "supabase_connected": True,
            "supabase_url": SUPABASE_URL
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "supabase_connected": False,
            "error": str(e),
            "supabase_url": SUPABASE_URL
        }

# Rota para usuários


@app.get("/listaUsuarios")
async def listar_usuarios():
    try:
        logger.info("Iniciando busca de usuários no Supabase")

        # NOTE Verificação de cliente Supabase
        if supabase is None:
            raise HTTPException(
                status_code=500, detail="Cliente Supabase não inicializado")

        # NOTE Teste de conectividade primeiro
        try:
            # NOTE Testa com tabela que existe - funcoes
            _ = supabase.table("funcoes").select("*").limit(1).execute()
            logger.info("Conectividade com Supabase OK")
        except Exception as conn_error:
            logger.error(f"Erro de conectividade: {conn_error}")
            raise HTTPException(
                status_code=503,
                detail=f"Erro de conectividade com Supabase: {str(conn_error)}"
            )

        # Verificar se a tabela usuarios existe
        try:
            # Tentar listar colunas da tabela usuarios
            test_response = supabase.table(
                "usuarios").select("*").limit(1).execute()
            logger.info(f"Tabela usuarios existe. Teste: {test_response}")
        except Exception as table_error:
            logger.error(f"Erro ao acessar tabela usuarios: {table_error}")
            # Tentar criar a tabela ou retornar erro informativo
            return {
                "success": False,
                "error": f"Tabela usuarios não encontrada: {str(table_error)}",
                "suggestion": "Verifique se a tabela 'usuarios' existe no Supabase"
            }

        # Verifica se a tabela existe e está acessível
        response = supabase.table("usuarios") \
            .select("id_usuario, cod_usuario, nome, usuario, data_criacao, funcao") \
            .execute()

        logger.info(f"Usuários encontrados: {len(response.data)}")

        return {
            "success": True,
            "data": response.data,
            "count": len(response.data),
            "supabase_url": SUPABASE_URL
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro detalhado ao buscar usuários: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar usuários: {str(e)}. Verifique a conexão com o Supabase."
        )

# NOTE Adicionado endpoint para listar funções


@app.get("/listaFuncoes")
async def listar_funcoes():
    try:
        logger.info("Iniciando busca de funções no Supabase")

        if supabase is None:
            raise HTTPException(
                status_code=500, detail="Cliente Supabase não inicializado")

        response = supabase.table("funcoes").select("*").execute()

        logger.info(f"Funções encontradas: {len(response.data)}")

        return {
            "success": True,
            "data": response.data,
            "count": len(response.data)
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar funções: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar funções: {str(e)}"
        )

# Rota para login


@app.get("/login")
@app.post("/login")
async def login(credenciais: UsuarioLogin = None):
    if credenciais is None:
        return {"message": "Use POST com Usuario e Senha"}

    try:
        response = supabase.table("usuarios") \
            .select("*") \
            .eq("usuario", credenciais.Usuario) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=401, detail="Usuário não encontrado")

        usuario = response.data[0]

        if usuario["senha"] != credenciais.Senha:
            raise HTTPException(status_code=401, detail="Senha incorreta")

        usuario.pop("senha", None)

        return {
            "message": "Login realizado com sucesso",
            "usuario": usuario,
            "status": "authenticated"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao realizar login: {str(e)}")

# Rota para criar usuário


@app.get("/usuarios")
@app.post("/usuarios")
async def criar_usuario(usuario: UsuarioCreate = None):
    if usuario is None:
        return {"message": "Use POST com Nome, Usuario e Senha para criar usuário"}

    try:
        logger.info(f"Tentando criar usuário: {usuario.Usuario}")

        # Verificar se usuário já existe
        response = supabase.table("usuarios") \
            .select("usuario") \
            .eq("usuario", usuario.Usuario) \
            .execute()

        logger.info(
            f"Verificação de usuário existente - encontrados: {len(response.data) if response.data else 0}")

        if response.data:
            raise HTTPException(
                status_code=400, detail="Nome de usuário já existe")

        novo_usuario = {
            "nome": usuario.Nome,
            "usuario": usuario.Usuario,
            "senha": usuario.Senha,
            "funcao": usuario.Funcao
        }

        logger.info(f"Dados do novo usuário: {novo_usuario}")

        # Tentar inserir o usuário
        response = supabase.table("usuarios").insert(novo_usuario).execute()

        logger.info(f"Resposta da inserção: {response}")
        logger.info(f"Dados inseridos: {response.data}")

        if not response.data:
            raise HTTPException(
                status_code=500, detail="Falha ao inserir usuário - resposta vazia")

        usuario_criado = response.data[0]
        usuario_criado.pop("senha", None)

        logger.info(f"Usuário criado com sucesso: {usuario_criado}")

        return {
            "message": "Usuário criado com sucesso",
            "data": usuario_criado
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao criar usuário: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
