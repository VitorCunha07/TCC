# api_supabase.py
from fastapi import FastAPI, HTTPException, Depends
from supabase import create_client
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

# Configuração do Supabase
SUPABASE_URL = "https://vvrubxrubmyqmingiaqog.supabase.co"
SUPABASE_KEY = "sb_secret_gUTiHwcdYvr1os_jCCFKeQ_YJrf2Gsn" 

# Inicializa cliente Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Inicializa FastAPI
app = FastAPI(
    title="API Supabase - Sistema de Autenticação",
    description="API para autenticação de usuários com Supabase",
    version="1.0.0"
)

# Modelos Pydantic
class UsuarioCreate(BaseModel):
    Nome: str
    Usuario: str
    Senha: str
    Funcao: Optional[int] = None

class UsuarioLogin(BaseModel):
    Usuario: str
    Senha: str

class UsuarioResponse(BaseModel):
    ID_Usuario: int
    Cod_Usuario: str
    Nome: str
    Usuario: str
    Funcao: Optional[int] = None
    Data_Criacao: datetime

# Rota padrão de health check
@app.get("/")
async def root():
    return {
        "message": "API de Autenticação funcionando!",
        "status": "online",
        "database": "connected" if SUPABASE_URL and SUPABASE_KEY else "disconnected"
    }

# Rota de health check
@app.get("/health")
async def health_check():
    try:
        # Testa a conexão com o Supabase
        response = supabase.table("Usuarios").select("count", count="exact").limit(1).execute()
        return {
            "status": "healthy",
            "database": "connected",
            "supabase_status": "working"
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database": "disconnected",
            "error": str(e)
        }

# Rota para login de usuário
@app.post("/login")
async def login(credenciais: UsuarioLogin):
    try:
        # Busca usuário pelo nome de usuário
        response = supabase.table("Usuarios") \
            .select("*") \
            .eq("Usuario", credenciais.Usuario) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        
        usuario = response.data[0]
        
        # Verifica a senha (em produção, use hash!)
        if usuario["Senha"] != credenciais.Senha:
            raise HTTPException(status_code=401, detail="Senha incorreta")
        
        # Remove a senha da resposta por segurança
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

# Rota para criar novo usuário
@app.post("/usuarios")
async def criar_usuario(usuario: UsuarioCreate):
    try:
        # Verifica se usuário já existe
        response = supabase.table("Usuarios") \
            .select("Usuario") \
            .eq("Usuario", usuario.Usuario) \
            .execute()
        
        if response.data:
            raise HTTPException(status_code=400, detail="Nome de usuário já existe")
        
        # Cria o usuário
        novo_usuario = {
            "Nome": usuario.Nome,
            "Usuario": usuario.Usuario,
            "Senha": usuario.Senha,  # Em produção, hash esta senha!
            "Funcao": usuario.Funcao
        }
        
        response = supabase.table("Usuarios").insert(novo_usuario).execute()
        
        # Remove a senha da resposta
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

# Rota para listar todos os usuários (sem senhas)
@app.get("/usuarios")
async def listar_usuarios():
    try:
        response = supabase.table("Usuarios") \
            .select("ID_Usuario, Cod_Usuario, Nome, Usuario, Data_Criacao, Funcao") \
            .execute()
        
        return {"data": response.data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar usuários: {str(e)}")

# Rota para buscar usuário por ID
@app.get("/usuarios/{usuario_id}")
async def buscar_usuario(usuario_id: int):
    try:
        response = supabase.table("Usuarios") \
            .select("ID_Usuario, Cod_Usuario, Nome, Usuario, Data_Criacao, Funcao") \
            .eq("ID_Usuario", usuario_id) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return {"data": response.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar usuário: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)