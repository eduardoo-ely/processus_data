CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    source_type VARCHAR(50) NOT NULL, -- e.g., 'csv', 'postgres', 'mysql'
    connection_string TEXT NOT NULL,  -- e.g., path to csv or db url
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um Tenant de demonstração
INSERT INTO tenants (id, name) VALUES ('11111111-1111-1111-1111-111111111111', 'Demo Corp SaaS') ON CONFLICT DO NOTHING;

-- Inserir uma fonte de dados mock apontando para um arquivo CSV
INSERT INTO data_sources (id, tenant_id, source_type, connection_string) 
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'csv', 'demo_financeiro.csv') ON CONFLICT DO NOTHING;
