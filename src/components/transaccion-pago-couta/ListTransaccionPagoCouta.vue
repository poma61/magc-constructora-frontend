<template>
    <div class="d-flex animate__animated animate__lightSpeedInLeft">
        <div class="d-flex flex-column">
            <v-tooltip text="Ver tablero principal">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="primary" variant="elevated" class="ma-1" @click="emit('toShowListCliente')"
                        icon="mdi-table" />
                </template>
            </v-tooltip>

            <v-tooltip text="Limpiar campos">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="primary" variant="elevated" class="ma-1" @click="clear()"
                        icon="mdi-delete-sweep" />
                </template>
            </v-tooltip>

            <v-tooltip text="Actualizar tablero de esta seccion">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="primary" variant="elevated" class="ma-1" @click="loadDataTable()"
                        icon="mdi-refresh" />
                </template>
            </v-tooltip>
        </div>

        <v-card class="mt-1 flex-grow-1" elevation="10">
            <v-card-text>
                <div class="ma-5 d-flex justify-center align-center">
                    <v-table density="compact" class="is-width-responsive">
                        <tbody>
                            <tr>
                                <td colspan="2" class="text-center text-h6 text-primary">Datos generales del cliente</td>
                            </tr>
                            <tr>
                                <th class="text-secondary">Nombre completo:</th>
                                <td>{{ props.p_item_cliente.nombres }} {{ props.p_item_cliente.apellido_paterno }} {{
                                    props.p_item_cliente.apellido_materno }}</td>
                            </tr>
                            <tr>
                                <th class="text-secondary">Numero de contrato:</th>
                                <td>{{ props.p_item_cliente.n_contrato }}</td>
                            </tr>

                        </tbody>
                    </v-table>

                </div>

                <v-row>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="nombreCompleto" label="Nombres" color="teal-accent-4" variant="outlined"
                            readonly />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="item_transaccion.numero_de_contacto" label="Numero de contacto"
                            color="teal-accent-4" variant="outlined" readonly />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="item_transaccion.correo_electronico" label="Correo electronico"
                            color="teal-accent-4" variant="outlined" readonly />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="item_transaccion.fecha_pago_couta" label="Fecha pago" color="teal-accent-4"
                            variant="outlined" readonly type="date" />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="item_transaccion.servicio" label="Servicio" color="teal-accent-4"
                            variant="outlined" readonly />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="item_transaccion.metodo_de_pago" label="Metodo de pago" color="teal-accent-4"
                            variant="outlined" readonly />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="parseDoubleMonto" label="Monto" color="teal-accent-4" variant="outlined"
                            readonly :prefix="item_transaccion.moneda" />
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="item_transaccion.num_couta" label="Couta" color="teal-accent-4"
                            variant="outlined" readonly prefix="N°" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-textarea v-model="item_transaccion.lugar" label="Lugar" color="teal-accent-4" variant="outlined"
                            readonly rows="2" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-textarea v-model="item_transaccion.nota" label="Nota" color="teal-accent-4" variant="outlined"
                            readonly rows="2" />
                    </v-col>

                </v-row>

                <v-radio-group inline v-model="transaction_status">
                    <v-radio label="Transacciones vigentes" :value="true" color="cyan-darken-1"></v-radio>
                    <v-radio label="Transacciones anuladas" :value="false" color="cyan-darken-1"></v-radio>
                </v-radio-group>
                
                <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                    color="amber-darken-4" />
                <v-data-table class="my-3" :hover="true" :items="data" :headers="columns" :search="search_data"
                    :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
                    :fixed-header="true" :height="500" :sort-by="[{ key: 'id', order: 'desc' }]">

                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                    </template>

                    <template v-slot:item.details="{ item }">
                        <v-btn icon="mdi-text-box" @click="showItem(item)" color="success" class="ma-1" />
                    </template>

                    <template v-slot:item.monto="{ item }">
                        <v-chip color="orange-darken-4">
                            {{ item.moneda }} {{ item.monto.toFixed(2) }}
                        </v-chip>
                    </template>

                </v-data-table>


            </v-card-text>
        </v-card>
    </div>
</template>
<script setup>
import TransaccionPagoCouta from '@/http/services/TransaccionPagoCouta';
import { computed, onMounted, watch } from 'vue';
import { ref } from 'vue';
import useToastify from '@/composables/useToastify';
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['p_item_cliente']);
const emit = defineEmits(['toShowListCliente']);
const search_data = ref("");
const loading_data_table = ref(null);
const transaction_status = ref(true);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const item_transaccion = ref({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    numero_de_contacto: "",
    monto: "",
    moneda: "",
    fecha_pago_couta: "",
    nota: "",
    servicio: "",
    lugar: "",
    num_couta: "",
});

const columns = ref([
    { title: 'Nombre', key: 'nombre',value:(item)=>`${item.nombres} ${item.apellidos}`},
    { title: 'Metodo de pago', key: 'metodo_de_pago' },
    { title: 'Couta', key: 'num_couta' },
    { title: 'Monto ', key: 'monto', },
    { title: 'Ver detalles', key: 'details', },
]);
const data = ref([]);

watch(transaction_status, (new_value, old_value) => {
    //si cambia el valor de transaction_status. entonces volvemos a ejecutar el metodo loadDataTable
    loadDataTable();
});
//methods

const nombreCompleto = computed(() => {
    if (item_transaccion.value.nombres != "") {
        return `${item_transaccion.value.nombres} ${item_transaccion.value.apellidos}`;
    }
    return "";
});

const parseDoubleMonto = computed(() => {
    if (item_transaccion.value.monto != "") {
        return `${Number(item_transaccion.value.monto).toFixed(2)}`;
    }

    return "";
});

const loadDataTable = () => {
    const list_transaccion = new TransaccionPagoCouta();
    loading_data_table.value = 'amber-darken-3';
    setTimeout(async () => {
        const response = await list_transaccion.indexListTransaccionPagoCouta({ n_contrato: props.p_item_cliente.n_contrato, transaction_status: transaction_status.value });
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            useToastify('danger', response.message);
        }
    }, 200);
}//loadDataTable

const showItem = (item) => {
    item_transaccion.value = Object.assign({}, item)
}

const clear = () => {
    item_transaccion.value = {
        nombres: "",
        apellidos: "",
        correo_electronico: "",
        numero_de_contacto: "",
        monto: "",
        moneda: "",
        fecha_pago_couta: "",
        nota: "",
        servicio: "",
        lugar: "",
        num_couta: "",
    };

    useToastify('success', 'Campos optimizados.')
}
onMounted(async () => {
    loadDataTable();
});
</script>

<style scoped>
.is-width-responsive {
    width: 800px;
}


@media only screen and (max-width: 1100px) {
    .is-width-responsive {
        width: 100%;
    }

}
</style>
