# Configuração do Repositório GitHub - hospnaz

## Passos para criar o repositório privado no GitHub:

### 1. Criar o repositório no GitHub
1. Acesse: https://github.com/new
2. Preencha os campos:
   - **Repository name:** `hospnaz`
   - **Description:** Sistema de gestão hospitalar
   - **Visibility:** ✅ **Private** (marque como privado)
   - **NÃO** marque "Initialize this repository with a README"
3. Clique em **Create repository**

### 2. Conectar o repositório local ao GitHub

Após criar o repositório, o GitHub mostrará instruções. Use os comandos abaixo:

```bash
# Adicionar o remote do novo repositório
git remote add origin https://github.com/SEU_USUARIO/hospnaz.git

# Ou se preferir usar SSH:
# git remote add origin git@github.com:SEU_USUARIO/hospnaz.git

# Fazer push do código para o GitHub
git push -u origin master
```

### 3. Verificar se funcionou

```bash
# Verificar o remote configurado
git remote -v

# Verificar o status
git status
```

## ✅ Commits já realizados

O projeto já tem um commit com todas as mudanças recentes:
- Módulo de pacientes completo
- Busca automática de endereço por CEP (ViaCEP)
- Formulário de cadastro com validações
- Máscaras para CPF, telefone e CEP

## 📝 Próximos passos

Após conectar ao GitHub, você pode:
- Adicionar colaboradores (Settings → Collaborators)
- Configurar branch protection rules
- Adicionar um README.md personalizado
- Configurar GitHub Actions para CI/CD
