<template>
    <div class="d-flex flex-wrap justify-end" style="width: 100%;">

        <v-tooltip text="Actualizar tablero">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="initDataTable()" color="cyan-darken-1" class=" ma-1" variant="tonal" >
                    <v-icon icon="mdi-refresh"></v-icon>&nbsp;
                </v-btn>
            </template>
        </v-tooltip>

        <v-btn @click="showDataTable()" color="cyan-darken-1" class=" ma-1"
            :variant="show_data_table == true ? 'elevated' : 'tonal'">
            <v-icon icon="mdi-table-large"></v-icon>&nbsp;Ver tablero
        </v-btn>
        <v-btn @click="newForm()" color="cyan-darken-1" class="ma-1" :variant="show_form == true ? 'elevated' : 'tonal'"
            :disabled="edit_form">
            <v-icon icon="mdi-note-plus-outline"></v-icon>&nbsp;Nuevo contrato
        </v-btn>
    </div>


    <div v-if="show_data_table" class="my-4">
        <!-- table -->
        <v-card class="animate__animated animate__bounceInUp">
            <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                color="cyan-darken-1" />
            <v-data-table :hover="true" :items="data" :headers="columns" :search="search_data" :loading="loading_data_table"
                :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true"
                :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">

                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
                </template>

                <template v-slot:item.fecha_firma_contrato="{ item }">
                    <v-chip color="primary" variant="elevated" label>
                        {{ date_format.dateOnlyFormatter(item.fecha_firma_contrato) }}
                    </v-chip>
                </template>

                <template v-slot:item.archivo_pdf="{ item }">
                    <v-btn @click="viewPDF(item)" color="yellow-darken-3" icon="mdi-file-pdf-box" class="ma-1 "
                        variant="tonal" />
                </template>

                <template v-slot:item.actions="{ item }">
                    <div style="width: 150px;">
                        <v-btn @click="editForm(item)" color="cyan-darken-1" icon="mdi-pencil" class="ma-1 "
                            variant="tonal" />
                        <v-btn @click="openDeleteData(item)" color="red" icon="mdi-delete" class="ma-1 " variant="tonal" />
                    </div>
                </template>

            </v-data-table>
        </v-card>
    </div>
    <FormContrato v-if="show_form" :p_item_contrato="item_contrato" :p_item_detalle_contrato="item_detalle_contrato"
        @toNewForm="newForm" @toLocalUpdateDataTable="localUpdateDataTable" />


    <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
        <v-card class="card">
            <v-card-text class="text-center">
                <v-icon icon="mdi-file-question" color="warning" size="100"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
                <p class="text-h6 text-center">
                    ¿Esta seguro(a) de eliminar el registro seleccionado?
                </p>
            </v-card-text>
            <v-card-actions>
                <div class="d-flex justify-center" style="width: 100%;">
                    <v-btn color="red" @click="closeDialogDelete()" class="ma-1 " variant="elevated">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="cyan-darken-1" @click="confirmDeleteData()" class="ma-1 " variant="elevated">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>

        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_pdf" persistent transition="dialog-bottom-transition" max-width="900px" max-height="90vh"
        scrollable>
        <v-card>
            <v-card-text>
                <div class="content-pdf">
                    <embed :src="contrato_pdf_url" type="application/pdf" class="embed__pdf">
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="yellow-darken-3" @click="closeDialogPDF()" variant="elevated">
                    <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cerrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-overlay v-model="loading_edit_form" class="d-flex align-center justify-center">
        <div class="text-center">
            <v-progress-circular color="yellow-darken-3" indeterminate size="100"></v-progress-circular>
            <p class="text-h6 text-white">Cargando datos...</p>
        </div>
    </v-overlay>
</template>

<script setup>
import FormContrato from '@/components/contrato/FormContrato.vue';
import { ref, onMounted } from 'vue';
import Contrato from '@/http/services/Contrato';
import FormatDate from '@/util/FormatDate';
import app from "@/config/app.js";
import useToastify from '@/composables/useToastify';

//data
const data = ref([]);
const search_data = ref("");
const loading_data_table = ref(null);
const show_form = ref(false);
const show_data_table = ref(true);
const item_contrato = ref({});
const item_detalle_contrato = ref({});
const date_format = ref(new FormatDate());
const dialog_delete = ref(false);
const index_array = ref(-1);
const edit_form = ref(false);
const dialog_pdf = ref(false);
const contrato_pdf_url = ref("");
const loading_edit_form = ref(false);

const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: 100, title: '100' },
]);
const columns = ref([
    { title: 'Nombres cliente', key: 'name', value: (item) => { return ` ${item.nombres} ${item.apellido_materno} ${item.apellido_paterno}` } },
    { title: 'N° de contrato', key: 'n_contrato' },
    { title: 'Fecha de firma', key: 'fecha_firma_contrato' },
    { title: 'Descripcion', key: 'descripcion' },
    { title: 'Contrato PDF', key: 'archivo_pdf' },
    { title: 'Acciones', key: 'actions' },
]);

//methods
const isClear = () => {
    index_array.value = -1;
    edit_form.value = false;
    item_contrato.value = {};
    item_detalle_contrato.value = {};
}


const newForm = () => {
    const contrato = new Contrato();
    item_contrato.value = Object.assign({}, contrato.getAttributes('contrato'));
    item_detalle_contrato.value = Object.assign({}, contrato.getAttributes('detalle-contrato'));
    showForm();
}
const editForm = (item) => {
    loading_edit_form.value = true;
    setTimeout(async () => {
        index_array.value = data.value.indexOf(item);
        item_contrato.value = Object.assign({}, item);
        edit_form.value = true
        const detalle_contrato = new Contrato();
        const response = await detalle_contrato.showDetalleContrato(item_contrato.value.id);
        loading_edit_form.value = false;

        if (response.status) {
            item_detalle_contrato.value = Object.assign({}, response.record);
            showForm();
        } else {
            useToastify('error', response.message);
        }
    }, 200);

}

const openDeleteData = (item) => {
    index_array.value = data.value.indexOf(item);
    item_contrato.value = Object.assign({}, item);
    dialog_delete.value = true;
}

const viewPDF = (item) => {
    dialog_pdf.value = true;
    contrato_pdf_url.value = `${app.BASE_URL}/${item.archivo_pdf}`;
}

const closeDialogPDF = () => {
    dialog_pdf.value = false;
    //para evitar que el contenido se distorcione cuando no haya archivo
    // al cerrar el dialog
    setTimeout(() => {
        contrato_pdf_url.value = "";
    }, 400)
};

const confirmDeleteData = async () => {
    const contrato = new Contrato();
    contrato.setAttributes('contrato', item_contrato.value);
    const response = await contrato.destroy();
    if (response.status) {
        data.value.splice(index_array.value, 1)
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message);
    }
    closeDialogDelete();
}

const closeDialogDelete = () => {
    dialog_delete.value = false;
    isClear();
}

const showForm = () => {
    show_form.value = true;
    show_data_table.value = false;
}

const showDataTable = () => {
    show_data_table.value = true;
    show_form.value = false;
    isClear();//para limpiar datos del forumlario al visualizar la tabla
}


const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            console.log("nuevo");
            break;
        case 'edit':
            Object.assign(data.value[index_array.value], item);
            console.log("editado");
            break;
        default:
            useToastify('danger', 'No se encontro ningun tipo para actualizar el tablero');
            break;
    }
}
const initDataTable = () => {
    loading_data_table.value = 'cyan-darken-1';
    setTimeout(async () => {
        const contrato = new Contrato();
        const response = await contrato.index();
        loading_data_table.value = null;

        if (response.status) {
            data.value = response.records;
        } else {
            useToastify('danger', response.message);
        }
    }, 400);
}

onMounted(() => {
    showDataTable();
    initDataTable();
});

</script>
