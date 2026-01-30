<script setup>
import { UserService } from '@/service/UserService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const userService = new UserService();
const toast = useToast();

const users = ref([]);
const loading = ref(true);
const userDialog = ref(false);
const user = ref({});
const submitted = ref(false);

const roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Médico', value: 'MEDICO' },
    { label: 'Enfermagem', value: 'ENFERMAGEM' },
    { label: 'Financeiro', value: 'FINANCEIRO' }
];

const statuses = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
];

onMounted(async () => {
    users.value = await userService.getUsers();
    loading.value = false;
});

const openNew = () => {
    user.value = { status: 'Ativo' };
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const saveUser = async () => {
    submitted.value = true;
    if (user.value.nome && user.value.email && user.value.role) {
        await userService.saveUser(user.value);
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário salvo com sucesso', life: 3000 });
        userDialog.value = false;
        user.value = {};
    }
};

const editUser = (u) => {
    user.value = { ...u };
    userDialog.value = true;
};

const getRoleSeverity = (role) => {
    switch (role) {
        case 'ADMIN': return 'danger';
        case 'MEDICO': return 'success';
        case 'ENFERMAGEM': return 'info';
        case 'FINANCEIRO': return 'warn';
        default: return 'secondary';
    }
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold m-0">Gestão de Usuários</h1>
            <Button label="Novo Usuário" icon="pi pi-plus" @click="openNew" />
        </div>

        <DataTable :value="users" :loading="loading" stripedRows responsiveLayout="scroll">
            <template #empty> Nenhum usuário encontrado. </template>
            <Column field="nome" header="Nome" sortable style="min-width: 12rem"></Column>
            <Column field="email" header="Email" sortable style="min-width: 12rem"></Column>
            <Column field="role" header="Perfil" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.role" :severity="getRoleSeverity(slotProps.data.role)" />
                </template>
            </Column>
            <Column field="status" header="Status" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="slotProps.data.status === 'Ativo' ? 'success' : 'danger'" />
                </template>
            </Column>
            <Column header="Ações" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded severity="success" class="mr-2" @click="editUser(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="Detalhes do Usuário" :modal="true">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name" class="font-bold">Nome</label>
                    <InputText id="name" v-model.trim="user.nome" required="true" autofocus :class="{ 'p-invalid': submitted && !user.nome }" />
                    <small v-if="submitted && !user.nome" class="p-error">Nome é obrigatório.</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email" class="font-bold">Email</label>
                    <InputText id="email" v-model.trim="user.email" required="true" :class="{ 'p-invalid': submitted && !user.email }" />
                    <small v-if="submitted && !user.email" class="p-error">Email é obrigatório.</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="role" class="font-bold">Perfil</label>
                    <Select id="role" v-model="user.role" :options="roles" optionLabel="label" optionValue="value" placeholder="Selecione um Perfil" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="status" class="font-bold">Status</label>
                    <Select id="status" v-model="user.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Selecione um Status" class="w-full" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Salvar" icon="pi pi-check" @click="saveUser" />
            </template>
        </Dialog>
    </div>
</template>
