import InventarioDAL from "@data/inventario.data";
import asyncHandler from "@middlewares/async";
import LogsInventario from "@models/inventario/logsInventario";
import { mapData } from "@utils/data";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


/**
 * @function getInventario
 * @description Function to handle the get inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/:
 *   get:
 *     summary: Obtener la lista de todo el inventario
 *     description: Obtener la lista de todo el inventario
 *     tags:
 *       - Inventario
 *     responses:
 *       200: 
 *         description: Inventario obtenido correctamente
 *       204:
 *         description: No se encontró el inventario
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const inventarios = await InventarioDAL.getInventario();
        response.setSend(StatusCodes.OK, "Inventario obtenidos correctamente", inventarios);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editMinMaxInventario
 * @description Function to handle the edit minimo y maximo inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/setMinMaxInventario/{id}/{min}/{max}:
 *   put:
 *     summary: Editar mínimo y máximo inventario
 *     description: Editar el mínimo y el máximo del inventario
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: min
 *         description: Mínimo del inventario
 *         required: true
 *         schema: 
 *           type: number
 *       - in: path
 *         name: max
 *         description: Máximo del inventario
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Producto actualizado correctamente
 *       204:
 *         description: No se encontró el producto
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editMinMaxInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, min, max } = req.params;
        const parseMin = parseInt(min as string);
        const parseMax = parseInt(max as string);
        const inventario = await InventarioDAL.editMinMaxInventario(id, parseMin, parseMax);
        response.setSend(StatusCodes.OK, "Mínimo y Máximo editado correctamente", inventario);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editConsumoInventario
 * @description Function to handle the edit consumo inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/setConsumoInventario/{id}/{consumo}:
 *   put:
 *     summary: Editar consumo inventario
 *     description: Editar el consumo del inventario
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: consumo
 *         description: Consumo del producto
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Producto actualizado correctamente
 *       204:
 *         description: No se encontró el producto
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editConsumoInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, consumo } = req.params;
        const parseConsumo = parseInt(consumo as string);
        const inventario = await InventarioDAL.editConsumoInventario(id, parseConsumo);
        response.setSend(StatusCodes.OK, "Consumo editado correctamente", inventario);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editCantidadInventario
 * @description Function to handle the edit cantidad inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/setCantidadInventario/{id}/{cantidad}:
 *   put:
 *     summary: Editar cantidad inventario
 *     description: Editar la cantidad del inventario
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: cantidad
 *         description: Cantidad del producto
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Producto actualizado correctamente
 *       204:
 *         description: No se encontró el producto
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editCantidadInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, cantidad } = req.params;
        const parseCantidad = parseInt(cantidad as string);
        const inventario = await InventarioDAL.editCantidadInventario(id, parseCantidad);
        response.setSend(StatusCodes.OK, "Cantidad editada correctamente", inventario);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function postLogInventario
 * @description Function to handle the create new log inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/postLogInventario:
 *   post:
 *     summary: Crear nuevo log
 *     description: Crear un nuevo log sobre el movimiento de inventario
 *     tags:
 *       - Inventario
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidadAnterior:
 *                 type: number
 *                 description: Cantidad anterior del producto
 *                 example: 1100
 *               cantidadNueva:
 *                 type: number
 *                 description: Cantidad nueva del producto
 *                 example: 1300
 *               cantidadMovimiento:
 *                 type: number
 *                 description: Cantidad que se agregó al producto
 *                 example: 200
 *               fecha:
 *                 type: string
 *                 description: Fecha de cuando se hizo el movimiento
 *                 example: Martes 4 de junio de 2024
 *               movimiento:
 *                 type: string
 *                 description: Qué movimiento se realizó
 *                 example: Suma de inventario
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: MASTER 41 - / 07
 *               tipo:
 *                 type: string
 *                 description: Tipo del producto
 *                 example: MASTER
 *               usuario:
 *                 type: string
 *                 description: Usuario que hizo el movimiento
 *                 example: Naruxdev@wicode.com.mx
 *     responses:
 *       201:
 *         description: Log inventario creado correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const postLogInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const log = mapData({
            ...req.body,
        }, LogsInventario)
        const newLog = await InventarioDAL.postLogInventario(log);
        response.setSend(StatusCodes.CREATED, "Log creado correctamente", newLog);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getLogsInventario
 * @description Function to handle the get logs inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/getLogsInventario:
 *   get:
 *     summary: Obtener la lista de todos los logs del inventario
 *     description: Obtener la lista de todos los logs del inventario
 *     tags:
 *       - Inventario
 *     responses:
 *       200: 
 *         description: Logs del inventario obtenidos correctamente
 *       204:
 *         description: No se encontraron los logs del inventario
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getLogsInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const logs = await InventarioDAL.getLogsInventario();
        response.setSend(StatusCodes.OK, "Logs obtenidos correctamente", logs);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getLogsFechaInventario
 * @description Function to handle the get logs fecha inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/getLogsFechaInventario/{fechaInicio}/{fechaFin}:
 *   get:
 *     summary: Obtener la lista de los logs del inventario dentro del rango de fechas
 *     description: Obtener la lista de los logs del inventario dentro del rango de fechas
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         description: Fecha de inicio para buscar logs del inventario
 *         required: true
 *         schema: 
 *           type: string
 *       - in: query
 *         name: fechaFin
 *         description: Fecha de fin para buscar logs del inventario
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       200: 
 *         description: Logs del inventario obtenidos correctamente
 *       204:
 *         description: No se encontraron los logs del inventario
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getLogsFechaInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { fechaInicio, fechaFin } = req.params;
        const logs = await InventarioDAL.getLogsFechaInventario(fechaInicio, fechaFin);
        response.setSend(StatusCodes.OK, "Logs obtenidos correctamente", logs);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editProveedorInventario
 * @description Function to handle the edit proveedor inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/setProveedorInventario/{id}/{proveedor}/{codProveedor}:
 *   put:
 *     summary: Editar proveedor inventario
 *     description: Editar el proveedor del inventario
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: proveedor
 *         description: Nombre del proveedor
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: codProveedor
 *         description: Código del proveedor
 *         required: true
 *         schema: 
 *           type: number
 *     responses:
 *       201: 
 *         description: Producto actualizado correctamente
 *       204:
 *         description: No se encontró el producto
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editProveedorInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, proveedor, codProveedor } = req.params;
        const parseCoProveedor = parseInt(codProveedor as string);
        const inventario = await InventarioDAL.editProveedorInventario(id, proveedor, parseCoProveedor);
        response.setSend(StatusCodes.OK, "Proveedor editado correctamente", inventario);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editAlertaInventario
 * @description Function to handle the edit alerta inventario controller
 * @param {Request} req- Request of the API
 * @param {Response} res- Response of the API
 * @returns {Promise<void>} - Response of the API
 */
/**
 * @swagger
 * /inventario/setAlertaInventario/{id}/{alerta}:
 *   put:
 *     summary: Editar alerta inventario
 *     description: Editar la alerta del producto
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: alerta
 *         description: Alerta que se asigna al producto
 *         required: true
 *         schema: 
 *           type: boolean
 *     responses:
 *       201: 
 *         description: Producto actualizado correctamente
 *       204:
 *         description: No se encontró el producto
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editAlertaInventario = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, alerta } = req.params;
        const parseAlerta = alerta == "true" ? true : false;
        const inventario = await InventarioDAL.editAlertaInventario(id, parseAlerta);
        response.setSend(StatusCodes.OK, "Alerta editada correctamente", inventario);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})