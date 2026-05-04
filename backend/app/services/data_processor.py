import pandas as pd
import os

def process_financial_data(tenant_id: str, source_type: str, connection_string: str) -> list[dict]:
    """
    O MOTOR DINÂMICO: Lê dados físicos baseando-se no tenant_id e processa com Pandas.
    """
    if source_type == 'csv':
        # Constrói o caminho de forma dinâmica para isolar fisicamente os clientes
        file_path = f"/app/dados_clientes/tenant_{tenant_id}/{connection_string}"
        
        try:
            # Tenta ler o arquivo CSV físico montado pelo Docker
            df = pd.read_csv(file_path)
            
            # (Opcional) Limpeza ou tratamento
            if df.empty:
                return []
                
            return df.to_dict(orient='records')
            
        except FileNotFoundError:
            # Tratamento de erro limpo caso a pasta do cliente ou arquivo não exista
            print(f"[ERROR] Arquivo não encontrado para o tenant: {file_path}")
            return []
    
    # Retorno padrão
    return []
