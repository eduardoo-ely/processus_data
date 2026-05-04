import pandas as pd
from typing import Callable

# =============================================================================
#  CAMADA SEMÂNTICA — SSoT (Single Source of Truth) das Métricas de Negócio
#
#  Filosofia: cada métrica é uma função pura que recebe um DataFrame pandas
#  e retorna uma pd.Series. Isso garante que a lógica de negócio esteja em
#  UM único lugar, e qualquer serviço que precise dela apenas importa aqui.
#
#  Para adicionar uma nova métrica: basta adicionar uma entrada no dicionário.
#  Nenhum outro arquivo precisa ser modificado.
# =============================================================================

# Tipo base de uma definição de métrica
MetricFn = Callable[[pd.DataFrame], pd.Series]

# ── DEFINIÇÕES DE MÉTRICAS ────────────────────────────────────────────────────
#
# Regra de nomenclatura:
#   - chave   → nome canônico da coluna que será criada no DataFrame
#   - "label" → nome legível para exibição no front-end
#   - "fn"    → função lambda que recebe o DataFrame e retorna uma pd.Series
#
# As funções lambda operam sobre colunas já garantidas pelo Adapter:
#   ['data', 'receita', 'custo']
# =============================================================================

METRIC_DEFINITIONS: dict[str, dict] = {

    # Lucro bruto simples: receita menos custo
    "lucro_bruto": {
        "label": "Lucro Bruto",
        "fn": lambda df: df["receita"] - df["custo"],
    },

    # Margem de contribuição percentual: (lucro / receita) * 100
    # Evita divisão por zero com replace
    "margem_contribuicao": {
        "label": "Margem de Contribuição (%)",
        "fn": lambda df: ((df["receita"] - df["custo"]) / df["receita"].replace(0, pd.NA) * 100).round(2),
    },

    # Receita líquida simulada (assumindo 15% de impostos sobre receita bruta)
    # Em produção, o percentual de imposto viria de tenant_configs
    "receita_liquida": {
        "label": "Receita Líquida (após impostos est.)",
        "fn": lambda df: df["receita"] * 0.85,
    },

    # EBITDA simplificado: lucro bruto (sem amortização/depreciação neste contexto)
    "ebitda": {
        "label": "EBITDA Simplificado",
        "fn": lambda df: df["receita"] - df["custo"],
    },
}


def aplicar_metricas_semanticas(df: pd.DataFrame, metricas: list[str] | None = None) -> pd.DataFrame:
    """
    Aplica as métricas da Camada Semântica a um DataFrame limpo (pós-Adapter).

    Args:
        df: DataFrame com schema canônico garantido pelo Adapter ['data', 'receita', 'custo'].
        metricas: Lista de chaves de METRIC_DEFINITIONS a aplicar. Se None, aplica todas.

    Returns:
        DataFrame original com as colunas calculadas adicionadas.

    Exemplo de uso no Service:
        df = aplicar_metricas_semanticas(df, metricas=['lucro_bruto', 'margem_contribuicao'])
    """
    targets = metricas if metricas is not None else list(METRIC_DEFINITIONS.keys())

    for key in targets:
        if key not in METRIC_DEFINITIONS:
            print(f"[SEMANTIC] Métrica desconhecida ignorada: '{key}'")
            continue
        try:
            df[key] = METRIC_DEFINITIONS[key]["fn"](df)
        except Exception as e:
            # Falha em uma métrica não deve travar o processamento das outras
            print(f"[SEMANTIC] Erro ao calcular '{key}': {e}")

    return df


def listar_metricas() -> list[dict]:
    """
    Retorna a lista de métricas disponíveis para exibição no painel admin.
    Usado pelo endpoint de configuração de Tenants.
    """
    return [
        {"key": k, "label": v["label"]}
        for k, v in METRIC_DEFINITIONS.items()
    ]
