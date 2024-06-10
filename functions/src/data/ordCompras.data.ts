import OrdenCompra from "@models/compras/ordCompras";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Ordenes compras
 */


export default class OrdComprasDAL {

    /**
     * GET Ordenes Compras
     * @returns List of Ordenes Compras
     */
    static async getOrdCompras(): Promise<OrdenCompra[]>{
        try {
            const ordCompraRepo = getRepository(OrdenCompra);
            const ordComprasList = await ordCompraRepo.find();
            if(ordComprasList.length == 0){
                throw new ErrorResponse("No se encontro ninguna orden de compra", 204);
            }
            return ordComprasList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las ordenes de compra", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE autorizacion Ordenes Compras
     * @Params id Orden Compra id
     * @Params autorizacion to asign
     * @returns Orden Compra edit
     */
    static async editAutorizacionOrdCompra(id: string, autorizacion: string): Promise<OrdenCompra> {
        try {
            const ordCompraRepo = getRepository(OrdenCompra);
            const ordCompraExists = await ordCompraRepo.findById(id);
            if(!ordCompraExists){
                throw new ErrorResponse(`No se encontro ninguna orden de compra con el id: ${id} `, 204);
            }
            const ordCompraEdited = await ordCompraRepo.update({...ordCompraExists, autorizacion: autorizacion})
            return ordCompraEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar la orden de compra", errorResponse.code || 500);
        }
    }
}