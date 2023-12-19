import axios from '@/http/connection/axios';

class Desarrolladora {
    constructor(desarrolladora) {
        this.desarrolladora = {
            id: 0,
            nombres: "",
            logo: null,
            direccion: "",
            descripcion: "",
            correo_electronico: null,
        };
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        if (desarrolladora != undefined) {
            this.setAttributes(desarrolladora);
        }
    }

    setAttributes(desarrolladora) {
        Object.entries(this.desarrolladora).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(desarrolladora, key)) {
                this.desarrolladora[key] = desarrolladora[key];
            }
        });
    }

    getAttributes() {
        return this.desarrolladora;
    }

    async index() {
        try {
            const resolve = await axios.post('/desarrolladora/all-data', this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/desarrolladora/new-data', this.getAttributes(), this.config);
            return resolve.data;

        } catch (error) {

            return error.response.data;
        }
    }//create

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const resolve = await axios.post('/desarrolladora/edit-data', this.getAttributes(), this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;

        }

    }//update

    async destroy() {
        try {
            const resolve = await axios.post('/desarrolladora/delete-data', {
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy


}//class

export default Desarrolladora;

