import axios from '@/http/connection/axios';

class Cliente {
    constructor(cliente) {
        this.cliente = {
            id: 0,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            n_de_contacto: "",
            correo_electronico: "",
            ci: "",
            ci_expedido: "",
            direccion: "",
            descripcion: "",
        };
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            }
        }
        if (cliente != undefined) {
            this.setAttributes(cliente);
        }
    }

    setAttributes(cliente) {
        Object.entries(this.cliente).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(cliente, key)) {
                this.cliente[key] = cliente[key];
            }
        });
    }

    getAttributes() {
        return this.cliente;
    }

    async index() {
        try {
            const resolve = await axios.post('/cliente/all-data', this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/cliente/new-data', this.getAttributes(), this.config);
            return resolve.data;

        } catch (error) {

            return error.response.data;
        }
    }//create

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const resolve = await axios.post('/cliente/edit-data', this.getAttributes(), this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;

        }

    }//update

    async destroy() {
        try {
            const resolve = await axios.post('/cliente/delete-data', {
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy
    
    async searchCliente(is_ci) {
        try {
            const resolve = await axios.post('/cliente/search-cliente', {
                ci: is_ci,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class

export default Cliente;

