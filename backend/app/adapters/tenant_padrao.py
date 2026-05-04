import pandas as pd

# Colunas canônicas que este sistema espera. Qualquer CSV de cliente será normalizado para este schema.
COLUNAS_CANONICAS = ['data', 'receita', 'custo']

def adaptar_csv_padrao(file_path: str) -> pd.DataFrame:
    """
    ZONA DE QUARENTENA: Lê um CSV bruto do cliente e garante um schema limpo e confiável.

    Responsabilidades:
    - Ler o arquivo físico do disco.
    - Remover espaços em branco dos nomes das colunas (problema comum em CSVs gerados por Excel).
    - Validar que as colunas canônicas existem após a normalização.
    - Retornar APENAS as colunas necessárias, descartando qualquer coluna extra.

    NÃO realiza cálculos, agrupamentos ou formatações — isso é trabalho do Service.
    """
    # 1. Leitura do arquivo bruto — pode lançar FileNotFoundError para o chamador tratar
    df = pd.read_csv(file_path)

    # 2. Normaliza os nomes das colunas: remove espaços e converte para minúsculas
    df.columns = [col.strip().lower() for col in df.columns]

    # 3. Valida que todas as colunas canônicas estão presentes após a normalização
    colunas_faltando = [col for col in COLUNAS_CANONICAS if col not in df.columns]
    if colunas_faltando:
        raise ValueError(
            f"[ADAPTER] Schema inválido no arquivo '{file_path}'. "
            f"Colunas ausentes após normalização: {colunas_faltando}. "
            f"Colunas encontradas: {list(df.columns)}"
        )

    # 4. Retorna apenas as colunas canônicas, descartando qualquer coluna extra do cliente
    return df[COLUNAS_CANONICAS]
