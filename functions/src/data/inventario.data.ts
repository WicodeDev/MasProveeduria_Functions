import Inventario from "@models/inventario/inventario";
import LogsInventario from "@models/inventario/logsInventario";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access Layer for Inventario
 */


export default class InventarioDAL {

    /**
     * GET inventario
     * @returns List of Inventario
     */
    static async getInventario(): Promise<Inventario[]>{
        try {
            const inventarioRepo = getRepository(Inventario);
            const inventarioList = await inventarioRepo.find();
            if(inventarioList.length == 0){
                throw new ErrorResponse("No se encontro ningun inventario", 204);
            }
            return inventarioList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener el inventario", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE minimo y maximo Inventario
     * @Params id Inventario id
     * @Params minimo to asign
     * @Params maximo to asign
     * @returns Inventario edit
     */
    static async editMinMaxInventario(id: string, minimo: number, maximo: number): Promise<Inventario> {
        try {
            const inventarioRepo = getRepository(Inventario);
            const inventarioExists = await inventarioRepo.findById(id);
            if(!inventarioExists){
                throw new ErrorResponse(`No se encontro ningun inventario con el id: ${id} `, 204);
            }
            const inventarioEdited = await inventarioRepo.update({...inventarioExists, inventarioMinimo: minimo, inventarioMaximo: maximo})
            return inventarioEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el inventario", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE consumo Inventario
     * @Params id Inventario id
     * @Params consumo to asign
     * @returns Inventario edit
     */
    static async editConsumoInventario(id: string, consumo: number): Promise<Inventario> {
        try {
            const inventarioRepo = getRepository(Inventario);
            const inventarioExists = await inventarioRepo.findById(id);
            if(!inventarioExists){
                throw new ErrorResponse(`No se encontro ningun inventario con el id: ${id} `, 204);
            }
            const inventarioEdited = await inventarioRepo.update({...inventarioExists, consumo: consumo})
            return inventarioEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el inventario", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE cantidad Inventario
     * @Params id Inventario id
     * @Params cantidad to asign
     * @returns Inventario edit
     */
    static async editCantidadInventario(id: string, cantidad: number): Promise<Inventario> {
        try {
            const inventarioRepo = getRepository(Inventario);
            const inventarioExists = await inventarioRepo.findById(id);
            if(!inventarioExists){
                throw new ErrorResponse(`No se encontro ningun inventario con el id: ${id} `, 204);
            }
            const inventarioEdited = await inventarioRepo.update({...inventarioExists, cantidad: cantidad})
            return inventarioEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el inventario", errorResponse.code || 500);
        }
    }

    /**
     * POST log Inventario
     * @Params log to asign
     * @returns New log
     */
    static async postLogInventario(log: LogsInventario): Promise<LogsInventario> {
        try {
            const inventarioRepo = getRepository(LogsInventario);
            const newLog = await inventarioRepo.create(log);
            return newLog;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al crear el log", errorResponse.code || 500);
        }
    }

    /**
     * GET Logs Inventarios
     * @returns List of Logs Inventarios
     */
    static async getLogsInventario(): Promise<LogsInventario[]>{
        try {
            const inventarioRepo = getRepository(LogsInventario);
            const inventarioList = await inventarioRepo.find();
            if(inventarioList.length == 0){
                throw new ErrorResponse("No se encontro ningun log", 204);
            }
            return inventarioList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los logs", errorResponse.code || 500);
        }
    }

    /**
     * GET Logs fecha Inventario
     * @returns Logs fecha Inventario
     */
    static async getLogsFechaInventario(fechaInicio: string, fechaFin: string): Promise<LogsInventario[]>{
        try {
            const inventarioRepo = getRepository(LogsInventario);
            let dataInicio = new Date(fechaInicio);
            let dataFin = new Date(fechaFin);
            let data = [];
            data = await inventarioRepo.find();
            let data2 = [];
            for (const element of data){
                const fecha = new Date(element.fecha);
                if(fecha >= dataInicio && fecha <= dataFin){
                    data2.push(element);
                }
            }
            if(data2.length == 0){
                throw new ErrorResponse("No se encontro ningun log", 204);
            }
            return data2;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los logs", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE proveedor Agentes
     * @Params id Proveedor id
     * @Params proveedor to asign
     * @Params codProveedor to asign
     * @returns Proveedor edit
     */
    static async editProveedorInventario(id: string, proveedor: string, codProveedor: number): Promise<Inventario> {
        try {
            const inventarioRepo = getRepository(Inventario);
            const inventarioExists = await inventarioRepo.findById(id);
            if(!inventarioExists){
                throw new ErrorResponse(`No se encontro ningun inventario con el id: ${id} `, 204);
            }
            const inventarioEdited = await inventarioRepo.update({...inventarioExists, proveedor: proveedor, codProveedor: codProveedor})
            return inventarioEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el inventario", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE alerta Inventario
     * @Params id Inventario id
     * @Params alerta to asign
     * @returns Inventario edit
     */

    static async editAlertaInventario(id: string, alerta: boolean): Promise<Inventario> {
        try {
            const inventarioRepo = getRepository(Inventario);
            const inventarioExists = await inventarioRepo.findById(id);
            if(!inventarioExists){
                throw new ErrorResponse(`No se encontro ningun inventario con el id: ${id} `, 204);
            }
            const inventarioEdited = await inventarioRepo.update({...inventarioExists, alerta: alerta})
            return inventarioEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el inventario", errorResponse.code || 500);
        }
    }
}