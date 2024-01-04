import axios from "@/http/connection/axios";
import { NumerosALetras } from 'numero-a-letras';

class Contrato {
    constructor(desarrolladora, type_of_register_client, clients, contrato, detalle_contrato) {
        this.desarrolladora = desarrolladora;
        this.type_of_register_client = type_of_register_client;
        this.contrato = {
            id: 0,
            n_contrato: "",
            descripcion: "",
            archivo_pdf: "",
        };
        this.detalle_contrato = {
            n_de_lote: "",
            n_de_uv: "",
            zona: "",
            terreno_superficie: "",
            numero_distrito: "",
            numero_identificacion_terreno: "",
            norte_medida_terreno: "",
            norte_colinda_lote: "",
            sur_medida_terreno: "",
            sur_colinda_lote: "",
            este_medida_terreno: "",
            este_colinda_lote: "",
            oeste_medida_terreno: "",
            oeste_colinda_lote: "",
            construccion_descripcion: "",
            construccion_superficie: "",
            construccion_valor_total_literal: "",
            construccion_valor_total_numeral: "",
            construccion_cantidad_meses_de_entrega: "",
            construccion_val_couta_inicial_literal: "",
            construccion_val_couta_inicial_numeral: "",
            construccion_val_couta_mensual_literal: "",
            construccion_val_couta_mensual_numeral: "",
            fecha_cancelacion_coutas:"",
            cantidad_coutas_mensuales: "",
            primera_val_couta_mensual_numeral: "",
            segunda_val_couta_mensual_numeral: "",
            tercera_val_couta_mensual_numeral: "",
            cuarta_val_couta_mensual_numeral: "",
            lugar_firma_contrato: "",
            fecha_firma_contrato: "",
            add_info_terreno: false,//informacion adicional del terreno
            terreno_valor_total_numeral: "",//puede ser null
            terreno_valor_total_literal: "", //puede ser null
            terreno_val_couta_inicial_numeral: "",//puede ser null
            terreno_val_couta_mensual_numeral: "",//puede ser null
        };
        this.config = {
            headers: {
                'Assept': 'Application/json',
                'Content-Type': 'application/json'
            }
        };
        if (contrato != undefined) {
            this.setAttributes('contrato', contrato);
        }

        if (detalle_contrato != undefined) {
            this.setAttributes('detalle-contrato', detalle_contrato);
        }

        if (clients != undefined) {
            this.clients = clients;
        }

    }

    setDesarrolladora(desarrolladora) {
        this.desarrolladora = desarrolladora;
    }

    getDesarrolladora() {
        return this.desarrolladora;
    }

    setCliente(type_of_register_client, cliente) {
        this.type_of_register_client = type_of_register_client;
        this.clients = cliente;
    }

    getCliente() {
        return this.clients;
    }

    setAttributes(type, item_contrato_all) {
        switch (type) {
            case 'contrato':
                Object.entries(this.contrato).forEach(([key]) => {
                    if (Object.prototype.hasOwnProperty.call(item_contrato_all, key)) {
                        this.contrato[key] = item_contrato_all[key];
                    }
                });
                break;
            case 'detalle-contrato':
                Object.entries(this.detalle_contrato).forEach(([key]) => {

                    if (Object.prototype.hasOwnProperty.call(item_contrato_all, key)) {
                        switch (key) {
                            case 'terreno_valor_total_literal':
                                if (item_contrato_all.terreno_valor_total_numeral != null || item_contrato_all.terreno_valor_total_numeral != "" || item_contrato_all.terreno_valor_total_numeral != undefined) {
                                    this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.terreno_valor_total_numeral);
                                }
                                break;
                            case 'construccion_valor_total_literal':
                                this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.construccion_valor_total_numeral);
                                break;
                            case 'construccion_val_couta_inicial_literal':
                                this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.construccion_val_couta_inicial_numeral);
                                break;
                            case 'construccion_val_couta_mensual_literal':
                                this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.construccion_val_couta_mensual_numeral);
                                break;
                            default:
                                this.detalle_contrato[key] = item_contrato_all[key];
                                break;
                        }//switch

                    }
                });
                break;

            default: console.log("No se encontro ninguna forma entre contrato o detalle contrato!")
                break;
        }//switch

    }//setAttributes

    getAttributes(type) {
        switch (type) {
            case 'contrato':
                return this.contrato;
            case 'detalle-contrato':
                return this.detalle_contrato;
            default:
                console.log("No se encontro ninguna forma entre contrato o detalle contrato!")
                return {};
        }

    }

    numberOfLetters(numero) {
        const numero_literal = NumerosALetras(numero);
        // Reemplaza "Pesos" y "M.N." con cadenas vacias  y agrega al final Dólares Americanos
        return numero_literal.replace(/(Pesos|M\.N\.)/gi, '').trim() + " Dólares Americanos";
    }

    async index() {
        try {
            const resolve = await axios.post('/contrato/all-data', {
                desarrolladora: this.desarrolladora,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async store() {
        try {
            const is_clients = this.clients.map(cliente => cliente.getAttributes());
            const resolve = await axios.post('/contrato/new-data', {
                desarrolladora: this.desarrolladora,
                type_of_register_client: this.type_of_register_client,
                clients: is_clients,
                detalle_contrato: this.getAttributes('detalle-contrato'),
                contrato: this.getAttributes('contrato'),
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const resolve = await axios.post('/contrato/edit-data', {
                desarrolladora: this.desarrolladora,
                detalle_contrato: this.getAttributes('detalle-contrato'),
                contrato: this.getAttributes('contrato'),
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async destroy() {
        try {
            const resolve = await axios.post('/contrato/delete-data', {
                id: this.getAttributes('contrato').id,
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }
    async showDetalleContrato() {
        try {
            const resolve = await axios.post('/contrato/see-detalle-contrato', {
                id_contrato: this.getAttributes('contrato').id,
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async updatePdfFile() {
        try {
            const resolve = await axios.post('/contrato/actualizar-pdf', {
                id_contrato: this.getAttributes('contrato').id,
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

}//class

export default Contrato;