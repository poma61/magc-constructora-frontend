<template>
    <div class="animate__animated animate__backInDown">
        <v-select style="min-width: 300px;" label="Desarrolladoras" v-model="selected_desarrolladora"
            :items="list_desarrolladora" color="teal-accent-4" @update:model-value="initDataIterator"/>
    </div>
    <div class="as-flex">
        <!-- iterator -->
        <v-card class="as-flex-item as-data-iterator-container animate__animated animate__zoomIn">
            <v-overlay v-model="loading_data_iterator" contained class="d-flex align-center justify-center">
                <v-progress-circular color="teal-accent-4" indeterminate size="64"></v-progress-circular>
            </v-overlay>

            <v-data-iterator :items="data" :items-per-page="6" :search="search_item"
                :sort-by="[{ key: 'id', order: 'desc' }]">

                <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

                    <div class="d-flex justify-space-between flex-wrap pa-2">
                        <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                            placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="teal-accent-4"
                            class="pa-2" style="min-width: 300px;" />

                        <div class="d-flex align-center">
                            <v-tooltip text="Anterior">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" :disabled="page === 1" icon="mdi-arrow-left" density="comfortable"
                                        variant="elevated" color="teal-accent-4" @click="prevPage"></v-btn>
                                </template>
                            </v-tooltip>

                            <div class="mx-2 text-caption">
                                Pagina {{ page }} de {{ pageCount }}
                            </div>

                            <v-tooltip text="Siguiente">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" :disabled="page >= pageCount" icon="mdi-arrow-right"
                                        density="comfortable" variant="elevated" color="teal-accent-4 "
                                        @click="nextPage"></v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </div>

                </template>

                <template v-slot:default="{ items }">
                    <div>
                        <v-container class="as-data-iterator" fluid>
                            <v-row justify="center">
                                <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                                    <v-card class="pa-3" variant="tonal" min-height="200px">
                                        <!-- sdf -->
                                        <v-sheet>
                                            <v-img :src="app.BASE_URL + item.raw.foto" height="150" />
                                            <div class="d-flex flex-column">
                                                <h2 class="text-h6">{{ item.raw.nombres }} {{ item.raw.apellido_paterno }}
                                                    {{ item.raw.apellido_materno }}</h2>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis">{{ item.raw.user }}</p>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis">{{ item.raw.rol_name }}</p>
                                            </div>
                                        </v-sheet>

                                        <!-- dfgdfs -->
                                        <div class="d-flex justify-end px-4 flex-wrap">
                                            <div>
                                                <v-tooltip text="Editar registro.">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn v-bind="props" size="small" icon="mdi-pencil"
                                                            color="teal-accent-4" variant="elevated" class="ma-1"
                                                            @click="editForm(item.raw)" />
                                                    </template>
                                                </v-tooltip>

                                                <v-tooltip text="Eliminar registro.">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn v-bind="props" size="small" icon="mdi-delete" color="red"
                                                            variant="elevated" class="ma-1"
                                                            @click="openDeleteItem(item.raw)" />
                                                    </template>
                                                </v-tooltip>
                                            </div>

                                        </div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </template>

            </v-data-iterator>
            <div class="as-data-iterator d-flex justify-center" v-if="data.length == 0">
                <p class="mt-2">No hay datos disponibles.</p>
            </div>

            <div class="float-end">
                <v-btn color="teal-accent-4 " variant="elevated" class="ma-1" @click="initDataIterator">
                    <v-icon icon="mdi-refresh" />&nbsp;Actualizar tablero
                </v-btn>
            </div>
        </v-card>
        <!-- iterator -->

        <FormUsuario :p_item_usuario="item_usuario" :p_selected_desarrolladora="selected_desarrolladora"
            @toLocalUpdateDataTable="localUpdateDataTable" @toNewForm="newForm" />

        <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
            <v-card class="px-5 py-5">
                <v-card-text class="text-center">
                    <v-icon icon="mdi-trash-can-outline" size="100" color="red"
                        class="animate__animated animate__infinite animate__bounce"></v-icon>
                    <p class="text-h6">
                        ¿Esta seguro(a) de eliminar el registro seleccionado?
                    </p>
                </v-card-text>
                <v-card-actions>
                    <div class="d-flex justify-center" style="width: 100%;">
                        <v-btn color="red" variant="outlined" @click="closeDeleteItem" class="ma-1">
                            <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                        </v-btn>
                        <v-btn color="light-blue-accent-4" variant="outlined" class="ma-1" @click="confirmDeleteItem">
                            <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import Usuario from '@/http/services/Usuario';
import useToastify from '@/composables/useToastify';
import FormUsuario from '@/components/usuario/FormUsuario.vue';
import app from '@/config/app';
import Desarrolladora from '@/http/services/Desarrolladora';

const loading_data_iterator = ref(false);
const data = ref([]);
const item_usuario = ref({});
const index_item = ref(-1);
const search_item = ref("");
const dialog_delete = ref(false);
const list_desarrolladora = ref([]);
const selected_desarrolladora = ref("");

const listDesarrolladora = async () => {
    const usuario = new Desarrolladora();
    const response = await usuario.index();
    if (response.status) {
        const sucursal_all = response.records;
        list_desarrolladora.value = sucursal_all.map(item => item.nombres);
        selected_desarrolladora.value = list_desarrolladora.value[0];
    } else {
        useToastify('danger', response.message);
    }
}

const initDataIterator = () => {
    loading_data_iterator.value = true;
    setTimeout(async () => {
        const usuario = new Usuario(selected_desarrolladora.value);
        const respuesta = await usuario.index();
        loading_data_iterator.value = false;
        if (respuesta.status) {
            data.value = respuesta.records;
            search_item.value = "";
        } else {
            useToastify('danger', respuesta.message);
        }
    }, 200)
}//initDataIterator

const clear = () => {
    item_usuario.value = {};
    index_item.value = -1;
}

const openDeleteItem = (item) => {
    index_item.value = data.value.indexOf(item);
    //solo pasamos el id porque si nos se muestra en el formulario los datos
    item_usuario.value = Object.assign({ id: item.id });
    dialog_delete.value = true;
}

const closeDeleteItem = () => {
    dialog_delete.value = false;
    clear();
}

const confirmDeleteItem = async () => {
    const usuario = new Usuario();
    usuario.setAttributes(Object.assign({}, item_usuario.value));
    const response = await usuario.destroy();
    if (response.status) {
        data.value.splice(index_item.value, 1);
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message)
    }
    closeDeleteItem();
}

const newForm = () => {
    clear();
    const usuario = new Usuario();
    item_usuario.value = Object.assign({}, usuario.getAttributes());
}

const editForm = (item) => {
    item_usuario.value = Object.assign({}, item);
    index_item.value = data.value.indexOf(item);
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            break;
        case 'edit':
            Object.assign(data.value[index_item.value], item);
            break;
        default:
            useToastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
    newForm();
}
onMounted(async () => {
    await listDesarrolladora();
    newForm();
    initDataIterator();
});
</script>

<style scoped>
.as-flex {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
}

.as-flex .as-flex-item {
    flex-grow: 1;
    width: 500px;
}

/* ========================================
data iterator 
el valor height de as-data-iterator-container es +130 o +100 sobre el valor height de as-data-iterator
ejemplo: as-data-iterator =>height700px entonces as-data-iterator-container => height:130px+700px;
ejemplo2: as-data-iterator =>height700px entonces as-data-iterator-container => height:100px+700px;
========================================== */

.as-data-iterator-container {
    height: 730px;
}
.as-data-iterator {
    overflow: hidden;
    overflow-y: auto;
    height: 600px;
    border-top: 1px solid #c2c2c2;
    border-bottom: 1px solid #c2c2c2;
}
@media only screen and (max-width: 500px) {
    .as-data-iterator-container {
        height: 760px;
    }
}

</style>

