# 🧠 Contexto de Arquitetura — SaaS B2B Monolito Modular

> **Leia este arquivo antes de gerar qualquer código para este projeto.**
> Ele é o contrato de arquitetura que toda I.A. e desenvolvedor deve respeitar.

---

## 1. Filosofia Central: Zero Overengineering

A regra de ouro deste projeto é: **código simples, direto e funcional vence**.

- ❌ Não crie abstrações sem necessidade imediata.
- ❌ Não adicione bibliotecas sem justificativa clara.
- ✅ Cada arquivo tem uma única responsabilidade.
- ✅ Comentários explicam o *porquê*, não o *o quê*.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão | Responsabilidade |
|---|---|---|---|
| Front-end | Next.js (App Router) | 14+ | UI, autenticação, consumo da API |
| Back-end | FastAPI + Uvicorn | 0.110+ | API REST, processamento de dados |
| Dados | Pandas | 2.x | Leitura e transformação de arquivos dos clientes |
| Banco SaaS | PostgreSQL | 15 | Apenas metadados: Tenants, Users, DataSources |
| Infraestrutura | Docker + Compose | 3.8 | Orquestração dos 3 serviços |
| Auth Front | NextAuth (Auth.js) | v5 beta | Sessão JWT no Next.js |

---

## 3. Separação de Responsabilidades do Banco de Dados

> **Regra crítica:** O PostgreSQL deste projeto **NÃO** armazena dados de negócios.

O PostgreSQL armazena **apenas**:
- `tenants` — Clientes da plataforma SaaS.
- `users` — Usuários vinculados a um Tenant.
- `data_sources` — Configurações de onde estão os dados do cliente (path de CSV, URL de banco externo, etc).

Os dados de negócios (vendas, receita, estoque, etc.) **pertencem ao cliente** e são lidos dinamicamente em tempo de requisição pelo back-end Python.

---

## 4. Arquitetura de Processamento de Dados (Adapter Pattern)

O processamento de dados segue um fluxo em 2 camadas:

```
Requisição HTTP
      │
      ▼
 [API Router]          → valida tenant_id (header X-Tenant-ID)
      │
      ▼
 [data_processor.py]   → orquestra: chama adaptador, processa e retorna JSON
      │
      ▼
 [adapters/]           ← ZONA DE QUARENTENA: lê o arquivo bruto e garante schema limpo
```

### 4.1 Zona de Quarentena (Adapters)
A pasta `backend/app/adapters/` contém um adaptador por tipo de schema de dado esperado.

**Regras do Adaptador:**
- Lê o arquivo CSV bruto do cliente (que pode ter colunas com espaços, nomes errados, etc.).
- Normaliza e retorna **sempre** um DataFrame com colunas canônicas: `['data', 'receita', 'custo']`.
- **Nunca** realiza cálculos ou agrupamentos — essa é responsabilidade do Service.
- Se o schema for inválido, lança um erro descritivo.

### 4.2 Service (data_processor.py)
- **Nunca** lê arquivos diretamente.
- Recebe um DataFrame limpo do Adaptador.
- Aplica agrupamentos (`groupby`), cálculos derivados (ex: `lucro = receita - custo`) e formata o JSON final para o Recharts.

---

## 5. Hierarquia de Rotas

### Back-end (FastAPI)
```
/api/v1/dashboard/{modulo}/{dash}
```
- `{modulo}`: ex. `financeiro`, `vendas`, `operacional`
- `{dash}`: ex. `receita`, `pipeline`, `margem`

### Front-end (Next.js App Router)
```
/dashboard/[modulo]/[dash]/page.tsx
```
Os dois parâmetros dinâmicos espelham a estrutura do back-end.

---

## 6. Segurança

- **CORS:** Apenas `http://localhost:3000` (dev) e a URL de produção do front são permitidas.
- **Multi-tenancy:** Toda requisição de dados **deve** enviar o header `X-Tenant-ID` com o UUID do Tenant.
- **NextAuth:** Requer variável `AUTH_SECRET` no `.env` do front-end. Usar `openssl rand -base64 32` para gerar.
- **Hydration:** Tags `<html>` e `<body>` no layout raiz devem ter `suppressHydrationWarning`.
