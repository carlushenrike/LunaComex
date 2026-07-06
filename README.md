# 🌐 LunaComex

Sistema para gestão de importação focando no Novo Processo de Importação (NPI), emissão de DUIMP e catálogo de produtos integrado com as APIs do Siscomex/Portal Único.

## 🚀 O que o projeto faz

- **Catálogo de Produtos:** Cadastro de mercadorias com busca automática de atributos da Receita Federal com base na NCM. Trata atributos condicionais (relação pai/filho) dinamicamente no frontend.
- **Wizard de DUIMP:** Passo a passo para gerar a DUIMP, contendo capa/identificação, dados de carga/transporte, documentos fiscais, lista de itens com importação simulada de XML e tela de pagamentos.
- **Financeiro:** Mapeamento de despesas operacionais da importação (armazenagem, frete, taxas), solicitações de numerário e tela de aprovação de reembolso.

## 🛠️ Stack de tecnologia

- **Frontend:** Angular 18 (standalone components e signals) + TailwindCSS
- **Backend:** Node.js (Express) + Sequelize (PostgreSQL) + MongoDB (para logs/histórico)

## ⚙️ Como rodar localmente

### 1. Backend
Entre na pasta da API:
```bash
cd portal-unico-api
```
Instale os pacotes:
```bash
npm install
```
Crie um arquivo `.env` na raiz da pasta `portal-unico-api` com os dados do banco:
```env
PORT=3000
DB_NAME=lunacomex
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost
```
Rode o servidor local:
```bash
npm run dev
```

### 2. Frontend
Entre na pasta do Angular:
```bash
cd front
```
Instale as dependências (utilize legacy peer deps para evitar conflito com as libs de build):
```bash
npm install --legacy-peer-deps
```
Inicie o servidor do frontend:
```bash
npx ng serve
```
Abra no navegador em `http://localhost:4200`

## 📂 Estrutura da UI
Os componentes da interface estão divididos por pastas dentro de `front/src/app/components`:
- `catalog/` - tela do catálogo de produtos e integração da ncm
- `dashboard/` - dashboard geral de status do sistema
- `duimp/` - wizard e os componentes de cada step da duimp
- `financial/` - controle de despesas e fechamento
- `internal-finance/` - painel de aprovação das despesas pelo financeiro
- `layout/` - header e sidebar
- `numerario/` - fluxo de adiantamentos
- `process-closing/` - checklist de encerramento do processo
- `tracking/` - rastreamento cct
- `ui/` - ícones e elementos comuns
