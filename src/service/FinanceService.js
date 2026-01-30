import { FornecedorService } from './almoxarifado/fornecedor.mock';
import { ProdutoService } from './almoxarifado/produto.mock';
import { CentrosCustoMock } from './mock/centrosCusto.mock';
import { ContasPagarMock } from './mock/contasPagar.mock';
import { LancamentosFinanceirosMock } from './mock/lancamentosFinanceiros.mock';

export const FinanceService = {
    getCentrosCusto() {
        return Promise.resolve(CentrosCustoMock);
    },

    async getContasPagar() {
        const fornecedores = await FornecedorService.getFornecedoresData();
        const produtos = await ProdutoService.getProdutos();
        
        return ContasPagarMock.map(conta => ({
            ...conta,
            fornecedorNome: fornecedores.find(f => f.id === conta.fornecedorId)?.nome || 'Desconhecido',
            produtoNome: produtos.find(p => p.id === conta.produtoId)?.nome || 'Desconhecido'
        }));
    },

    async getLancamentos() {
        const produtos = await ProdutoService.getProdutos();
        const centros = CentrosCustoMock;
        
        return LancamentosFinanceirosMock.map(lan => ({
            ...lan,
            centroCustoNome: centros.find(c => c.id === lan.centroCustoId)?.nome || 'Geral',
            produtoNome: lan.produtoId ? (produtos.find(p => p.id === lan.produtoId)?.nome || 'Desconhecido') : '---'
        }));
    },

    async getDashboardStats() {
        const lancamentos = await this.getLancamentos();
        const contas = await this.getContasPagar();
        const produtos = await ProdutoService.getProdutos();

        const totalDespesas = lancamentos.reduce((acc, curr) => acc + curr.valor, 0);
        const valorEstoque = produtos.reduce((acc, curr) => acc + (curr.estoqueAtual * 10), 0); // Mock: preço fixo 10 para exemplo
        
        // Custo por setor (centro de custo)
        const custoPorSetor = CentrosCustoMock.map(centro => {
            const valor = lancamentos
                .filter(l => l.centroCustoId === centro.id)
                .reduce((acc, curr) => acc + curr.valor, 0);
            return { label: centro.nome, value: valor };
        });

        return {
            totalDespesas,
            valorEstoque,
            custoPorSetor,
            contasPendentes: contas.filter(c => c.status === 'Pendente').length,
            totalContasPagar: contas.reduce((acc, curr) => acc + curr.valorTotal, 0)
        };
    }
};
