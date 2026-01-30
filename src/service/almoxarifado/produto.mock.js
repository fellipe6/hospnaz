
import { ref } from 'vue';

// Estado simulado global para persistência durante a sessão
const produtos = ref([
    { id: 101, codigo: 'MED001', nome: 'Dipirona 500mg', categoria: 'Medicamentos', unidade: 'cx', estoqueAtual: 150, estoqueMinimo: 50, fornecedorId: 2, status: 'NORMAL' },
    { id: 102, codigo: 'MED002', nome: 'Paracetamol 750mg', categoria: 'Medicamentos', unidade: 'cx', estoqueAtual: 30, estoqueMinimo: 60, fornecedorId: 2, status: 'BAIXO' },
    { id: 103, codigo: 'MAT001', nome: 'Luva Látex M', categoria: 'Material Hospitalar', unidade: 'cx', estoqueAtual: 500, estoqueMinimo: 100, fornecedorId: 4, status: 'NORMAL' },
    { id: 104, codigo: 'MAT002', nome: 'Seringa 5ml', categoria: 'Material Hospitalar', unidade: 'un', estoqueAtual: 80, estoqueMinimo: 200, fornecedorId: 4, status: 'CRITICO' },
    { id: 105, codigo: 'EQU001', nome: 'Termômetro Digital', categoria: 'Equipamentos', unidade: 'un', estoqueAtual: 15, estoqueMinimo: 10, fornecedorId: 3, status: 'NORMAL' }
]);

export const ProdutoService = {
    getProdutos() {
        return Promise.resolve(produtos.value);
    },

    getProdutosBaixoEstoque() {
        return Promise.resolve(produtos.value.filter(p => p.estoqueAtual <= p.estoqueMinimo));
    },

    saveProduto(produto) {
        if (produto.id) {
            const index = produtos.value.findIndex(p => p.id === produto.id);
            if (index !== -1) {
                produtos.value[index] = { ...produto, status: this.calculateStatus(produto) };
            }
        } else {
            const newId = Math.max(...produtos.value.map(p => p.id)) + 1;
            produtos.value.push({ ...produto, id: newId, status: this.calculateStatus(produto) });
        }
        return Promise.resolve(produto);
    },
    
    deleteProduto(id) {
        produtos.value = produtos.value.filter(p => p.id !== id);
        return Promise.resolve();
    },

    calculateStatus(produto) {
        if (produto.estoqueAtual === 0) return 'ZERADO';
        if (produto.estoqueAtual <= produto.estoqueMinimo) return 'BAIXO';
        if (produto.estoqueAtual <= produto.estoqueMinimo * 1.2) return 'ALERTA';
        return 'NORMAL';
    },

    //chamada interna para atualizar estoque vindo de movimentações
    updateEstoqueInternal(produtoId, quantidade, tipo) {
        const produto = produtos.value.find(p => p.id === produtoId);
        if (produto) {
            if (tipo === 'ENTRADA') {
                produto.estoqueAtual += parseInt(quantidade);
            } else {
                produto.estoqueAtual -= parseInt(quantidade);
            }
            produto.status = this.calculateStatus(produto);
        }
    }
};
