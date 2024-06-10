import ClienteDAL from "@data/personas/clientes.data";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "@middlewares/async";
import { Request, Response } from "express";

/**
 * @function getClientes
 * @description Function to handle the get cliente controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /cliente/:
 *   get:
 *     summary: Obtener la lista de todos los clientes
 *     description: Obtener la lista de todos los clientes
 *     tags:
 *       - Clientes
 *     responses:
 *       200: 
 *         description: Clientes obtenidos correctamente
 *       204:
 *         description: No se encontraron clientes
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getClientes = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const clientes = await ClienteDAL.getClientes();
        response.setSend(StatusCodes.OK, "Clientes obtenidos correctamente", clientes);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editMetaCliente
 * @description Function to handle the edit meta cliente controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /cliente/setMeta:
 *   put:
 *     summary: Editar meta cliente
 *     description: Editar la meta del cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del cliente
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: meta
 *         description: Meta del cliente
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Cliente actualizado correctamente
 *       204:
 *         description: No se encontró el cliente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editMetaCliente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, meta } = req.params;
        const parseMeta = parseInt(meta as string);
        const cliente = await ClienteDAL.editMetaCliente(id, parseMeta);
        response.setSend(StatusCodes.OK, "Meta editada correctamente", cliente);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})


/**
 * @function setClienteAgente
 * @description Function to handle the set agente cliente controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /cliente/setClienteAgente:
 *   put:
 *     summary: Editar agente cliente
 *     description: Editar el agente del cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del cliente
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: codAgente
 *         description: Código del agente
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Cliente actualizado correctamente
 *       204:
 *         description: No se encontró el cliente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const setClienteAgente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, codAgente } = req.params;
        const parseCodAgente = parseInt(codAgente as string);
        const cliente = await ClienteDAL.setClienteAgente(id, parseCodAgente);
        response.setSend(StatusCodes.OK, "Agente asignado correctamente", cliente);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function removeClienteAgente
 * @description Function to handle the remove agente cliente controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /cliente/removeClienteAgente:
 *   put:
 *     summary: Quitar el agente del cliente
 *     description: Quitar el agente del cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del cliente
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Cliente actualizado correctamente
 *       204:
 *         description: No se encontró el cliente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const removeClienteAgente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id } = req.params;
        const cliente = await ClienteDAL.removeClienteAgente(id);
        response.setSend(StatusCodes.OK, "Agente eliminado correctamente", cliente);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})