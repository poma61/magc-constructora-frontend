<template>
    
    <v-card class="animate__animated animate__bounceInRight">
        <v-card-title class="bg-purple-darken-1">
            <span class="text-h6">Registrar Cliente</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-row>
            <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
            <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12" md="6" >
                    <v-text-field v-model="item_cliente.nombres" label="Nombres (*)" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('nombres')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="item_cliente.apellido_paterno" label="Apellido paterno (*)" color="purple-darken-1"
                        clearable :error-messages="showFieldsErrors('apellido_paterno')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="item_cliente.apellido_materno" label="Apeliido materno (*)"  color="purple-darken-1"
                        clearable :error-messages="showFieldsErrors('apellido_materno')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="item_cliente.n_de_contacto" label="N° de contacto (N° de telefono/celular) (*)"
                        color="purple-darken-1" clearable :error-messages="showFieldsErrors('n_de_contacto')" type="number"
                        variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_cliente.correo_electronico" label="Correo electronico"
                        color="purple-darken-1" clearable :error-messages="showFieldsErrors('correo_electronico')"
                        type="email" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_cliente.ci" label="C.I. (*)" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('ci')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-autocomplete v-model="item_cliente.ci_expedido" label="Expedido (*)"
                        :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']" color="purple-darken-1"
                        :error-messages="showFieldsErrors('ci_expedido')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-textarea v-model="item_cliente.direccion" label="Direccion (*)" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('direccion')" variant="outlined" rows="3" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-textarea v-model="item_cliente.descripcion" label="Descripcion" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('descripcion')" variant="outlined" rows="3" />
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>

            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="emit('toCloseForm')">
                <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="purple-darken-1" variant="elevated" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import Cliente from '@/http/services/Cliente';
import useToastify from '@/composables/useToastify';
const props = defineProps(['p_item_cliente', 'p_fields_errors', 'p_selected_desarrolladora']);
const emit = defineEmits(['toCloseForm', 'toUpdateDataTable']);
const fields_errors = ref({});
const item_cliente = ref(props.p_item_cliente);
const loading_btn = ref(false);


const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const cliente = new Cliente(props.p_selected_desarrolladora, Object.assign({}, item_cliente.value));
        if (cliente.getAttributes().id > 0) {
            //cuando es update
            const response = await cliente.update();
            loading_btn.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toUpdateDataTable', 'edit', response.record);
                emit('toCloseForm');
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }

        } else {
            //cuando es create
            const response = await cliente.store();
            loading_btn.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toUpdateDataTable', 'new', response.record);
                emit('toCloseForm');
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }
        }
    }, 200);

}

</script> 


