<script setup>
import { FarmaciaService } from '@/service/FarmaciaService';
import { simulacaoService } from '@/service/SimulacaoService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const prescricao = ref(null);
const inventario = ref([]);
const loading = ref(true);
const saving = ref(false);

const lotesSelecionados = ref({}); // { medId: loteNumero }

onMounted(async () => {
    const id = route.params.id;
    // Try session service first
    prescricao.value = simulacaoService.getPrescricaoById(id) || await new FarmaciaService().getPrescricaoById(id);
    inventario.value = simulacaoService.getInventario();
    loading.value = false;
});

const getLotesForItem = (itemName) => {
    const med = inventario.value.find(m => m.nome.includes(itemName) || itemName.includes(m.nome));
    return med ? med.lotes : [];
};

const confirmarItem = (item) => {
    const lote = lotesSelecionados.value[item.nome];
    if (!lote) {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um lote para o medicamento', life: 3000 });
        return;
    }
    
    simulacaoService.dispensarMedicamento(prescricao.value.id, item.nome, lote, item.prescrito - item.dispensado);
    toast.add({ severity: 'success', summary: 'Item Conferido', detail: `${item.nome} dispensado com sucesso.`, life: 2000 });
};

const dispensarTotal = () => {
    saving.value = true;
    setTimeout(() => {
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Fluxo Assistencial Concluído! Estoque atualizado.', life: 4000 });
        router.push('/farmacia/prescricoes');
    }, 1000);
};

const goBack = () => router.push('/farmacia/prescricoes');
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="card p-4 border-l-4 border-primary sticky top-0 z-10 bg-surface-0 dark:bg-surface-900 shadow-md">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
                    <div>
                        <h1 class="text-xl font-bold m-0 italic">Dispensação de Medicamentos</h1>
                        <p class="text-sm text-muted-color m-0">Protocolo de segurança: Confirme item por item</p>
                    </div>
                </div>
                <Button label="Finalizar Dispensação" icon="pi pi-check" severity="success" @click="dispensarTotal" :loading="saving" />
            </div>
        </div>

        <div v-if="loading" class="flex justify-center p-8">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
        </div>

        <div v-else class="grid grid-cols-12 gap-6">
            <div class="col-span-12 lg:col-span-4">
                <div class="card">
                    <div class="font-bold text-lg mb-4 border-b pb-2">Dados do Paciente</div>
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-between">
                            <span class="text-muted-color font-bold uppercase text-xs">Paciente</span>
                            <span class="font-bold">{{ prescricao.pacienteNome }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-color font-bold uppercase text-xs">Leito</span>
                            <Tag :value="prescricao.leito" severity="info" />
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-color font-bold uppercase text-xs">Prescritor</span>
                            <span class="font-bold">{{ prescricao.medico }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-color font-bold uppercase text-xs">Data/Hora</span>
                            <span class="font-bold">{{ new Date(prescricao.dataHora).toLocaleString('pt-BR') }}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-surface-50 dark:bg-surface-800 border-dashed">
                    <div class="font-bold mb-3 flex items-center gap-2">
                        <i class="pi pi-info-circle text-primary"></i>
                        Informações de Segurança
                    </div>
                    <p class="text-sm m-0 italic">
                        Ao dispensar, verifique a validade do lote e se a dosagem corresponde exatamente ao prescrito.
                        Qualquer divergência, entre em contato com o médico responsável.
                    </p>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-8">
                <div class="card">
                    <div class="font-bold text-lg mb-4">Itens da Prescrição</div>
                    <DataTable :value="prescricao.itens" stripedRows>
                        <Column field="nome" header="Medicamento">
                            <template #body="slotProps">
                                <div class="font-bold">{{ slotProps.data.nome }}</div>
                                <div class="text-xs text-muted-color uppercase">{{ slotProps.data.via }} | {{ slotProps.data.frequencia }}</div>
                            </template>
                        </Column>
                        <Column field="dose" header="Dose"></Column>
                        <Column header="Progresso">
                            <template #body="slotProps">
                                <div class="flex flex-col gap-1">
                                    <div class="flex justify-between text-xs">
                                        <span>{{ slotProps.data.dispensado }} de {{ slotProps.data.prescrito }}</span>
                                        <span>{{ Math.round((slotProps.data.dispensado / slotProps.data.prescrito) * 100) }}%</span>
                                    </div>
                                    <ProgressBar :value="(slotProps.data.dispensado / slotProps.data.prescrito) * 100" :showValue="false" style="height: 0.5rem" />
                                </div>
                            </template>
                        </Column>
                        <Column header="Conferência">
                            <template #body="slotProps">
                                <div class="flex items-center gap-2">
                                    <template v-if="slotProps.data.dispensado < slotProps.data.prescrito">
                                        <Select v-model="lotesSelecionados[slotProps.data.nome]" :options="getLotesForItem(slotProps.data.nome)" optionLabel="numero" optionValue="numero" placeholder="Lote" class="w-32" />
                                        <Button icon="pi pi-check" severity="success" text rounded v-tooltip.top="'Confirmar'" @click="confirmarItem(slotProps.data)" />
                                    </template>
                                    <Tag v-else value="DISPENSADO" severity="success" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
