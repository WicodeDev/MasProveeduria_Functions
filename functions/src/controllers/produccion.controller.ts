import ProduccionDAL from "@data/produccion";
import asyncHandler from "@middlewares/async";
import Produccion from "@models/produccion/produccion";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * @function getProduccion
 * @description Function to handle the get produccion controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /produccion/:
 *   get:
 *     summary: Obtener la lista de todas las órdenes de producción
 *     description: Obtener la lista de todas las órdenes de producción
 *     tags:
 *       - Producción
 *     responses:
 *       200: 
 *         description: Órdenes de producción obtenidas correctamente
 *       204:
 *         description: No se encontraron las órdenes de producción
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getProduccion = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const seguimiento = await ProduccionDAL.getProduccion();
        response.setSend(StatusCodes.OK, "Ordenes producción obtenidos correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function createProduccion
 * @description Function to handle the create produccion controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /produccion/createProduccion:
 *   post:
 *     summary: Crear producción
 *     description: Crear una nueva orden de producción
 *     tags:
 *       - Producción
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numProduccion:
 *                 type: number
 *                 description: Número de producción
 *                 example: 340
 *               nombreCliente:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: Juanito Chacho
 *               fechaCreacion:
 *                 type: string
 *                 description: Fecha de creación de la orden de producción
 *                 example: 18/03/2024
 *               ordenes:
 *                 type: array
 *                 description: Lista de órdenes
 *                 items:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       description: uuid de la orden
 *                       example: abcd123
 *                     rollos:
 *                       type: number
 *                       description: Número de rollos
 *                       example: 5
 *                     metrosEntrada:
 *                       type: number
 *                       description: Metros de entrada
 *                       example: 10
 *                     materialPrincipal:
 *                       type: string
 *                       description: Material principal
 *                       example: CASCO DURO
 *                     fechaEntrega:
 *                       type: string
 *                       description: Fecha de entrega
 *                       example: 21/03/2024
 *                     refuerzo:
 *                       type: string
 *                       description: Tipo de refuerzo
 *                       example: Piel
 *                     adhesivo:
 *                       type: string
 *                       description: Tipo de adhesivo
 *                       example: resistol
 *                     tipo:
 *                       type: string
 *                       description: Tipo de producto
 *                       example: Rollo
 *                     estatus:
 *                       type: string
 *                       description: Estatus de la orden
 *                       example: Pendiente
 *     responses:
 *       201:
 *         description: Producción creada correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const createProduccion = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const prod = {
            numProduccion: req.body.numProduccion,
            nombreCliente: req.body.nombreCliente,
            fechaCreacion: req.body.fechaCreacion,
            ordenes: req.body.ordenes.map((orden: any) => ({
                rollos: orden.rollos,
                metrosEntrada: orden.metrosEntrada,
                materialPrincipal: orden.materialPrincipal,
                fechaEntrega: orden.fechaEntrega,
                refuerzo: orden.refuerzo,
                adhesivo: orden.adhesivo,
                tipo: orden.tipo,
                estatus: orden.estatus,
            })),
        } as Produccion;
        const newProduccion = await ProduccionDAL.createProduccion(prod);
        response.setSend(StatusCodes.CREATED, "Produccion creada correctamente", newProduccion);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function updateHoraProduccion
 * @description Function to handle the edit hora inicio y hora termino produccion controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /produccion/updateHoraProduccion:
 *   put:
 *     summary: Editar hora inicio y hora término de órdenes de producción
 *     description: Editar la hora de inicio y hora de término en las órdenes de producción
 *     tags:
 *       - Producción
 *     requestBody:
 *       description: Datos de la producción y órdenes a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la producción
 *                 example: "123"
 *               uuid:
 *                 type: string
 *                 description: UUID de la orden de producción
 *                 example: "456"
 *               horaInicio:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio de la producción
 *                 example: "09:00"
 *               horaFin:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin de la producción
 *                 example: "11:00"
 *     responses:
 *       200:
 *         description: Orden actualizada correctamente
 *       204:
 *         description: No se encontró la producción
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const updateHoraProduccion = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, uuid, horaInicio, horaFin} = req.body;
        const produccion = await ProduccionDAL.updateHoraProduccion(id, uuid, horaInicio, horaFin);
        response.setSend(StatusCodes.OK, "Produccion editada correctamente", produccion);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})