from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.tenant import DataSource, Tenant
from pydantic import BaseModel
import uuid

router = APIRouter()

# Schema de Validação
class DataSourceCreate(BaseModel):
    tenant_id: str
    spreadsheet_id: str
    sheet_name: str
    column_mapping: dict = None

def verify_admin(x_role: str = Header(None)):
    """Verificação simples de admin (em produção validaria via token/JWT)"""
    if x_role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado: Requer privilégios de administrador")
    return True

@router.post("/config/datasource")
def configure_datasource(data: DataSourceCreate, db: Session = Depends(get_db), is_admin: bool = Depends(verify_admin)):
    """
    Salva a configuração do Google Sheets (DataSource) vinculada a um Tenant no banco de dados.
    Esta é a API chamada pelo Painel Administrativo.
    """
    
    # 1. Verifica se o Tenant existe
    try:
        tenant_uuid = uuid.UUID(data.tenant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de tenant_id inválido")

    tenant = db.query(Tenant).filter(Tenant.id == tenant_uuid).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant não encontrado")

    # 2. Verifica se já existe fonte de dados e atualiza (ou cria nova)
    existing_ds = db.query(DataSource).filter(
        DataSource.tenant_id == tenant_uuid,
        DataSource.source_type == 'google_sheets'
    ).first()

    if existing_ds:
        existing_ds.spreadsheet_id = data.spreadsheet_id
        existing_ds.sheet_name = data.sheet_name
        existing_ds.column_mapping = data.column_mapping
    else:
        new_ds = DataSource(
            tenant_id=tenant_uuid,
            source_type='google_sheets',
            spreadsheet_id=data.spreadsheet_id,
            sheet_name=data.sheet_name,
            column_mapping=data.column_mapping
        )
        db.add(new_ds)

    db.commit()
    return {"message": "DataSource do Google Sheets configurado com sucesso!"}
