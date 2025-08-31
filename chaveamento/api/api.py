# api_supabase.py
from fastapi import FastAPI, HTTPException
from supabase import create_client
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configuração do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Inicializa cliente Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Inicializa FastAPI
app = FastAPI(
    title="API Supabase",
    description="API para conexão com Supabase",
    version="1.0.0"
)

# Rota padrão de health check
@app.get("/")
async def root():
    return {
        "message": "API Supabase funcionando!",
        "status": "online",
        "database": "connected" if SUPABASE_URL and SUPABASE_KEY else "disconnected"
    }

# Rota de health check
@app.get("/health")
async def health_check():
    try:
        # Testa a conexão com o Supabase
        response = supabase.table("").select("count", count="exact").limit(1).execute()
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

# Exemplo de rota para buscar dados de uma tabela
@app.get("/items")
async def get_items():
    try:
        # Altere "your_table_name" para o nome da sua tabela
        response = supabase.table("your_table_name").select("*").execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados: {str(e)}")

# Exemplo de rota para inserir dados
@app.post("/items")
async def create_item(item: dict):
    try:
        # Altere "your_table_name" para o nome da sua tabela
        response = supabase.table("your_table_name").insert(item).execute()
        return {"message": "Item criado com sucesso", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar item: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)