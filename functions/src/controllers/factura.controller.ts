import FacturasDAL from "@data/facturas.data";
import asyncHandler from "@middlewares/async";
import Etiqueta from "@models/movimientos/etiqueta";
import EtiquetaCliente from "@models/movimientos/etiquetaCliente";
import HistorialReporte from "@models/movimientos/historialReporte";
import { mapData } from "@utils/data";
import ErrorResponse from "@utils/errorResponse";
import ResponseHTTP from "@utils/response";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * @function getFacturas
 * @description Function to handle the get facturas controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/:
 *   get:
 *     summary: Obtener la lista de todas las facturas
 *     description: Obtener la lista de todas las facturas
 *     tags:
 *       - Facturas
 *     responses:
 *       200: 
 *         description: Facturas obtenidas correctamente
 *       204:
 *         description: No se encontraron facturas
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getFacturas = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const facturas = await FacturasDAL.getFacturas();
        response.setSend(StatusCodes.OK, "Facturas obtenidos correctamente", facturas);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getFacturasAgrupadas
 * @description Function to handle the get facturas agrupadas controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/getFacturasAgrupadas:
 *   get:
 *     summary: Obtener la lista de todas las facturas agrupadas
 *     description: Obtener la lista de todas las facturas agrupadas
 *     tags:
 *       - Facturas
 *     responses:
 *       200: 
 *         description: Facturas agrupadas obtenidas correctamente
 *       204:
 *         description: No se encontraron facturas agrupadas
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getFacturasAgrupadas = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const facturas = await FacturasDAL.getFacturasAgrupadas();
        response.setSend(StatusCodes.OK, "Facturas obtenidos correctamente", facturas);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editEtiquetaFactura
 * @description Function to handle the edit etiqueta factura controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/{id}/setEtiquetaFactura:
 *   put:
 *     summary: Editar la etiqueta de la factura
 *     description: Editar la etiqueta de la factura
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la factura
 *         required: true
 *         schema: 
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etiqueta:
 *                 type: object
 *                 description: Etiqueta agregada a la factura
 *                 example: 
 *                   nombre: "Urgente"
 *                   color: "rojo"
 *     responses:
 *       201: 
 *         description: Factura actualizada correctamente
 *       204:
 *         description: No se encontró la factura
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editEtiquetaFactura = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, etiqueta } = req.params;
        const factura = await FacturasDAL.editEtiquetaFactura(id, { etiqueta: etiqueta});
        response.setSend(StatusCodes.OK, "Etiqueta editada correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function createEtiquetaFactura
 * @description Function to handle the create etiqueta factura controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/createEtiquetaFactura:
 *   post:
 *     summary: Crear una etiqueta
 *     description: Crear una etiqueta para una factura
 *     tags:
 *       - Facturas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la etiqueta
 *                 example: Bondeado
 *               color:
 *                 type: string
 *                 description: Color que llevará la etiqueta
 *                 example: "#0eddd0"
 *     responses:
 *       201:
 *         description: Etiqueta creada correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const createEtiquetaFactura = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const etq = mapData({
            ...req.body,
        }, Etiqueta)
        const factura = await FacturasDAL.createEtiquetaFactura(etq);
        response.setSend(StatusCodes.OK, "Etiqueta creada correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getEtiquetas
 * @description Function to handle the get etiqueta controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/getEtiquetas:
 *   get:
 *     summary: Obtener la lista de todas las etiquetas
 *     description: Obtener la lista de todas las etiquetas
 *     tags:
 *       - Facturas
 *     responses:
 *       200: 
 *         description: Etiquetas obtenidas correctamente
 *       204:
 *         description: No se encontraron las etiquetas
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getEtiquetas = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const etiquetas = await FacturasDAL.getEtiquetas();
        response.setSend(StatusCodes.OK, "Etiquetas obtenidas correctamente", etiquetas);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function uploadExcel
 * @description Function to handle the post upload excel controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/uploadExcel:
 *   post:
 *     summary: Cargar datos balanza MASP
 *     description: Cargar datos de la balanza de MASP
 *     tags:
 *       - Facturas
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
 *         description: Datos subidos correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const uploadExcel = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const upl = req.body;
        const factura = await FacturasDAL.uploadExcel(upl);
        response.setSend(StatusCodes.OK, "Factura subida correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function uploadExcelPST
 * @description Function to handle the post upload excel pst controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/uploadExcelPST:
 *   post:
 *     summary: Cargar datos balanza PST
 *     description: Cargar datos de la balanza de PST
 *     tags:
 *       - Facturas
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
 *         description: Datos subidos correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const uploadExcelPST = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const upl = req.body;
        const factura = await FacturasDAL.uploadExcelPST(upl);
        response.setSend(StatusCodes.OK, "Factura subida correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function dataEliminaciones
 * @description Function to handle the post data eliminaciones controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/dataEliminaciones:
 *   post:
 *     summary: Cargar datos eliminaciones
 *     description: Cargar datos de las eliminaciones
 *     tags:
 *       - Facturas
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
 *         description: Datos subidos correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const dataEliminaciones = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const elim = req.body;
        const factura = await FacturasDAL.dataEliminaciones(elim);
        response.setSend(StatusCodes.OK, "Eliminaciones subidos correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function dataEtiquetas
 * @description Function to handle the post data etiquetas controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/dataEtiquetas:
 *   post:
 *     summary: Cargar datos etiquetas
 *     description: Cargar datos de las etiquetas para los reportes
 *     tags:
 *       - Facturas
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
 *         description: Datos subidos correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const dataEtiquetas = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const etq = req.body;
        
        const factura = await FacturasDAL.dataEtiquetas(etq);
        response.setSend(StatusCodes.OK, "Etiquetas subidas correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function dataBG
 * @description Function to handle the post data BG controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/dataBG:
 *   post:
 *     summary: Cargar datos datos Balanza General 
 *     description: Cargar datos de la balanza General para los reportes
 *     tags:
 *       - Facturas
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
 *         description: Datos subidos correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const dataBG = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const bg = req.body;
        
        const factura = await FacturasDAL.dataBG(bg);
        response.setSend(StatusCodes.OK, "BG subidos correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function createLogReporte
 * @description Function to handle the create log reporte controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/createLogReporte:
 *   post:
 *     summary: Crear datos balanza MASP
 *     description: Cargar datos de la balanza de MASP
 *     tags:
 *       - Facturas
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
 *         description: Datos subidos correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const createLogReporte = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const log = mapData({
            ...req.body,
        }, HistorialReporte)
        const logR = await FacturasDAL.createLogReporte(log);
        response.setSend(StatusCodes.OK, "Log reporte creado correctamente", logR);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function datosReporteEstadoFlujoEfectivo
 * @description Function to handle the post datos reporte controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/datosReporteEstadoFlujoEfectivo:
 *   get:
 *     summary: Obtener la lista de todos los datos para el reporte
 *     description: Obtener la lista de todos los cálculos para el reporte
 *     tags:
 *       - Facturas
 *     responses:
 *       200: 
 *         description: Datos obtenidos correctamente
 *       204:
 *         description: No se encontraron datos
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const datosReporteEstadoFlujoEfectivo = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const reporte = await FacturasDAL.datosReporteEstadoFlujoEfectivo();
        response.setSend(StatusCodes.OK, "Datos obtenidos correctamente", reporte);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getLogsReportes
 * @description Function to handle the get log reporte controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/getLogsReporte:
 *   get:
 *     summary: Obtener la lista de todos los logs de los reportes
 *     description: Obtener la lista de todos los logs de los reportes
 *     tags:
 *       - Facturas
 *     responses:
 *       200: 
 *         description: Logs de reportes obtenidos correctamente
 *       204:
 *         description: No se encontraron Logs de reportes
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getLogsReportes = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const logs = await FacturasDAL.getLogsReportes();
        response.setSend(StatusCodes.OK, "Logs obtenidos correctamente", logs);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function editEtiquetaCliente
 * @description Function to handle the edit etiqueta cliente controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/setEtiquetaCliente:
 *   put:
 *     summary: Editar la etiqueta cliente del cliente
 *     description: Editar la etiqueta cliente del cliente para los reportes
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la factura
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: etiqueta
 *         description: Etiqueta agregada al cliente
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       201: 
 *         description: Factura actualizada correctamente
 *       204:
 *         description: No se encontró la factura
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const editEtiquetaCliente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const { id, etiqueta } = req.params;
        const factura = await FacturasDAL.editEtiquetaCliente(id, etiqueta);
        response.setSend(StatusCodes.OK, "Etiqueta cliente editada correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function createEtiquetaCliente
 * @description Function to handle the create etiqueta cliente controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/createEtiquetaCliente:
 *   post:
 *     summary: Crear una etiqueta cliente
 *     description: Crear una etiqueta cliente
 *     tags:
 *       - Facturas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la etiqueta
 *                 example: MORA MASP
 *               color:
 *                 type: string
 *                 description: Color que llevará la etiqueta
 *                 example: "#0eddd0"
 *     responses:
 *       201:
 *         description: Etiqueta creada correctamente
 *       400:
 *         description: Error en la solicitud
 *       422:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error en el servidor desconocido
 */
export const createEtiquetaCliente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const etq = mapData({
            ...req.body,
        }, EtiquetaCliente)
        const factura = await FacturasDAL.createEtiquetaCliente(etq);
        response.setSend(StatusCodes.OK, "Etiqueta cliente creada correctamente", factura);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})

/**
 * @function getEtiquetasCliente
 * @description Function to handle the get etiqueta cliente controller
 * @param {Request} req - Request of the API
 * @param {Response} res . Response of the API
 * @returns {Promise<void>} -Response of the API
 */
/**
 * @swagger
 * /facturas/getEtiquetasCliente:
 *   get:
 *     summary: Obtener la lista de todas las etiquetas de clientes
 *     description: Obtener la lista de todas las etiquetas de clientes
 *     tags:
 *       - Facturas
 *     responses:
 *       200: 
 *         description: Etiquetas de clientes obtenidas correctamente
 *       204:
 *         description: No se encontraron etiquetas de clientes
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const getEtiquetasCliente = asyncHandler(async (req: Request, res: Response) => {
    const response = new ResponseHTTP();
    try {
        const etiquetas = await FacturasDAL.getEtiquetasCliente();
        response.setSend(StatusCodes.OK, "Etiquetas cliente obtenidas correctamente", etiquetas);
        response.send(res);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        response.setSend(errorResponse.code || StatusCodes.INTERNAL_SERVER_ERROR, errorResponse.message, null);
        response.send(res);
    }
})