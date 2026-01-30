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
- ✅ Prontuário detalhado com Sinais Vitais
- ✅ Seções de Evolução, Diagnóstico (CID-10) e Prescrição
- ✅ Fluxo de finalização e bloqueio de edição

## 🔐 Credenciais de Acesso (Mock)

| Perfil | E-mail | Senha | Acesso |
| :--- | :--- | :--- | :--- |
| **Super Usuário** | `admin@hospnaz.com.br` | `admin123` | Total (Admin) |
| **Médico** | `medico@hospnaz.com.br` | `medico123` | Pacientes, Agendamento e PEP |

### Módulo de Almoxarifado
- ✅ Dashboard com indicadores de estoque (KPIs)
- ✅ Catálogo de produtos com status visual
- ✅ Movimentações de Entrada e Saída (Gestão de Fluxo)
- ✅ Controle automático de Estoque Crítico/Baixo
- ✅ Gestão de Fornecedores

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
