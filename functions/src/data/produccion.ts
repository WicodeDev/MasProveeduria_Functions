import Produccion from "@models/produccion/produccion";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Produccion
 */


export default class ProduccionDAL {

    /**
     * Get Produccion
     * @returns List of Produccion
     */
    static async getProduccion(): Promise<Produccion[]>{
        try {
            const produccionRepo = getRepository(Produccion);
            const produccionList = await produccionRepo.find();
            if(produccionList.length == 0){
                throw new ErrorResponse("No se encontro ninguna produccion", 204);
            }
            return produccionList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las producciones", errorResponse.code || 500);
        }
    }

    /**
     * POST crear una produccion
     * @Params create produccion
     * @returns new produccion
     */
    static async createProduccion(produccion: Produccion): Promise<Produccion>{
        try {
            const produccionRepo = getRepository(Produccion);
            const newProduccion = await produccionRepo.create(produccion);
            return newProduccion;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al crear la produccion", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE hora inicio y hora termino Produccion
     * @Params id produccion id
     * @Params uuid orden uuid
     * @Params hora inicio to asign
     * @Params hora termino to asign
     * @returns Produccion edit
     */
    static async updateHoraProduccion(id: string, uuid: string, horaInicio: string, horaFin: string): Promise<Produccion>{
        try {
            const produccionRepo = getRepository(Produccion);
            const produccionEdit = await produccionRepo.findById(id);
            if(!produccionEdit){
                throw new ErrorResponse(`No se encontro ninguna produccion con el id: ${id} `, 204);
            }
            const ordenEdit = produccionEdit.ordenes.find(orden => orden.uuid === uuid);
            if(!ordenEdit){
                throw new ErrorResponse(`No se encontro ninguna orden de producción con el uuid: ${uuid} `, 204);
            }
            produccionEdit.ordenes.map(orden => {
                if(orden.uuid === uuid){
                    orden.horaInicio = horaInicio;
                    orden.horaTermino = horaFin;
                }
            });
            return produccionEdit;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al actualizar la produccion", errorResponse.code || 500);
        }
    }
}