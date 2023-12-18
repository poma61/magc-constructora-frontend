
import axios from '@/http/connection/axios';

class Usuario {
    constructor(sucursal, usuario) {
        this.prefix = "/usuario";
        this.sucursal = sucursal;
        this.usuario = {
            id: 0,
            usuario: "",
            password: "",
            id_personal: "",
            type_role: "",
        }
        if (usuario != undefined) {
            this.setAttributes(usuario);
        }
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            }

        }

    }

    async index() {
        try {
            const resolve = await axios.post(this.prefix + "/all", {
                sucursal: this.sucursal
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
            const resolve = await axios.post(this.prefix + "/new", {
                ...this.getAttributes(),
                sucursal: this.sucursal
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//store


    async update() {
        try {
            this.config.headers['X-HTTP-Method-Override'] = 'PUT';
            const resolve = await axios.post(this.prefix + "/refresh", this.getAttributes(), this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//update


    async destroy() {
        try {
            const resolve = await axios.post(this.prefix + "/delete", {
                id: this.getAttributes().id
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index


}//class

export default Usuario;