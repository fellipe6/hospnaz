# 🏥 HospNaz - Sistema de Gestão Hospitalar

Sistema de gestão hospitalar desenvolvido com Vue.js e PrimeVue.

## 🚀 Funcionalidades

### Módulo de Pacientes
- ✅ Cadastro completo de pacientes
- ✅ Listagem com busca e filtros
- ✅ **Visualização detalhada** em nova tela dedicada 👁️
- ✅ **Edição rápida** via modal integrada
- ✅ Exportação para CSV
- ✅ Validação de campos obrigatórios
- ✅ Máscaras automáticas para CPF, telefone e CEP
- ✅ **Busca automática de endereço por CEP** (integração com ViaCEP)
- ✅ **Captura de foto via Webcam** 📸
- ✅ **Agendamento** com calendário interativo

### Módulo PEP (Prontuário Eletrônico)
- ✅ Lista de atendimentos com filtros
- ✅ **Prontuário Clínico Avançado** com abas 🫀
- ✅ **Cabeçalho Clínico Rico** com dados vitais e **Insights Visuais** (Alertas)
- ✅ **Histórico Longitudinal** (Timeline de atendimentos anteriores)
- ✅ **Documentos Clínicos:** Emissão de Prescrições, Atestados e Declarações
- ✅ **Preview Digital:** Visualização de documentos em layout padrão hospitalar
- ✅ **Evoluções em Linha do Tempo**
- ✅ **Resumo Clínico Cognitivo** gerado automaticamente
- ✅ Gestão de Sinais Vitais com alertas visuais
- ✅ Fluxo de finalização e bloqueio de edição

### 📊 Governança e Inteligência
- ✅ **Dashboard HIS Executivo:** KPIs estratégicos, fluxo de pacientes e produtividade
- ✅ **Gestão de Usuários:** Controle visual por perfis (ADMIN, MEDICO, ENFERMAGEM, FINANCEIRO)
- ✅ **Trilha de Auditoria:** Rastreabilidade total de ações críticas via timeline
- ✅ **Indicadores Assistenciais:** Gráficos de especialidades, CID-10 e qualidade PEP

## 🔐 Credenciais de Acesso (Mock)

| Perfil | E-mail | Senha | Acesso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@hospnaz.com.br` | `admin123` | Total (Governança + HIS) |
| **Médico** | `medico@hospnaz.com.br` | `medico123` | PEP, Pacientes e Agendas |
| **Enfermagem** | `enfermaria@hospnaz.com.br` | `enf123` | Pacientes e Sinais Vitais |
| **Financeiro** | `financeiro@hospnaz.com.br` | `fin123` | Gestão de Custos e Contas |

### Módulo Financeiro
- ✅ **Dashboard Financeiro** com KPIs de despesas e custos 📊
- ✅ **Contas a Pagar** integrado ao Almoxarifado 🧾
- ✅ **Lançamentos Detalhados** de custos operacionais
- ✅ **Centros de Custo** por setor (Farmácia, UTI, etc)
- ✅ **Relatórios Financeiros** com simulação de exportação

### Módulo de Farmácia Hospitalar
- ✅ **Dashboard da Farmácia** com KPIs e gráficos de consumo 💊
- ✅ **Prescrições Pendentes** integradas para separação
- ✅ **Fluxo de Dispensação Seguro** com conferência de lote e dose
- ✅ **Inventário Farmacêutico (NOVO):** Gestão detalhada de lotes, validades e estoques críticos
- ✅ **Trilha de Movimentações** (Entradas e Saídas)
- ✅ Gestão de Lotes e Vencimentos semafórica

### 🏥 Fluxo Clínico Unificado (E2E)
- ✅ **PEP 360º (NOVO):** Visão ultra-integrada com Timeline, Farmácia, Exames e Sumário Cognitivo
- ✅ **Atendimento V2:** Interface otimizada com sinais vitais e CID-10 integrado
- ✅ **Histórico Longitudinal:** Linha do tempo unificada de toda a jornada do paciente
- ✅ **Integração Clínica-Farmácia:** Prescrições geram demandas imediatas para dispensação
- ✅ **Baixa Automática:** Dispensação impacta o inventário e gera trilha de auditoria

### Módulo de Almoxarifado
- ✅ Dashboard com indicadores de estoque (KPIs)
- ✅ Catálogo de produtos com status visual
- ✅ Movimentações de Entrada e Saída (Gestão de Fluxo)
- ✅ Controle automático de Estoque Crítico/Baixo
- ✅ Gestão de Fornecedores

### Dashboard HIS Executivo (Principal)
- ✅ Resumo em tempo real de Pacientes e Agendas
- ✅ **KPIs Assistenciais:** Tempo médico, pendências e volumes
- ✅ **Fluxo Operacional:** Gráficos de Entradas vs Altas
- ✅ **Produtividade:** Ranking de atendimentos por profissional
- ✅ **Atividade PEP:** Monitoramento de evoluções e documentos em tempo real

### Ambiente de Desenvolvimento
- 🔒 **HTTPS Habilitado** (Necessário para testar câmera)
- 📦 Configuração automática via script de setup
- ✒️ Desenvolvido por **fellipe ribeiro nazasoft**

## 🛠️ Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **PrimeVue** - Biblioteca de componentes UI
- **Vite** - Build tool e dev server
- **JavaScript** - Linguagem de programação

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Estilos e recursos estáticos
├── components/      # Componentes reutilizáveis
├── layout/          # Componentes de layout
├── router/          # Configuração de rotas
├── service/         # Serviços e APIs
├── views/           # Páginas da aplicação
│   └── pages/
│       └── Patients.vue  # Módulo de pacientes
└── App.vue          # Componente raiz
```

## 🔐 Privacidade

Este é um repositório **privado** contendo código proprietário do sistema HospNaz.

## 👥 Contribuindo

Este projeto é privado. Apenas colaboradores autorizados podem contribuir.

## 📄 Licença

Todos os direitos reservados © 2026 HospNaz
