import axios from '@/http/connection/axios';
class HistorialDePagoCliente {
    constructor(desarrolladora) {
        this.desarrolladora = desarrolladora;
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    }

    async index() {
        try {
            const resolve = await axios.post("/historial-de-pago-cliente/all-data", {
                desarrolladora: this.desarrolladora,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index

}//class

export default HistorialDePagoCliente;