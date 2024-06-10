import Agente from "@models/personas/agente";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Agente
 */


export default class AgenteDAL {

    /**
     * GET Agentes
     * @returns List of Agentes
     */
    static async getAgentes(): Promise<Agente[]>{
        try {
            const agenteRepo = getRepository(Agente);
            const agentesList = await agenteRepo.find();
            if(agentesList.length == 0){
                throw new ErrorResponse("No se encontro ningun agente", 204);
            }
            return agentesList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los agentes", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE metaGlobal Agentes
     * @Params id Agente id
     * @Params meta to asign
     * @returns Agente edit
     */
    static async editMetaGlobalAgente(id: string, meta: number): Promise<Agente> {
        try {
            const agenteRepo = getRepository(Agente);
            const agenteExists = await agenteRepo.findById(id);
            if(!agenteExists){
                throw new ErrorResponse(`No se encontro ningun agente con el id: ${id} `, 204);
            }
            const agenteEdited = await agenteRepo.update({...agenteExists, metaGlobal: meta})
            return agenteEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el agente", errorResponse.code || 500);
        }
    }
}