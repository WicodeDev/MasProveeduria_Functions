import OrdComprasDAL from "@data/ordCompras.data";
import asyncHandler from "@middlewares/async";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


/**
 * @function getOrdCompras
 * @description Function to handle the get ordenes compras controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /ordCompra/:
 *   get:
 *     summary: Obtener la lista de todas las órdenes de compra
 *     description: Obtener la lista de todas las órdenes de compra
 *     tags:
 *       - OrdCompras
 *     responses:
 *       200: 
 *         description: Órdenes de compra obtenidas correctamente
 *       204:
 *         description: No se encontraron las órdenes de compra
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getOrdCompras = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const ordCompras = await OrdComprasDAL.getOrdCompras();
        response.setSend(StatusCodes.OK, "Ordenes de compra obtenidos correctamente", ordCompras);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editAutorizacionOrdCompra
 * @description Function to handle the edit autorizacion orden compra controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /ordCompra/setAutorizacionOrdCompra/{id}/{autorizacion}:
 *   put:
 *     summary: Editar autorización de orden de compra
 *     description: Editar la autorización de la orden de compra
 *     tags:
 *       - OrdCompras
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la orden de compra
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: autorizacion
 *         description: Autorización de la orden de compra
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Orden de compra actualizada correctamente
 *       204:
 *         description: No se encontró la orden de compra
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editAutorizacionOrdCompra = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, autorizacion } = req.params;
        const agenteEdited = await OrdComprasDAL.editAutorizacionOrdCompra(id, autorizacion)
        response.setSend(StatusCodes.OK, "Orden de compra editada correctamente", agenteEdited);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})