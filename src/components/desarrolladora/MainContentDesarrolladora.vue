<template>
    <div class="d-flex flex-wrap justify-end my-2">
        <v-btn color="orange-darken-1" variant="elevated" class="ma-1" @click="initDataTable">
            <v-icon icon="mdi-refresh" />&nbsp;Actualizar datos
        </v-btn>
    </div>
    <!-- iterator -->
    <v-card elevation="5" style="height:700px; ">
        <v-overlay v-model="loading_data_iterator" contained class="d-flex align-center justify-center">
            <v-progress-circular color="orange-darken-1" indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-data-iterator :items="data" :items-per-page="15" :search="search_data">

            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

                <div class="d-flex justify-space-between flex-wrap pa-2">
                    <v-text-field v-model="search_data" clearable density="comfortable" hide-details
                        placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="orange-darken-1" class="pa-2"
                        style="min-width: 300px;" />

                    <div class="d-flex align-center">
                        <v-tooltip text="Anterior">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :disabled="page === 1" icon="mdi-arrow-left" density="comfortable"
                                    variant="elevated" color="orange-darken-1" @click="prevPage"></v-btn>
                            </template>
                        </v-tooltip>

                        <div class="mx-2 text-caption">
                            Pagina {{ page }} de {{ pageCount }}
                        </div>

                        <v-tooltip text="Siguiente">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :disabled="page >= pageCount" icon="mdi-arrow-right"
                                    density="comfortable" variant="elevated" color="orange-darken-1"
                                    @click="nextPage"></v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </div>

            </template>
            <template v-slot:default="{ items }">
                <div>
                    <v-container class="pa-2 pb-5" fluid style="overflow:hidden; overflow-y: auto;  height:600px; ">
                        <v-row justify="center">
                            <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                                <v-card class="pa-3" color="orange-lighten-1" variant="tonal">

                                    <v-list-item class="">
                                        <template v-slot:title>
                                            <strong>
                                                {{ item.raw.nombres }} {{ item.raw.apellido_paterno }} {{
                                                    item.raw.apellido_materno }}
                                            </strong>
                                        </template>

                                        <template v-slot:subtitle>
                                            <strong class="text-subtitle-2 text-light-blue-darken-3">
                                                {{ item.raw.correo_electronico }}
                                            </strong>
                                        </template>
                                    </v-list-item>

                                    <div class="d-flex justify-space-between px-4 flex-wrap">
                                        <p class="text-subtitle-2 text-light-blue-darken-3  ma-1">
                                            Historial de pagos:{{ item.raw.total_pagos }}
                                        </p>
                                        <div>
                                            <v-tooltip text="Editar registro.">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-bind="props" size="small" icon="mdi-pencil" color="success"
                                                        variant="elevated" class="ma-1" />
                                                </template>
                                            </v-tooltip>

                                            <v-tooltip text="Eliminar registro.">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-bind="props" size="small" icon="mdi-delete" color="red"
                                                        variant="elevated" class="ma-1" />
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
        <h1 class="text-center text-h6" v-if="data.length == 0">No hay datos.</h1>
    </v-card>
    <!-- iterator -->
</template>
    
<script>
import { defineComponent } from 'vue';
import Desarrolladora from '@/http/services/Desarrolladora';
import useToastify from '@/composables/useToastify';
export default defineComponent({
    data() {
        const loading_data_iterator = false;
        const data = [];
        const item_cliente = {};
        const index_item = -1;
        const search_data = "";
        return {
            loading_data_iterator,
            data,
            item_cliente,
            index_item,
            search_data,
        }
    },

    methods: {
        initDataTable() {
            this.loading_data_iterator = true;
            setTimeout(async () => {
                const desarrolladora = new Desarrolladora();
                const respuesta = await desarrolladora.index();
                this.loading_data_iterator = false;
                if (respuesta.status) {
                    this.data = respuesta.records;
                } else {
                    useToastify('danger', respuesta.message);
                }
            }, 800)
        },//initDataTable
    },//metodos

    created() {
        this.initDataTable();
    }

});

</script>
  