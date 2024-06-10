import ResponseHTTP from "@utils/response";
import asyncHandler from "@middlewares/async";
import { Request, Response } from "express";
import ProveedorDAL from "@data/personas/proveedor.data";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "@utils/errorResponse";

/**
 * @function getProveedores
 * @description Function to handle the get proveedor controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /proveedor/:
 *   get:
 *     summary: Obtener la lista de todos los proveedores
 *     description: Obtener la lista de todos los proveedores
 *     tags:
 *       - Proveedores
 *     responses:
 *       200: 
 *         description: Proveedores obtenidos correctamente
 *       204:
 *         description: No se encontraron proveedores
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getProveedores = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const proveedores = await ProveedorDAL.getProveedores();
        response.setSend(StatusCodes.OK, "Proveedores obtenidos correctamente", proveedores);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editDiaEntregaProveedor
 * @description Function to handle the edit dia entrega proveedor controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /proveedor/setDiaEntrega:
 *   put:
 *     summary: Editar día de entrega del proveedor
 *     description: Editar el día de entrega del proveedor
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del proveedor
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: entrega
 *         description: Día de entrega del proveedor
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Proveedor actualizado correctamente
 *       204:
 *         description: No se encontró el proveedor
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editDiaEntregaProveedor = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, entrega } = req.params;
        const parseEntrega = parseInt(entrega as string);
        const proveedorEdited = await ProveedorDAL.editDiaEntregaProveedor(id, parseEntrega);
        response.setSend(StatusCodes.OK, "Proveedor editado correctamente", proveedorEdited);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})