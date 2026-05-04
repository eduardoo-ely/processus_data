CREATE TABLE IF NOT EXISTS tenants (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID REFERENCES tenants(id),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_sources (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID REFERENCES tenants(id),
    source_type       VARCHAR(50) NOT NULL,
    connection_string TEXT NOT NULL,
    -- De-Para: mapeia colunas brutas do CSV do cliente para o schema canônico do sistema
    -- Ex: {"Faturamento Bruto": "receita", "Custo Total": "custo", "Período": "data"}
    column_mapping    JSONB,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configurações por tenant: módulos e métricas semânticas ativadas
CREATE TABLE IF NOT EXISTS tenant_configs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID UNIQUE REFERENCES tenants(id) NOT NULL,
    -- Ex: ["financeiro", "vendas", "operacional"]
    active_modules JSONB DEFAULT '[]',
    -- Ex: ["lucro_bruto", "margem_contribuicao"]
    active_metrics JSONB DEFAULT '[]',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── SEED DE DEMONSTRAÇÃO ──────────────────────────────────────────────────────
INSERT INTO tenants (id, name, is_active)
VALUES ('11111111-1111-1111-1111-111111111111', 'Demo Corp SaaS', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO tenants (id, name, is_active)
VALUES ('33333333-3333-3333-3333-333333333333', 'Acme Ltda', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO data_sources (id, tenant_id, source_type, connection_string, column_mapping)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'csv',
    'demo_financeiro.csv',
    '{"data": "data", "receita": "receita", "custo": "custo"}'
) ON CONFLICT DO NOTHING;

INSERT INTO tenant_configs (tenant_id, active_modules, active_metrics)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '["financeiro", "vendas"]',
    '["lucro_bruto", "margem_contribuicao"]'
) ON CONFLICT DO NOTHING;
