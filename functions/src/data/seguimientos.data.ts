import Base from "@models/seguimientos/base";
import SegPedido from "@models/seguimientos/segPedido";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

/**
 * Data access layer for Seguimiento
 */


export default class SeguimientoDAL {

    /**
     * GET Seguimientos
     * @returns List of Seguimientos
     */
    static async getSeguimientos(): Promise<SegPedido[]>{
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimientosList = await seguimientoRepo.find();
            if(seguimientosList.length == 0){
                throw new ErrorResponse("No se encontro ningun seguimiento pedido", 204);
            }
            return seguimientosList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los seguimientos", errorResponse.code || 500);
        }
    }

    /**
     * GET one seguimiento
     * @returns One seguimiento
     */
    static async getSeguimiento(nPedido: number): Promise<SegPedido>{
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimiento = await seguimientoRepo.whereEqualTo("nPedido", nPedido).findOne();
            if(!seguimiento){
                throw new ErrorResponse(`No se encontro ningun seguimiento con el numero de pedido: ${nPedido} `, 204);
            }
            return seguimiento;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener el seguimiento", errorResponse.code || 500);
        }
    }

    /**
     * DELETE one seguimiento
     * @returns delete one seguimiento
     */
    static async deleteSeguimiento(nPedido: number): Promise<void>{
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimiento = await seguimientoRepo.whereEqualTo("nPedido", nPedido).findOne();
            if(!seguimiento){
                throw new ErrorResponse(`No se encontro ningun seguimiento con el numero de pedido: ${nPedido} `, 204);
            }
            await seguimientoRepo.delete(seguimiento.id);
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al eliminar el seguimiento", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE cantidad entregada seguimiento
     * @Params id Seguimiento id
     * @Params cantidadEntregada to asign
     * @returns Seguimiento edit
     */
    static async editCantEntSeguimiento(id: string, cantidadEntregada: number): Promise<SegPedido> {
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimientoExists = await seguimientoRepo.findById(id)
            if(!seguimientoExists){
                throw new ErrorResponse(`No se encontro ningun seguimiento con el id: ${id} `, 204);
            }
            const seguimientoEdited = await seguimientoRepo.update({...seguimientoExists, cantidadEntregada: cantidadEntregada})
            return seguimientoEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el seguimiento", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE factura seguimiento
     * @Params id Seguimiento id
     * @Params factura to asign
     * @returns Seguimiento edit
     */
    static async editFacturaSeguimiento(id: string, factura: string): Promise<SegPedido> {
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimientoExists = await seguimientoRepo.findById(id)
            if(!seguimientoExists){
                throw new ErrorResponse(`No se encontro ningun seguimiento con el id: ${id} `, 204);
            }
            const seguimientoEdited = await seguimientoRepo.update({...seguimientoExists, factura: factura})
            return seguimientoEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el seguimiento", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE estatus orden seguimiento
     * @Params id Seguimiento id
     * @Params estatus orden to asign
     * @returns Seguimiento edit
     */
    static async editEstatusOrdenSeguimiento(id: string, estatusOrden: string): Promise<SegPedido> {
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimientoExists = await seguimientoRepo.findById(id)
            if(!seguimientoExists){
                throw new ErrorResponse(`No se encontro ningun seguimiento con el id: ${id} `, 204);
            }
            const seguimientoEdited = await seguimientoRepo.update({...seguimientoExists, estatusOrden: estatusOrden})
            return seguimientoEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el seguimiento", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE folio controlseguimiento
     * @Params id Seguimiento id
     * @Params folio control to asign
     * @returns Seguimiento edit
     */
    static async editFolioControlSeguimiento(id: string, folioControl: string): Promise<SegPedido> {
        try {
            const seguimientoRepo = getRepository(SegPedido);
            const seguimientoExists = await seguimientoRepo.findById(id)
            if(!seguimientoExists){
                throw new ErrorResponse(`No se encontro ningun seguimiento con el id: ${id} `, 204);
            }
            const seguimientoEdited = await seguimientoRepo.update({...seguimientoExists, folioControl: folioControl})
            return seguimientoEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el seguimiento", errorResponse.code || 500);
        }
    }

    /**
     * POST mandar a base seguimiento
     * @Params base to asign
     * @returns New base
     */
    static async postBaseSeguimiento(base: Base): Promise<Base> {
        try {
            const seguimientoRepo = getRepository(Base);
            const seguimiento = await seguimientoRepo.create(base)
            return seguimiento;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al mandar a base", errorResponse.code || 500);
        }
    }

    /**
     * GET one base
     * @returns one base
     */
    static async getBase(folio: string): Promise<Base>{
        try {
            const baseRepo = getRepository(Base);
            const base = await baseRepo.whereEqualTo("folio", folio).findOne();
            if(!base){
                throw new ErrorResponse(`No se encontro ningun base con el folio: ${folio} `, 204);
            }
            return base;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener el base", errorResponse.code || 500);
        }
    }

    /**
     * GET Bases
     * @returns List of Bases
     */
    static async getBases(): Promise<Base[]>{
        try {
            const baseRepo = getRepository(Base);
            const basesList = await baseRepo.find();
            if(basesList.length == 0){
                throw new ErrorResponse("No se encontro ninguna base", 204);
            }
            return basesList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los bases", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE validacion entrada base
     * @Params id Base id
     * @Params validacion entrada to asign
     * @returns Base edit
     */
    static async editVdEntrada(id: string, validacionEntrada: string): Promise<Base> {
        try {
            const baseRepo = getRepository(Base);
            const baseExists = await baseRepo.findById(id)
            if(!baseExists){
                throw new ErrorResponse(`No se encontro ninguna base con el id: ${id} `, 204);
            }
            const baseEdited = await baseRepo.update({...baseExists, validacionEntrada: validacionEntrada})
            return baseEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar el base", errorResponse.code || 500);
        }
    }
}