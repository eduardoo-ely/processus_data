import pandas as pd
from sqlalchemy.orm import Session
from app.models.tenant import DataSource
from app.adapters.google_sheets_adapter import adaptar_google_sheets
from app.semantic.metrics_definitions import aplicar_metricas_semanticas

def process_financial_data(tenant_id: str, db: Session) -> list[dict]:
    """
    O SERVIÇO DE PROCESSAMENTO: Orquestra o pipeline completo de dados isolando por Tenant.

    Pipeline:
      1. Busca no Postgres o spreadsheet_id vinculado APENAS ao tenant_id.
      2. Adapter  → lê Google Sheets e garante schema canônico ['data', 'receita', 'custo'].
      3. Semantic → aplica as métricas da Camada Semântica (lucro_bruto, margem, etc.).
      4. Service  → agrupa, formata e retorna JSON puro para o Recharts.
    """
    
    # 1. Busca Segura no PostgreSQL (Isolamento Multi-tenant)
    # Garante que NUNCA um tenant acesse a planilha de outro
    data_source = db.query(DataSource).filter(
        DataSource.tenant_id == tenant_id,
        DataSource.source_type == 'google_sheets'
    ).first()

    if not data_source:
        print(f"[SERVICE] Fonte de dados Google Sheets não configurada para tenant '{tenant_id}'")
        return []

    try:
        # 2. ZONA DE QUARENTENA — Lê da planilha isolada do cliente e aplica De-Para
        df = adaptar_google_sheets(
            spreadsheet_id=data_source.spreadsheet_id,
            sheet_name=data_source.sheet_name,
            column_mapping=data_source.column_mapping
        )

        if df.empty:
            return []

        # Garante tipos numéricos antes de qualquer cálculo
        df['receita'] = pd.to_numeric(df['receita'], errors='coerce').fillna(0)
        df['custo']   = pd.to_numeric(df['custo'],   errors='coerce').fillna(0)

        # 3. CAMADA SEMÂNTICA — enriquece o DataFrame com métricas calculadas
        df = aplicar_metricas_semanticas(df, metricas=['lucro_bruto', 'margem_contribuicao', 'receita_liquida'])

        # 4. AGRUPAMENTO & FORMATAÇÃO — consolida por período (coluna 'data')
        resultado = df.groupby('data', as_index=False).agg(
            receita=('receita', 'sum'),
            custo=('custo', 'sum'),
            lucro_bruto=('lucro_bruto', 'sum'),
            margem_contribuicao=('margem_contribuicao', 'mean'),
            receita_liquida=('receita_liquida', 'sum'),
        ).round(2)

        return resultado.to_dict(orient='records')

    except ConnectionError as e:
        print(f"[SERVICE] Erro de conexão com Google Sheets: {e}")
        return []
    except ValueError as e:
        print(f"[SERVICE] Erro de processamento/schema: {e}")
        return []
