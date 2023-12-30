
import axios from '@/http/connection/axios';

class Usuario {
    constructor(desarrolladora, usuario) {
        this.desarrolladora = desarrolladora;
        this.usuario = {
            id: 0,
            user: "",
            password: "",
            id_personal: "",
            rol_name: "",
        }
        if (usuario != undefined) {
            this.setAttributes(usuario);
        }
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    }

    async index() {
        try {
            const resolve = await axios.post("/usuario/all-data", {
                desarrolladora: this.desarrolladora
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index

    setAttributes(usuario) {
        Object.entries(this.usuario).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(usuario, key)) {
                this.usuario[key] = usuario[key];
            }
        });
    }
    getAttributes() {
        return this.usuario;
    }

    async store() {
        try {
            const resolve = await axios.post("/usuario/new-data", {
                ...this.getAttributes(),
                desarrolladora: this.desarrolladora
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//store


    async update() {
        try {
            this.config.headers['X-HTTP-Method-Override'] = 'PUT';
            const resolve = await axios.post("/usuario/edit-data", this.getAttributes(), this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//update


    async destroy() {
        try {
            const resolve = await axios.post( "/usuario/delete-data", {
                id: this.getAttributes().id
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index


}//class

export default Usuario;