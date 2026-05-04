from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.tenant import Tenant, DataSource
from app.schemas.dashboard import FinancialDataRecord
from app.services.data_processor import process_financial_data

router = APIRouter()

def get_tenant_id(x_tenant_id: str = Header(None)):
    if not x_tenant_id:
        # Mocking demo tenant if not provided
        return "11111111-1111-1111-1111-111111111111"
    return x_tenant_id

@router.get("/financeiro", response_model=list[FinancialDataRecord])
def get_dashboard_financeiro(tenant_id: str = Depends(get_tenant_id), db: Session = Depends(get_db)):
    """
    Busca os dados do dashboard financeiro lendo a configuração do Tenant e processando no Pandas.
    """
    # 1. Busca a conexão de dados do Tenant
    data_source = db.query(DataSource).filter(
        DataSource.tenant_id == tenant_id,
        DataSource.source_type == 'csv' # Simplificação para este exemplo
    ).first()

    if not data_source:
        # Caso o tenant não tenha config, retorna vazio ou pode usar uma lógica default
        return []

    # 2. Chama o motor dinâmico com Pandas para ler e processar os dados
    processed_data = process_financial_data(
        tenant_id=tenant_id,
        source_type=data_source.source_type,
        connection_string=data_source.connection_string
    )

    return processed_data
