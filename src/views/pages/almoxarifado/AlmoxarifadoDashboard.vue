<script setup>
import { MovimentacaoService } from '@/service/almoxarifado/movimentacao.mock';
import { ProdutoService } from '@/service/almoxarifado/produto.mock';
import { onMounted, ref } from 'vue';

const totalProdutos = ref(0);
const produtosBaixoEstoque = ref(0);
const entradasMes = ref(0);
const saidasMes = ref(0);
const recentActivity = ref([]);

onMounted(async () => {
    // Carregar dados de produtos
    const produtos = await ProdutoService.getProdutos();
    totalProdutos.value = produtos.length;
    produtosBaixoEstoque.value = produtos.filter(p => p.estoqueAtual <= p.estoqueMinimo).length;

    // Carregar movimentações
    const movimentacoes = await MovimentacaoService.getMovimentacoesComProdutos();
    
    // Filtrar mês atual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const movsMes = movimentacoes.filter(m => {
        const d = new Date(m.data);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    entradasMes.value = movsMes.filter(m => m.tipo === 'ENTRADA').reduce((acc, curr) => acc + curr.quantidade, 0);
    saidasMes.value = movsMes.filter(m => m.tipo === 'SAIDA').reduce((acc, curr) => acc + curr.quantidade, 0);

    // Últimas 5 movimentações
    recentActivity.value = movimentacoes.slice(0, 5);
});
</script>

<template>
    <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Total Produtos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalProdutos }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-box text-blue-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Baixo Estoque</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ produtosBaixoEstoque }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-exclamation-triangle text-orange-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Entradas (Mês)</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ entradasMes }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-arrow-down text-green-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Saídas (Mês)</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ saidasMes }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-arrow-up text-red-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h5 class="mb-4">Atividade Recente</h5>
                <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                    <li v-for="item in recentActivity" :key="item.id" class="flex items-center py-2 border-b border-surface-200 dark:border-surface-700">
                        <div class="w-12 h-12 flex items-center justify-center rounded-full mr-4 shrink-0" 
                             :class="item.tipo === 'ENTRADA' ? 'bg-green-100 dark:bg-green-400/10' : 'bg-red-100 dark:bg-red-400/10'">
                            <i class="pi !text-xl" :class="item.tipo === 'ENTRADA' ? 'pi-arrow-down text-green-500' : 'pi-arrow-up text-red-500'"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal truncate block">{{ item.produtoNome }}</span>
                        <div class="ml-auto flex items-center">
                            <span class="leading-normal p-2 rounded" :class="item.tipo === 'ENTRADA' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
                                {{ item.tipo === 'ENTRADA' ? '+' : '-' }}{{ item.quantidade }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="flex justify-between items-center mb-4">
                    <h5>Ações Rápidas</h5>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <Button label="Nova Entrada" icon="pi pi-plus" class="w-full p-4" severity="success" outlined @click="$router.push('/pages/almoxarifado/movimentacoes')" />
                    </div>
                    <div class="col-span-6">
                        <Button label="Nova Saída" icon="pi pi-minus" class="w-full p-4" severity="danger" outlined @click="$router.push('/pages/almoxarifado/movimentacoes')" />
                    </div>
                    <div class="col-span-12">
                         <Button label="Ver Produtos com Estoque Baixo" icon="pi pi-exclamation-triangle" class="w-full p-4" severity="warning" outlined @click="$router.push('/pages/almoxarifado/estoque-minimo')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
