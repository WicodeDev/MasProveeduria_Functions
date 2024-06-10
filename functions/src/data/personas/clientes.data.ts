import Cliente from "@models/personas/clientes";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Cliente
 */


export default class ClienteDAL {

    /**
     * GET Clientes
     * @returns List of Clientes
     */
    static async getClientes(): Promise<Cliente[]>{
        try {
            const clienteRepo = getRepository(Cliente);
            const clientesList = await clienteRepo.find();
            if(clientesList.length == 0){
                throw new ErrorResponse("No se encontro ningun cliente", 204);
            }
            return clientesList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los clientes", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE meta Clientes
     * @Params id Cliente id
     * @Params meta to asign
     * @returns Cliente edit
     */
    static async editMetaCliente(id:string, meta: number): Promise<Cliente> {
        try {
            const clienteRepo = getRepository(Cliente);
            const clienteExists = await clienteRepo.findById(id);
            if(!clienteExists){
                throw new ErrorResponse(`No se encontro ningun cliente con el id: ${id} `, 204);
            }
            const clienteEdited = await clienteRepo.update({...clienteExists, meta: meta})
            return clienteEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el cliente", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE agente Cliente
     * @Params id Cliente id
     * @Params agente to asign
     * @returns Cliente edit
     */
    static async setClienteAgente(id: string, codAgente: number): Promise<Cliente> {
        try {
            const clienteRepo = getRepository(Cliente);
            const clienteExists = await clienteRepo.findById(id);
            if(!clienteExists){
                throw new ErrorResponse(`No se encontro ningun cliente con el id: ${id} `, 204);
            }
            const clienteEdited = await clienteRepo.update({...clienteExists, codAgente: codAgente})
            return clienteEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el cliente", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE agente Cliente
     * @Params id Cliente id
     * @Params agente to elim
     * @returns Cliente edit
     */
    static async removeClienteAgente(id: string): Promise<Cliente> {
        try {
            const clienteRepo = getRepository(Cliente);
            const clienteExists = await clienteRepo.findById(id);
            if(!clienteExists){
                throw new ErrorResponse(`No se encontro ningun cliente con el id: ${id} `, 204);
            }
            const clienteEdited = await clienteRepo.update({...clienteExists, codAgente: null, meta: null})
            return clienteEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el cliente", errorResponse.code || 500);
        }
    }
}