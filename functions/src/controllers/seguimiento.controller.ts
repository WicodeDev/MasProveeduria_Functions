import SeguimientoDAL from "@data/seguimientos.data";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "@middlewares/async";
import { Request, Response } from "express";
import { mapData } from "@utils/data";
import Base from "@models/seguimientos/base";

/**
 * @function getSeguimientos
 * @description Function to handle the get seguimientos controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/:
 *   get:
 *     summary: Obtener la lista de todos los seguimientos
 *     description: Obtener la lista de todos los seguimientos
 *     tags:
 *       - Seguimientos
 *     responses:
 *       200: 
 *         description: Seguimientos obtenidos correctamente
 *       204:
 *         description: No se encontraron los seguimientos
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getSeguimientos = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const seguimiento = await SeguimientoDAL.getSeguimientos();
        response.setSend(StatusCodes.OK, "Seguimientos obtenidos correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getSeguimiento
 * @description Function to handle the get one seguimiento controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/getSeguimiento:
 *   get:
 *     summary: Obtener solo un seguimiento
 *     description: Obtener un seguimiento específico
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: query
 *         name: np
 *         description: Número del pedido
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       200: 
 *         description: Seguimiento obtenido correctamente
 *       204:
 *         description: No se encontró el seguimiento
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { np } = req.query;
        const parseNP = parseInt(np as string);
        const seguimiento = await SeguimientoDAL.getSeguimiento(parseNP);
        response.setSend(StatusCodes.OK, "Seguimiento obtenido correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function deleteSeguimiento
 * @description Function to handle the delete seguimiento controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/deleteSeguimiento:
 *   delete:
 *     summary: Eliminar un seguimiento
 *     description: Eliminar un seguimiento específico
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: query
 *         name: np
 *         description: Número de pedido
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       200: 
 *         description: Seguimiento eliminado correctamente
 *       204:
 *         description: No se eliminó el seguimiento
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const deleteSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { np } = req.query;
        const parseNP = parseInt(np as string);
        await SeguimientoDAL.deleteSeguimiento(parseNP);
        response.setSend(StatusCodes.OK, "Seguimiento eliminado correctamente", null);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editCantEntSeguimiento
 * @description Function to handle the edit cantidad entregada controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/setCantEntSeguimiento:
 *   put:
 *     summary: Editar la cantidad entregada del seguimiento
 *     description: Editar la cantidad entregada del seguimiento
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: cantidadEntregada
 *         description: Cantidad entregada del seguimiento
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Seguimiento actualizado correctamente
 *       204:
 *         description: No se encontró el seguimiento
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editCantEntSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, cantidadEntregada } = req.params;
        const parseCantidadEntregada = parseInt(cantidadEntregada as string);
        const seguimiento = await SeguimientoDAL.editCantEntSeguimiento(id, parseCantidadEntregada);
        response.setSend(StatusCodes.OK, "Cantidad entregada editada correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editFacturaSeguimiento
 * @description Function to handle the edit factura controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/setFacturaSeguimiento:
 *   put:
 *     summary: Editar la factura del seguimiento
 *     description: Editar la factura del seguimiento
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: factura
 *         description: Factura del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Seguimiento actualizado correctamente
 *       204:
 *         description: No se encontró el seguimiento
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editFacturaSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, factura } = req.params;
        const seguimiento = await SeguimientoDAL.editFacturaSeguimiento(id, factura);
        response.setSend(StatusCodes.OK, "Factura editada correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editEstatusOrdenSeguimiento
 * @description Function to handle the edit estado controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/setEstatusOrdenSeguimiento:
 *   put:
 *     summary: Editar el estatus de la orden del seguimiento
 *     description: Editar el estatus de la orden del seguimiento
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: estatusOrden
 *         description: Estatus de la orden del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Seguimiento actualizado correctamente
 *       204:
 *         description: No se encontró el seguimiento
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editEstatusOrdenSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, estatusOrden } = req.params;
        const seguimiento = await SeguimientoDAL.editEstatusOrdenSeguimiento(id, estatusOrden);
        response.setSend(StatusCodes.OK, "Estado editado correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editFolioControlSeguimiento
 * @description Function to handle the edit folio control controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/setFolioControlSeguimiento:
 *   put:
 *     summary: Editar el folio de control del seguimiento
 *     description: Editar el folio de control del seguimiento
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: folioControl
 *         description: Folio de control del seguimiento
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Seguimiento actualizado correctamente
 *       204:
 *         description: No se encontró el seguimiento
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editFolioControlSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, folioControl } = req.params;
        const seguimiento = await SeguimientoDAL.editFolioControlSeguimiento(id, folioControl);
        response.setSend(StatusCodes.OK, "Folio control editado correctamente", seguimiento);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function postBaseSeguimiento
 * @description Function to handle the create base controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/postBaseSeguimiento:
 *   post:
 *     summary: Mandar a base
 *     description: Mandar a base un seguimiento
 *     tags:
 *       - Seguimientos
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folio:
 *                 type: string
 *                 description: Folio de la base
 *                 example: FFF3
 *               rollos:
 *                 type: number
 *                 description: Número de rollos
 *                 example: 4
 *               cantS:
 *                 type: number
 *                 description: Cantidad solicitada
 *                 example: 3200
 *               cntPR:
 *                 type: number
 *                 description: Cantidad por rollo
 *                 example: 340
 *               proveedor:
 *                 type: string
 *                 description: Proveedor del seguimiento
 *                 example: IMPORTADORA GRATTARSI SA DE CV
 *               codigo:
 *                 type: string
 *                 description: Código del seguimiento
 *                 example: 1237457
 *               material:
 *                 type: string
 *                 description: Material del producto
 *                 example: NOVAFORT
 *               clasificacion:
 *                 type: string
 *                 description: Clasificación del producto
 *                 example: LAM
 *               fechaRecepcion:
 *                 type: string
 *                 description: Fecha de recepción del producto
 *                 example: Thu Apr 20 2023 18:00:00 GMT-0600 (hora estándar central)
 *               validacionEntrada:
 *                 type: string
 *                 description: Validación de entrada
 *                 example: 20
 *     responses:
 *       201:
 *         description: Mandado a base correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const postBaseSeguimiento = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const bas = mapData({
            ...req.body,
        }, Base)
        let cantPR: number; 
        cantPR = Number((bas.cantS/ bas.rollos).toFixed(2))
        bas.cantPR = cantPR;
        const base = await SeguimientoDAL.postBaseSeguimiento(bas);
        response.setSend(StatusCodes.CREATED, "Base creada correctamente", base.id);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend<null>(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getBase
 * @description Function to handle the get one base controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/getBase:
 *   get:
 *     summary: Obtener una sola base
 *     description: Obtener una sola base
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: query
 *         name: folio
 *         description: Folio de la base
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       200: 
 *         description: Base obtenida correctamente
 *       204:
 *         description: No se encontró la base
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getBase = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { folio } = req.query;
        const base = await SeguimientoDAL.getBase(folio as string);
        response.setSend(StatusCodes.OK, "Base obtenida correctamente", base);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend<null>(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getBases
 * @description Function to handle the get bases controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/getBases:
 *   get:
 *     summary: Obtener la lista de todas las bases
 *     description: Obtener la lista de todas las bases
 *     tags:
 *       - Seguimientos
 *     responses:
 *       200: 
 *         description: Bases obtenidas correctamente
 *       204:
 *         description: No se encontraron las bases
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getBases = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const bases = await SeguimientoDAL.getBases();
        response.setSend(StatusCodes.OK, "Bases obtenidas correctamente", bases);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend<null>(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editVdEntrada
 * @description Function to handle the edit validacion entrada base controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /seguimiento/setVdEntrada:
 *   put:
 *     summary: Editar validación entrada base
 *     description: Editar la validación de entrada para la base
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la base
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: vdEntrada
 *         description: Validación de entrada
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Base actualizada correctamente
 *       204:
 *         description: No se encontró la base
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editVdEntrada = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, vdEntrada } = req.params;
        const base = await SeguimientoDAL.editVdEntrada(id, vdEntrada);
        response.setSend(StatusCodes.OK, "Validacion entrada editada correctamente", base);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend<null>(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})