import VentaDAL from "@data/ventas.data";
import asyncHandler from "@middlewares/async";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * @function getVentas
 * @description Function to handle the get ventas controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /venta/:
 *   get:
 *     summary: Obtener la lista de todas las ventas
 *     description: Obtener la lista de todas las ventas
 *     tags:
 *       - Ventas
 *     responses:
 *       200: 
 *         description: Ventas obtenidas correctamente
 *       204:
 *         description: No se encontraron las ventas
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getVentas = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const ventas = await VentaDAL.getVentas();
        response.setSend(StatusCodes.OK, "Ventas obtenidas correctamente", ventas);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getVentasAgrupadas
 * @description Function to handle the get ventas agrupadas controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /venta/ventasAgrupadas:
 *   get:
 *     summary: Obtener la lista de todas las ventas agrupadas
 *     description: Obtener la lista de todas las ventas agrupadas
 *     tags:
 *       - Ventas
 *     responses:
 *       200: 
 *         description: Ventas agrupadas obtenidas correctamente
 *       204:
 *         description: No se encontraron las ventas agrupadas
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getVentasAgrupadas = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const ventas = await VentaDAL.getVentasAgrupadas();
        response.setSend(StatusCodes.OK, "Ventas agrupadas obtenidas correctamente", ventas);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})