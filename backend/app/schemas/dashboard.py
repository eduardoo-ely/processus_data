from pydantic import BaseModel

class FinancialDataRecord(BaseModel):
    mes: str
    receita: float
    custo: float
