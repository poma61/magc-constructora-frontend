<template>
    <v-card>
        <v-card-title class="bg-purple-darken-1">
            <span class="text-h6">Registrar desarrolladora</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="item_desarrolladora.nombres" label="Nombres" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('nombres')" variant="underlined" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_desarrolladora.direccion" label="Direccion" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('direccion')" variant="underlined" rows="2" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_desarrolladora.descripcion" label="Descripcion" color="purple-darken-1"
                        clearable :error-messages="showFieldsErrors('descripcion')" variant="underlined" rows="2" />
                </v-col>

                <v-col cols="12">
                    <v-text-field v-model="item_desarrolladora.correo_electronico" label="Correo electronico"
                        color="purple-darken-1" clearable :error-messages="showFieldsErrors('correo_electronico')"
                        type="email" variant="underlined" />
                </v-col>

                <v-col cols="12" sm="8">
                    <v-file-input accept="image/*" label="Logo desarrolladora" color="purple-darken-1"
                        :error-messages="showFieldsErrors('logo')" v-model="is_file" @change="uploadImage"
                        :clearable="false">
                    </v-file-input>
                </v-col>

                <v-col cols="12" sm="4">
                    <div class="ma-1 image-content">
                        <v-img :height="200" :src="src_image">
                        </v-img>
                    </div>
                </v-col>

            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple-darken-1" variant="elevated" @click="clear">
                <v-icon icon="mdi-delete-sweep"></v-icon>&nbsp;
            </v-btn>
            <v-btn color="purple-darken-1" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import Desarrolladora from '@/http/services/Desarrolladora';
import useToastify from '@/composables/useToastify';
import app from '@/config/app';


const props = defineProps(['p_item_desarrolladora']);
const emit = defineEmits(['toLocalUpdateDataTable', 'toNewForm']);
const fields_errors = ref({});
const item_desarrolladora = ref(props.p_item_desarrolladora);
const loading_btn = ref(false);
const src_image = ref("");
const is_file = ref([]);

watch(() => props.p_item_desarrolladora, () => {
    item_desarrolladora.value = props.p_item_desarrolladora;
    //para mostrar la imagen cuando sea update
    if (item_desarrolladora.value.id > 0) {
        src_image.value = app.BASE_URL + item_desarrolladora.value.logo;
        item_desarrolladora.value.logo = null;//colocamos null porque es update y no necesita una imagen nueva
    }
    fields_errors.value = {};

});

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const clear = () => {
    fields_errors.value = {};
    is_file.value = [];
    src_image.value = "";
    emit('toNewForm');
}

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const desarrolladora = new Desarrolladora(Object.assign({}, item_desarrolladora.value));
        if (desarrolladora.getAttributes().id > 0) {
            //cuando es update
            const response = await desarrolladora.update();
            loading_btn.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record)
                clear();
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }

        } else {
            //cuando es store o nuevo registro
            const response = await desarrolladora.store();
            loading_btn.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                clear();
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }
        }
    }, 200);
}

const uploadImage = () => {
    const file = is_file.value[0];
    if (file) {
        item_desarrolladora.value.logo = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            src_image.value = e.target.result;
        };
    }

}

</script> 

<style scoped>
.image-content {
    border-radius: 5px;
    border: 2px dashed #000;
}
</style>
