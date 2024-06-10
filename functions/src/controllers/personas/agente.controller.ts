import AgenteDAL from "@data/personas/agente.data";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response"
import { StatusCodes } from "http-status-codes";
import asyncHandler from "@middlewares/async";
import { Request, Response } from "express";

/**
 * @function getAgentes
 * @description Function to handle the get agente controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /agente/:
 *   get:
 *     summary: Obtener la lista de todos los agentes
 *     description: Obtener la lista de todos los agentes
 *     tags:
 *       - Agentes
 *     responses:
 *       200: 
 *         description: Agentes obtenidos correctamente
 *       204:
 *         description: No se encontraron agentes
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getAgentes = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const agentes = await AgenteDAL.getAgentes();
        response.setSend(StatusCodes.OK, "Agentes obtenidos correctamente", agentes);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editMetaGlobalAgente
 * @description Function to handle the edit meta global agente controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /agente/setMeta:
 *   put:
 *     summary: Editar meta agente
 *     description: Editar la meta global del agente
 *     tags:
 *       - Agentes
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del agente
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: meta
 *         description: Meta global del agente
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Agente actualizado correctamente
 *       204:
 *         description: No se encontró el agente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editMetaGlobalAgente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, meta } = req.params;
        const parseMeta = parseInt(meta as string);
        const agenteEdited = await AgenteDAL.editMetaGlobalAgente(id, parseMeta);
        response.setSend(StatusCodes.OK, "Agente editado correctamente", agenteEdited);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})