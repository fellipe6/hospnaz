#!/bin/bash

# Script para conectar o repositório local ao GitHub
# Uso: ./connect-github.sh SEU_USUARIO_GITHUB

if [ -z "$1" ]; then
    echo "❌ Erro: Você precisa informar seu usuário do GitHub"
    echo "Uso: ./connect-github.sh SEU_USUARIO_GITHUB"
    echo ""
    echo "Exemplo: ./connect-github.sh fellipe"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME="hospnaz"

echo "🔗 Conectando ao repositório GitHub..."
echo "   Usuário: $GITHUB_USER"
echo "   Repositório: $REPO_NAME"
echo ""

# Adicionar remote
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

if [ $? -eq 0 ]; then
    echo "✅ Remote adicionado com sucesso!"
    echo ""
    echo "📤 Fazendo push para o GitHub..."
    
    # Fazer push
    git push -u origin master
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Sucesso! Seu código foi enviado para o GitHub!"
        echo "🔗 Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
    else
        echo ""
        echo "⚠️  Erro ao fazer push. Possíveis causas:"
        echo "   1. O repositório 'hospnaz' ainda não foi criado no GitHub"
        echo "   2. Você não tem permissão de acesso"
        echo "   3. Precisa configurar autenticação (token ou SSH)"
        echo ""
        echo "📖 Consulte o arquivo SETUP_GITHUB.md para mais detalhes"
    fi
else
    echo "❌ Erro ao adicionar remote"
    echo "   Verifique se o remote já existe com: git remote -v"
fi
