from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Boolean, JSON, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.database import Base


class Tenant(Base):
    __tablename__ = "tenants"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name       = Column(String, nullable=False)
    is_active  = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class User(Base):
    __tablename__ = "users"
    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id     = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    email         = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at    = Column(DateTime, server_default=func.now())


class DataSource(Base):
    """
    Guarda onde estão os dados brutos do cliente.
    column_mapping: JSON que mapeia colunas brutas do CSV → colunas canônicas do sistema.
    Ex: {"Faturamento Bruto": "receita", "Custo Total": "custo", "Período": "data"}
    """
    __tablename__ = "data_sources"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id         = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    source_type       = Column(String, nullable=False, default='google_sheets')
    spreadsheet_id    = Column(String, nullable=False)           # ID da planilha Google
    sheet_name        = Column(String, nullable=False)           # Aba da planilha
    column_mapping    = Column(JSON, nullable=True)            # de-para de colunas brutas → canônicas
    created_at        = Column(DateTime, server_default=func.now())


class TenantConfig(Base):
    """
    Configurações por tenant: quais módulos estão ativos e quais métricas semânticas foram habilitadas.
    active_modules: lista de IDs de módulos ativos (ex: ["financeiro", "vendas"]).
    active_metrics:  lista de chaves de métricas da Camada Semântica (ex: ["lucro_bruto", "margem_contribuicao"]).
    """
    __tablename__ = "tenant_configs"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id      = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), unique=True, nullable=False)
    active_modules = Column(JSON, default=list)   # ["financeiro", "vendas", ...]
    active_metrics = Column(JSON, default=list)   # ["lucro_bruto", "margem_contribuicao", ...]
    created_at     = Column(DateTime, server_default=func.now())
    updated_at     = Column(DateTime, server_default=func.now(), onupdate=func.now())
