<script setup>
import MovimentacaoForm from '@/components/almoxarifado/MovimentacaoForm.vue';
import MovimentacaoTable from '@/components/almoxarifado/MovimentacaoTable.vue';
import { MovimentacaoService } from '@/service/almoxarifado/movimentacao.mock';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();

const movimentacoes = ref([]);
const movDialog = ref(false);
const novaMovimentacao = ref({ tipo: 'SAIDA', quantidade: 1, data: new Date() });
const loading = ref(true);

onMounted(() => {
    loadMovimentacoes();
});

const loadMovimentacoes = async () => {
    loading.value = true;
    movimentacoes.value = await MovimentacaoService.getMovimentacoesComProdutos();
    loading.value = false;
};

const openNew = () => {
    novaMovimentacao.value = { tipo: 'SAIDA', quantidade: 1, data: new Date() };
    movDialog.value = true;
};

const hideDialog = () => {
    movDialog.value = false;
};

const saveMovimentacao = async (mov) => {
    await MovimentacaoService.saveMovimentacao(mov);
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação registrada', life: 3000 });
    movDialog.value = false;
    loadMovimentacoes();
};
</script>

<template>
    <div class="card">
        <Toolbar class="mb-4">
            <template #start>
                <Button label="Registrar Movimentação" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </template>
        </Toolbar>

        <MovimentacaoTable 
            :movimentacoes="movimentacoes" 
            :loading="loading"
        />

        <Dialog v-model:visible="movDialog" :style="{ width: '550px' }" header="Nova Movimentação" :modal="true" class="p-fluid">
            <MovimentacaoForm 
                v-model="novaMovimentacao" 
                @save="saveMovimentacao" 
                @cancel="hideDialog" 
            />
        </Dialog>
    </div>
</template>
