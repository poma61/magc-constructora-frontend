import axios from '@/http/connection/axios';

class TransaccionPagoCouta {
    constructor(desarrolladora) {
        this.desarrolladora = desarrolladora;
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

    }

    async indexListCliente() {
        try {
            const resolve = await axios.post("/transaccion-pago-couta/all-data-cliente", {
                desarrolladora: this.desarrolladora,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index

    async indexListTransaccionPagoCouta(item) {
        try {
            const resolve = await axios.post("/transaccion-pago-couta/all-data-transaccion", {
                n_contrato: item.n_contrato,
                transaction_status: item.transaction_status,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index


}//class

export default TransaccionPagoCouta;