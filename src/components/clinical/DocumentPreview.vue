<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    visible: Boolean,
    documentData: Object
});

const emit = defineEmits(['update:visible']);

const close = () => {
    emit('update:visible', false);
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="close" modal header="Visualização de Documento" :style="{ width: '800px' }">
        <div class="document-container p-8 bg-white text-black font-serif shadow-inner border mx-auto" style="min-height: 800px; max-width: 210mm;">
            <!-- Hospital Header -->
            <div class="flex justify-between items-center border-b-2 border-black pb-4 mb-8">
                <div class="flex items-center gap-4">
                    <i class="pi pi-plus-circle text-4xl text-red-600"></i>
                    <div>
                        <div class="text-2xl font-bold uppercase">HospNaz</div>
                        <div class="text-sm">Gestão Hospitalar Avançada</div>
                    </div>
                </div>
                <div class="text-right text-sm">
                    <div>CNPJ: 00.000.000/0001-00</div>
                    <div>Av. Saúde, 123 - Centro</div>
                    <div>Tel: (11) 4002-8922</div>
                </div>
            </div>

            <!-- Document Title -->
            <div class="text-center text-3xl font-bold underline mb-10 uppercase">
                {{ documentData?.tipo || 'Documento Clínico' }}
            </div>

            <!-- Patient Info -->
            <div class="grid grid-cols-2 gap-4 mb-8 p-4 border border-gray-300 rounded bg-gray-50">
                <div>
                    <span class="font-bold">PACIENTE:</span> {{ documentData?.pacienteNome || 'MARIA SILVA' }}
                </div>
                <div>
                    <span class="font-bold">DATA:</span> {{ new Date(documentData?.dataHora || Date.now()).toLocaleDateString('pt-BR') }}
                </div>
                <div>
                    <span class="font-bold">PRONTUÁRIO:</span> #{{ documentData?.pepId || '001' }}
                </div>
                <div>
                    <span class="font-bold">CPF:</span> 123.456.789-00
                </div>
            </div>

            <!-- Main Content -->
            <div class="content text-lg leading-relaxed mb-20 whitespace-pre-wrap min-h-[400px]">
                {{ documentData?.conteudo || 'Nenhum conteúdo disponível para este documento.' }}
            </div>

            <!-- Signature Line -->
            <div class="mt-20 flex flex-col items-center">
                <div class="w-64 border-t border-black mb-2"></div>
                <div class="font-bold">{{ documentData?.profissionalNome || 'Dr. Ricardo Santos' }}</div>
                <div class="text-sm">CRM: 12345-SP</div>
            </div>

            <!-- Footer -->
            <div class="mt-20 pt-4 border-t border-gray-200 text-xs text-center text-gray-500 italic">
                Este documento é uma representação visual para fins de validação de fluxo e não possui validade jurídica fora do ambiente de teste.
            </div>
        </div>

        <template #footer>
            <Button label="Fechar" icon="pi pi-times" @click="close" text />
            <Button label="Imprimir (Simulação)" icon="pi pi-print" severity="secondary" @click="() => {}" />
        </template>
    </Dialog>
</template>

<style scoped>
.document-container {
    background-color: white !important;
    color: black !important;
}
</style>
