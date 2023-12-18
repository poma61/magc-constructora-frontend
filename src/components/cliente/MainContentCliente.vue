<template>
    <div class="d-flex">
        <div class="d-flex flex-column">
            <v-tooltip text="Actualizar tablero">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3" variant="elevated" class="ma-1" @click="isDataTable()"
                        icon="mdi-table-refresh" />
                </template>
            </v-tooltip>
            <v-tooltip text="Nuevo cliente">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3" variant="elevated" class="ma-1" @click="newForm"
                        icon="mdi-text-box-plus-outline" />
                </template>
            </v-tooltip>
        </div>

        <v-card class="my-2 flex-grow-1">
            <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                color="amber-darken-3" />
            <v-data-table :hover="true" :items="data" :headers="columns" :search="search_data" :loading="loading_data_table"
                :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true"
                :height="650" :sort-by="[{ key: 'id', order: 'desc' }]">
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn color="purple-darken-1" v-bind="props" class="ma-2">
                                <v-icon icon="mdi-dots-horizontal" />
                            </v-btn>
                        </template>
                        <v-list bg-color="purple-lighten-5">
                            <v-list-item @click="editForm(item)">
                                <v-list-item-title>
                                    <v-icon icon="mdi-pencil" color="purple-darken-1"></v-icon>&nbsp;Editar
                                </v-list-item-title>

                            </v-list-item>
                            <v-list-item @click="openDeleteData(item)">
                                <v-list-item-title>
                                    <v-icon icon="mdi-delete" color="red"></v-icon>&nbsp;Eliminar
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                </template>

            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog_form" persistent transition="dialog-bottom-transition" max-width="900px" scrollable>
            <FormCliente :p_item_cliente="item_cliente" @toCloseForm="closeForm" @toUpdateDataTable="updateDataTable" />
        </v-dialog>

    </div>
    <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
        <v-card class="px-5 py-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
                <p class="text-h6">
                    ¿Esta seguro(a) de eliminar este registro?
                </p>

            </v-card-text>
            <v-card-actions>
                <div class="d-flex justify-center" style="width: 100%;">
                    <v-btn color="red" variant="elevated" @click="closeDeleteData" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="purple-darken-1" variant="elevated" class="ma-1" @click="confirmDeleteData()">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormCliente from '@/components/cliente/FormCliente.vue';
import Cliente from '@/http/services/Cliente';
import { onMounted } from 'vue';
import { ref } from 'vue';
import useToastify from '@/composables/useToastify';

const index_data_item = ref(-1);
const dialog_delete = ref(false);
const dialog_form = ref(false);
const item_cliente = ref({});
const search_data = ref("");
const loading_data_table = ref(null);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: 100, title: '100' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres', },
    { title: 'Apellido paterno', key: 'apellido_paterno' },
    { title: 'Apellido materno', key: 'apellido_materno' },
    { title: 'N° de contacto', key: 'n_de_contacto' },
    { title: 'Correo Electronico', key: 'correo_electronico' },
    { title: 'CI', key: 'ci_concat', value: (item) => `${item.ci} ${item.ci_expedido}` },
    { title: 'Direccion', key: 'direccion',},
    { title: 'Descripcion', key: 'descripcion',},
    { title: 'Acciones', key: 'actions', },
]);
const data = ref([]);
//methods
const isDataTable = () => {
    const cliente = new Cliente();
    loading_data_table.value = 'amber-darken-3';
    setTimeout(async () => {
        const response = await cliente.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            useToastify('danger', response.message);
        }
    }, 600);
}//isDataTable

const clear = () => {
    item_cliente.value = {};
    index_data_item.value = -1;
}

const openDeleteData = (item) => {
    item_cliente.value = Object.assign({}, item);
    index_data_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}

const closeDeleteData = () => {
    clear();
    dialog_delete.value = false;
}
const closeForm = () => {
    clear();
    dialog_form.value = false;
}

const confirmDeleteData = async () => {
    const cliente = new Cliente(Object.assign({}, item_cliente.value));
    const response = await cliente.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message)
    }
    closeDeleteData();
}


const newForm = () => {
    const cliente = new Cliente();
    item_cliente.value = Object.assign({}, cliente.getAttributes());
    dialog_form.value = true;
}

const editForm = (item) => {
    item_cliente.value = Object.assign({}, item);
    index_data_item.value = data.value.indexOf(item);
    dialog_form.value = true;
}

const updateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            break;
        case 'edit':
            Object.assign(data.value[index_data_item.value], item);
            break;

        default:
            useToastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }

}

onMounted(async () => {
    isDataTable();
});
</script>
