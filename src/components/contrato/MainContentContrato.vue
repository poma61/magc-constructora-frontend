<template>
    <div class="animate__animated animate__fadeInLeft" v-if="v_select_desarrolladora_enable">
        <v-select label="Desarrolladoras" v-model="selected_desarrolladora" :items="list_desarrolladora"
            color="purple-darken-1" @update:model-value="loadDataTable" />
    </div>
    <div class="animate__animated animate__fadeInLeft my-6" v-else>
        <div class="d-flex">
            <p class="px-1 text-h6"> Desarrolladora: </p>
            <p class="px-1 text-h6 text-secondary">{{ selected_desarrolladora }}</p>
        </div>
        <v-divider class="border-opacity-25 my-2"></v-divider>
    </div>

    <div class="animate__animated animate__fadeInLeft d-flex flex-wrap" style="width: 100%;">
        <v-tooltip text="Actualizar tablero">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="loadDataTable()" color="primary" class=" ma-1" variant="tonal">
                    <v-icon icon="mdi-refresh"></v-icon>&nbsp;
                </v-btn>
            </template>
        </v-tooltip>

        <v-btn @click="showDataTable()" color="primary" class=" ma-1"
            :variant="show_data_table == true ? 'elevated' : 'tonal'">
            <v-icon icon="mdi-table-large"></v-icon>&nbsp;Ver tablero
        </v-btn>

        <v-btn @click="newForm()" color="primary" class="ma-1" :variant="show_form == true ? 'elevated' : 'tonal'">
            <v-icon icon="mdi-note-plus-outline"></v-icon>&nbsp;Nuevo contrato
        </v-btn>
    </div>

    <div v-if="show_data_table" class="my-4">
        <!-- table  item-value="id" es para elegir la clave unica para cada fila de la tabla  -->
        <v-card class="animate__animated animate__fadeInLeft">
            <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                color="primary" />
            <v-data-table :hover="true" :headers="columns" :items="data" item-value="id_clientes_has_contratos"
                :search="search_data" :loading="loading_data_table" :items-per-page-options="items_per_page_options"
                :show-current-page="true" :fixed-header="true" :height="550"
                :sort-by="[{ key: 'id_clientes_has_contratos', order: 'desc' }]">
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
                </template>

                <template v-slot:item.fecha_firma_contrato="{ item }">
                    <v-chip color="primary" variant="elevated" label>
                        {{ date_format.dateOnlyFormatter(item.fecha_firma_contrato) }}
                    </v-chip>
                </template>

                <template v-slot:item.descripcion="{ item }">
                    <p class="text-warning" v-if="item.descripcion == null || item.descripcion == ''">
                        Sin descripcion!
                    </p>
                    <p v-else>
                        {{ item.descripcion }}
                    </p>
                </template>

                <template v-slot:item.archivo_pdf="{ item }">
                    <v-btn @click="viewPDF(item)" color="yellow-darken-3" icon="mdi-file-pdf-box" class="ma-1 "
                        variant="tonal" />
                </template>

                <template v-slot:item.actions="{ item }">
                    <div style="width: 150px;">
                        <v-btn @click="editForm(item)" color="primary" icon="mdi-pencil" class="ma-1 " variant="tonal" />
                        <v-btn @click="openDeleteData(item)" color="red" icon="mdi-delete" class="ma-1 " variant="tonal" />
                    </div>
                </template>

            </v-data-table>
        </v-card>
    </div>
    <FormContrato v-if="show_form" :p_item_contrato="item_contrato" :p_item_detalle_contrato="item_detalle_contrato"
        :p_selected_desarrolladora="selected_desarrolladora" @toNewForm="newForm"
        @toLocalUpdateDataTable="localUpdateDataTable" />


    <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
        <v-card class="pa-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi-trash-can-outline" color="warning" size="100"
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
                    <v-btn color="primary" @click="confirmDeleteData()" class="ma-1 " variant="elevated">
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
                <div class="d-flex flex-wrap" >
                    <v-btn color="primary" @click="updatePDF()" variant="elevated">
                        <v-icon icon="mdi-refresh"></v-icon>&nbsp;Actualizar contrato
                    </v-btn>
                    <v-btn color="yellow-darken-3" @click="closeDialogPDF()" variant="elevated">
                        <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cerrar
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-overlay v-model="loading_update_pdf" class="d-flex align-center justify-center">
        <div class="text-center">
            <v-progress-circular color="yellow-darken-3" indeterminate size="100"></v-progress-circular>
            <p class="text-h6 text-white">Actualizando contrato...</p>
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
import useUserByDesarrolladora from '@/composables/useUserByDesarrolladora';
import Desarrolladora from '@/http/services/Desarrolladora';
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
const index_item = ref([-1, -1]);
const dialog_pdf = ref(false);
const contrato_pdf_url = ref("");
const list_desarrolladora = ref([]);
const selected_desarrolladora = ref("");
const loading_update_pdf = ref(false);
const v_select_desarrolladora_enable = ref(true);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const columns = ref([
    { title: 'Nombres cliente', key: 'name', value: (item) => { return ` ${item.nombres} ${item.apellido_paterno} ${item.apellido_materno}` } },
    { title: 'C.I.', key: 'ci', value: (item) => { return ` ${item.ci} ${item.ci_expedido} ` } },
    { title: 'N° de contrato', key: 'n_contrato' },
    { title: 'Fecha de firma', key: 'fecha_firma_contrato' },
    { title: 'Descripcion', key: 'descripcion' },
    { title: 'Contrato PDF', key: 'archivo_pdf' },
    { title: 'Acciones', key: 'actions' },
]);

//methods
const clear = () => {
    index_item.value[0] = -1;
    index_item.value[1] = -1;
    item_contrato.value = {};
    item_detalle_contrato.value = {};
}

const listDesarrolladora = async () => {
    const desarrolladora = new Desarrolladora();
    const response = await desarrolladora.index();
    if (response.status) {
        const all_desarrolladora = response.records;
        list_desarrolladora.value = all_desarrolladora.map(item => item.nombres);

    } else {
        useToastify('danger', response.message);
    }
}

const newForm = () => {
    const contrato = new Contrato();
    item_contrato.value = Object.assign({}, contrato.getAttributes('contrato'));
    showForm();
}
const editForm = (item) => {
    //reduce se utiliza para iterar sobre el array data.value.
    //En cada iteración, verifica si la propiedad archivo_pdf del objeto actual coincide con archivoPDFItem.
    //Si la condición se cumple, agrega el índice actual al array acc.
    //Al final, reduce devuelve el array acc que contiene los índices de los objetos que cumplen con la condición.
    //hacemos todo esto porque un cliente o  dos clientes firmen 1 contrato, por lo tanto debemos almacenar los index_item
    let indices_para_actualizar = data.value.reduce((acc, obj, index) => {
        // Obtener los índices de los objetos que cumplen con la condición
        if (obj.archivo_pdf == item.archivo_pdf) {
            acc.push(index);
        }
        return acc;
    }, []);
    index_item.value = indices_para_actualizar;

    item_contrato.value = Object.assign({}, item);
    showForm();
}

const openDeleteData = (item) => {
    index_item.value[0] = data.value.indexOf(item);
    item_contrato.value = Object.assign({}, item);
    dialog_delete.value = true;
}

const viewPDF = (item) => {
    //reduce se utiliza para iterar sobre el array data.value.
    //En cada iteración, verifica si la propiedad archivo_pdf del objeto actual coincide con archivoPDFItem.
    //Si la condición se cumple, agrega el índice actual al array acc.
    //Al final, reduce devuelve el array acc que contiene los índices de los objetos que cumplen con la condición.
    let indices_para_actualizar_pdf = data.value.reduce((acc, obj, index) => {
        // Obtener los índices de los objetos que cumplen con la condición
        //hacemos esto porque mas de 1 cliente firman un contrato +//por lo tanto debemos almacenar en un array los
        //indices del array data
        if (obj.archivo_pdf == item.archivo_pdf) {
            acc.push(index);
        }
        return acc;
    }, []);
    index_item.value = indices_para_actualizar_pdf;
    item_contrato.value = Object.assign({}, item);
    contrato_pdf_url.value = `${app.BASE_URL}/${item_contrato.value.archivo_pdf}`;
    dialog_pdf.value = true;
}
const closeDialogPDF = () => {
    dialog_pdf.value = false;
    //para evitar que el contenido se distorcione cuando no haya archivo
    // al cerrar el dialog
    setTimeout(() => {
        contrato_pdf_url.value = "";
    }, 400);
    clear();
};

const updatePDF = () => {
    const contrato = new Contrato();
    contrato.setAttributes('contrato', item_contrato.value);
    dialog_pdf.value = false;
    loading_update_pdf.value = true;
    setTimeout(async () => {
        const response = await contrato.updatePdfFile();
        loading_update_pdf.value = false;
        dialog_pdf.value = true;
        if (response.status) {
            //actualizamos solo el path del pdf nada mas 
            //Hacemos un for porque posiblemente mas de 1 cliente firme el contrato
            //en la respuesta del backend devolera un array segun cuantos clientes firman un contrato
            for (let i = 0; i < index_item.value.length; i++) {
                Object.assign(data.value[index_item.value[i]], { archivo_pdf: response.record.archivo_pdf });
            }
            contrato_pdf_url.value = `${app.BASE_URL}/${response.record.archivo_pdf}`;
            dialog_pdf.value = true;

            useToastify('success', response.message);
        } else {
            useToastify('danger', response.message);
        }
    }, 100);
}

const confirmDeleteData = async () => {
    const contrato = new Contrato();
    contrato.setAttributes('contrato', item_contrato.value);
    const response = await contrato.destroy();
    if (response.status) {
        data.value.splice(index_item.value[0], 1)
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message);
    }
    closeDialogDelete();
}

const closeDialogDelete = () => {
    dialog_delete.value = false;
    clear();
}

const showForm = () => {
    show_form.value = true;
    show_data_table.value = false;
}

const showDataTable = () => {
    show_data_table.value = true;
    show_form.value = false;
    clear();//para limpiar datos del formulario al visualizar la tabla
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            item.forEach(obj => {
                data.value.push(Object.assign({}, obj));
            });
            break;

        case 'edit':
            const update_required_attributes = {
                archivo_pdf: item[0].archivo_pdf,
                descripcion: item[0].descripcion,
                fecha_firma_contrato: item[0].fecha_firma_contrato,
            }

            for (let i = 0; i < item.length; i++) {
                Object.assign(data.value[index_item.value[i]], update_required_attributes);
            }
            break;
        default:
            useToastify('danger', 'No se encontro ningun tipo para actualizar el tablero');
            break;
    }
}

const loadDataTable = () => {
    loading_data_table.value = 'primary';
    setTimeout(async () => {
        const contrato = new Contrato(selected_desarrolladora.value);
        const response = await contrato.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            useToastify('danger', response.message);
        }
    }, 400);
}

onMounted(async () => {
    //esta parte es para desabilitar el v-select de la desarrolladora segun el rol que se le asigna
    // y ademas se asigna la desarrolladora que le corresponde al usuario
    const response = await useUserByDesarrolladora();
    v_select_desarrolladora_enable.value = response.enable;
    selected_desarrolladora.value = response.desarrolladora;
    if (response.enable) {
        await listDesarrolladora();
    }
    showDataTable();
    loadDataTable();
});
</script>

