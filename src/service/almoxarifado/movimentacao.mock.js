
import { ref } from 'vue';
import { ProdutoService } from './produto.mock';

const movimentacoes = ref([
    { id: 1, produtoId: 101, tipo: 'ENTRADA', quantidade: 100, data: '2024-01-10T10:00:00', responsavel: 'Fellipe', observacao: 'Compra mensal' },
    { id: 2, produtoId: 103, tipo: 'SAIDA', quantidade: 50, data: '2024-01-15T14:30:00', responsavel: 'Enfermaria A', observacao: 'Uso interno' },
    { id: 3, produtoId: 102, tipo: 'SAIDA', quantidade: 10, data: '2024-01-20T09:15:00', responsavel: 'UTI', observacao: 'Emergência' }
]);

export const MovimentacaoService = {
    getMovimentacoes() {
        // Enriquecer com dados do produto para listagem
        return Promise.resolve(movimentacoes.value.map(mov => {
            const produtos = ProdutoService.getProdutos().then(prods => { /* sync hack in mock */ }); 
            // Mock: Assumindo acesso síncrono para simplificar, em real seria join no backend
            // Vamos fazer o join na view ou aqui de forma simplificada
            return mov;
        }));
    },

    async getMovimentacoesComProdutos() {
        const produtos = await ProdutoService.getProdutos();
        return movimentacoes.value.map(mov => {
            const prod = produtos.find(p => p.id === mov.produtoId);
            return {
                ...mov,
                produtoNome: prod ? prod.nome : 'Desconhecido',
                produtoCodigo: prod ? prod.codigo : '---'
            };
        }).sort((a, b) => new Date(b.data) - new Date(a.data));
    },

    saveMovimentacao(movimentacao) {
        const newId = movimentacoes.value.length > 0 ? Math.max(...movimentacoes.value.map(m => m.id)) + 1 : 1;
        const novaMov = {
            ...movimentacao,
            id: newId,
            data: new Date().toISOString()
        };
        
        movimentacoes.value.unshift(novaMov);
        
        // Atualizar saldo do produto
        ProdutoService.updateEstoqueInternal(movimentacao.produtoId, movimentacao.quantidade, movimentacao.tipo);
        
        return Promise.resolve(novaMov);
    }
};
