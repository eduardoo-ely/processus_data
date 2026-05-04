import pandas as pd

# Colunas canônicas requeridas pelo sistema para o fluxo financeiro
COLUNAS_CANONICAS = ['data', 'receita', 'custo']

def adaptar_google_sheets(spreadsheet_id: str, sheet_name: str, column_mapping: dict | None) -> pd.DataFrame:
    """
    ZONA DE QUARENTENA: Lê dados do Google Sheets publicamente acessível (sem autenticação pesada)
    e garante que o schema seja estritamente o canônico do sistema.
    
    A URL de exportação em CSV:
    https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tqx=out:csv&sheet={sheet_name}
    """
    if not spreadsheet_id or not sheet_name:
        raise ValueError("[ADAPTER] spreadsheet_id e sheet_name são obrigatórios.")

    url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tqx=out:csv&sheet={sheet_name}"

    try:
        # 1. Leitura direta via Pandas
        df = pd.read_csv(url)
    except Exception as e:
        raise ConnectionError(f"[ADAPTER] Falha ao ler Google Sheets ({spreadsheet_id}): {e}")

    if df.empty:
        return pd.DataFrame(columns=COLUNAS_CANONICAS)

    # 2. Normaliza nomes das colunas brutas (remove espaços extras)
    df.columns = [str(col).strip() for col in df.columns]

    # 3. Aplica o De-Para (column_mapping)
    # Se houver mapeamento no DB, renomeia as colunas brutas para as canônicas
    if column_mapping:
        # Ex: {"Faturamento Bruto": "receita"}
        # Vamos inverter para usar no df.rename: columns={"Faturamento Bruto": "receita"}
        # O banco já salva o JSON como { "Nome Bruto": "nome_canonico" }
        df = df.rename(columns=column_mapping)
    else:
        # Fallback: converte tudo para minúsculas se não tiver mapping explícito
        df.columns = [col.lower() for col in df.columns]

    # 4. Valida se as colunas canônicas existem
    colunas_faltando = [col for col in COLUNAS_CANONICAS if col not in df.columns]
    if colunas_faltando:
        raise ValueError(
            f"[ADAPTER] Schema inválido. O mapeamento não gerou as colunas necessárias. "
            f"Faltando: {colunas_faltando}. Encontradas: {list(df.columns)}"
        )

    # 5. Retorna APENAS as colunas canônicas
    return df[COLUNAS_CANONICAS]
