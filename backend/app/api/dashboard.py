from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.tenant import Tenant, DataSource
from app.schemas.dashboard import FinancialDataRecord
from app.services.data_processor import process_financial_data

router = APIRouter()

def get_tenant_id(x_tenant_id: str = Header(None)):
    if not x_tenant_id:
        raise HTTPException(status_code=401, detail="Header X-Tenant-ID é obrigatório. Acesso negado.")
    return x_tenant_id

@router.get("/{modulo}/{dash}", response_model=list[FinancialDataRecord])
def get_dashboard(modulo: str, dash: str, tenant_id: str = Depends(get_tenant_id), db: Session = Depends(get_db)):
    """
    Endpoint genérico: /api/v1/dashboard/{modulo}/{dash}
    """
    # Delega toda a lógica (busca no Postgres, Google Sheets, Semântica) para o Motor de Processamento
    processed_data = process_financial_data(tenant_id=str(tenant_id), db=db)

    return processed_data
