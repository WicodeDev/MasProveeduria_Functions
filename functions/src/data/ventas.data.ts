import Venta from "@models/ventas/ventas";
import VentasAgrupadas from "@models/ventas/ventasAgrupadas";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Venta
 */


export default class VentaDAL {
    
    /**
     * GET Ventas
     * @returns List of Ventas
     */
    static async getVentas(): Promise<Venta[]>{
        try {
            const ventaRepo = getRepository(Venta);
            const ventasList = await ventaRepo.find();
            if(ventasList.length == 0){
                throw new ErrorResponse("No se encontro ninguna venta", 204);
            }
            return ventasList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las ventas", errorResponse.code || 500);
        }
    }

    /**
     * GET Ventas Agrupadas
     * @returns List of Ventas Agrupadas
     */
    static async getVentasAgrupadas(): Promise<VentasAgrupadas[]>{
        try {
            const ventaRepo = getRepository(VentasAgrupadas);
            const ventasList = await ventaRepo.find();
            if(ventasList.length == 0){
                throw new ErrorResponse("No se encontro ninguna venta agrupada", 204);
            }
            return ventasList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las ventas agrupadas", errorResponse.code || 500);
        }
    }
}