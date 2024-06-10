import Proveedor from "@models/personas/proveedores";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Proveedor
 */


export default class ProveedorDAL {

    /**
     * GET Proveedores
     * @returns List of Proveedores
     */
    static async getProveedores(): Promise<Proveedor[]> {
        try {
            const proveedorRepo = getRepository(Proveedor);
            const proveedoresList = await proveedorRepo.find();
            if (proveedoresList.length == 0) {
                throw new ErrorResponse("No se encontro ningun proveedor", 204);
            }
            return proveedoresList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los proveedores", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE dia entrega Proveedores
     * @Params id Proveedor id
     * @Params entrega to asign
     * @return Proveedor edit
     */
    static async editDiaEntregaProveedor(id: string, entrega: number): Promise<Proveedor>{
        try {
            const proveedorRepo = getRepository(Proveedor);
            const proveedorExists = await proveedorRepo.findById(id);
            if(!proveedorExists){
                throw new ErrorResponse(`No se encontro ningun proveedor con el id: ${id} `, 204);
            }
            const proveedorEdited = await proveedorRepo.update({...proveedorExists, entrega: entrega})
            return proveedorEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el proveedor", errorResponse.code || 500);
        }
    }
}