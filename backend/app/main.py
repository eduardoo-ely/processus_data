from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api.dashboard import router as dashboard_router

# Cria as tabelas do banco SaaS (Tenants, Users, DataSources)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SaaS Painel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    # Segurança: Apenas o frontend em Next.js tem permissão de consultar a API (desenvolvimento/produção)
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra as rotas
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
