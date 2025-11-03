from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = "https://vvrubxrubmyqmhgiaqog.supabase.co"
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
    try:
        if supabase is None:
            return {"error": "Cliente Supabase não inicializado"}

        resultado = {}

        # Testa a tabela Funcoes
        try:
            funcoes = supabase.table('Funcoes').select("*").limit(1).execute()
            resultado["Funcoes"] = {
                "existe": True,
                "colunas": list(funcoes.data[0].keys()) if funcoes.data else [],
                "total_registros": len(funcoes.data)
            }
        except Exception as e:
            resultado["Funcoes"] = {"existe": False, "erro": str(e)}

        # Testa a tabela Usuarios
        try:
            usuarios = supabase.table('Usuarios').select("*").limit(1).execute()
            resultado["Usuarios"] = {
                "existe": True,
                "colunas": list(usuarios.data[0].keys()) if usuarios.data else [],
                "total_registros": len(usuarios.data)
            }
        except Exception as e:
            resultado["Usuarios"] = {"existe": False, "erro": str(e)}

        return resultado

    except Exception as e:
        return {"error": f"Erro geral: {str(e)}"}


@app.get("/health")
async def health_check():
    try:
        if supabase is None:
            return {"status": "unhealthy", "supabase_connected": False, "error": "Cliente não inicializado"}

        _ = supabase.table('Funcoes').select("*").limit(1).execute()

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


@app.get("/listaUsuarios")
async def listar_usuarios():
    try:
        logger.info("Iniciando busca de usuários no Supabase")

        if supabase is None:
            raise HTTPException(status_code=500, detail="Cliente Supabase não inicializado")

        # Teste de conectividade
        _ = supabase.table('Funcoes').select("*").limit(1).execute()
        logger.info("Conectividade com Supabase OK")

        # Teste de acesso à tabela Usuarios
        test_response = supabase.table('Usuarios').select("*").limit(1).execute()
        logger.info(f"Tabela Usuarios existe. Teste: {test_response}")

        # Busca efetiva
        response = supabase.table('Usuarios') \
            .select("ID_Usuario, Cod_Usuario, Nome, Usuario, Data_Criacao, Funcao") \
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


@app.get("/listaFuncoes")
async def listar_funcoes():
    try:
        logger.info("Iniciando busca de funções no Supabase")

        if supabase is None:
            raise HTTPException(status_code=500, detail="Cliente Supabase não inicializado")

        response = supabase.table('Funcoes').select("*").execute()

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
        raise HTTPException(status_code=500, detail=f"Erro ao buscar funções: {str(e)}")


@app.get("/login")
@app.post("/login")
async def login(credenciais: UsuarioLogin = None):
    if credenciais is None:
        return {"message": "Use POST com Usuario e Senha"}

    try:
        response = supabase.table("Usuarios") \
            .select("*") \
            .eq("Usuario", credenciais.Usuario) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")

        usuario = response.data[0]

        if usuario["Senha"] != credenciais.Senha:
            raise HTTPException(status_code=401, detail="Senha incorreta")

        usuario.pop("Senha", None)

        return {
            "message": "Login realizado com sucesso",
            "usuario": usuario,
            "status": "authenticated"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao realizar login: {str(e)}")


@app.get("/usuarios")
@app.post("/usuarios")
async def criar_usuario(usuario: UsuarioCreate = None):
    if usuario is None:
        return {"message": "Use POST com Nome, Usuario, Senha e Funcao para criar usuário"}

    try:
        logger.info(f"Tentando criar usuário: {usuario.Usuario}")

        response = supabase.table("Usuarios") \
            .select("Usuario") \
            .eq("Usuario", usuario.Usuario) \
            .execute()

        if response.data:
            raise HTTPException(status_code=400, detail="Nome de usuário já existe")

        novo_usuario = {
            "Nome": usuario.Nome,
            "Usuario": usuario.Usuario,
            "Senha": usuario.Senha,
            "Funcao": usuario.Funcao
        }

        response = supabase.table("Usuarios").insert(novo_usuario).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao inserir usuário - resposta vazia")

        usuario_criado = response.data[0]
        usuario_criado.pop("Senha", None)

        return {
            "message": "Usuário criado com sucesso",
            "data": usuario_criado
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar usuário: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
