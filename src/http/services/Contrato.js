import axios from "@/http/connection/axios";

import { NumerosALetras } from 'numero-a-letras';

class Contrato {
    constructor(contrato, detalle_contrato) {
        this.contrato = {
            id: 0,
            n_contrato: "",
            descripcion: "",
            archivo_pdf: "",
            //este atributo no tiene la tabla contratos de la db, 
            //pero se envia para llenar la tabla clientes_has_contratos en la db
            id_cliente: "",
        };
        this.detalle_contrato = {
            n_de_lote: "",
            n_de_uv: "",
            zona: "",
            superficie_terreno: "",
            numero_distrito: "",
            numero_identificacion_terreno: "",//puede ser un string
            norte_medida_terreno: "",
            norte_colinda_lote: "",
            sur_medida_terreno: "",
            sur_colinda_lote: "",
            este_medida_terreno: "",
            este_colinda_lote: "",
            oeste_medida_terreno: "",
            oeste_colinda_lote: "",
            valor_construccion_literal: "",
            valor_construccion_numeral: "",
            valor_couta_inicial_literal: "",
            valor_couta_inicial_numeral: "",
            valor_couta_mensual_literal: "",
            valor_couta_mensual_numeral: "",
            primera_val_couta_mensual_numeral: "",
            segunda_val_couta_mensual_numeral: "",
            tercera_val_couta_mensual_numeral: "",
            lugar_firma_contrato: "",
            fecha_firma_contrato: "",
            id_contrato: "",
        };
        this.config = {
            headers: {
                'Assept': 'Application/json'
            }
        };
        if (contrato != undefined) {
            this.setAttributes('contrato', contrato);
        }

        if (detalle_contrato != undefined) {
            this.setAttributes('detalle-contrato', detalle_contrato);
        }

    }

    setCity(city) {
        this.city = city;
    }

    getCity() {
        return this.city;
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
                            case 'valor_construccion_literal':
                                this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.valor_construccion_numeral);
                                break;
                            case 'valor_couta_inicial_literal':
                                this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.valor_couta_inicial_numeral);
                                break;
                            case 'valor_couta_mensual_literal':
                                this.detalle_contrato[key] = this.numberOfLetters(item_contrato_all.valor_couta_mensual_numeral);
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
        // Reemplaza "Pesos" y "M.N." con cadenas vacías y elimina espacios en blanco
        return numero_literal.replace(/(Pesos|M\.N\.)/gi, '').trim();
    }

    async index() {
        try {
            const resolve = await axios.post('/contrato/all-data', this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async store() {
        try {
            const item_contrato_all = Object.assign({}, this.getAttributes('contrato'), this.getAttributes('detalle-contrato'));
            const resolve = await axios.post('/contrato/new-data', item_contrato_all, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const item_contrato_all = Object.assign({}, this.getAttributes('contrato'), this.getAttributes('detalle-contrato'));
            const resolve = await axios.post('/contrato/edit-data', item_contrato_all, this.config);

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
    async showDetalleContrato(is_id_contrato) {
        try {
            const resolve = await axios.post('/contrato/see-detalle-contrato', {
                id_contrato: is_id_contrato
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

}//class

export default Contrato;