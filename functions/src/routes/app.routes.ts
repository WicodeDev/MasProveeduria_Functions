import { editMetaGlobalAgente, getAgentes } from "@controllers/personas/agente.controller";
import { editMetaCliente, getClientes, removeClienteAgente, setClienteAgente } from "@controllers/personas/cliente.controller";
import { editDiaEntregaProveedor, getProveedores } from "@controllers/personas/proveedor.controller";
import { getVentas, getVentasAgrupadas } from "@controllers/venta.controller";
import { deleteSeguimiento, editCantEntSeguimiento, editEstatusOrdenSeguimiento, editFacturaSeguimiento, editFolioControlSeguimiento, editVdEntrada, getBase, getBases, getSeguimiento, getSeguimientos, postBaseSeguimiento } from "@controllers/seguimiento.controller";
import { editAlertaInventario, editCantidadInventario, editConsumoInventario, editMinMaxInventario, editProveedorInventario, getInventario, getLogsFechaInventario, getLogsInventario, postLogInventario } from "@controllers/inventario.controller";
import { editAutorizacionOrdCompra, getOrdCompras } from "@controllers/ordCompra.controller";
import { createEtiquetaCliente, createEtiquetaFactura, createLogReporte, dataBG, dataEliminaciones, dataEtiquetas, datosReporteEstadoFlujoEfectivo, editEtiquetaCliente, editEtiquetaFactura, getEtiquetas, getEtiquetasCliente, getFacturas, getFacturasAgrupadas, getLogsReportes, uploadExcel, uploadExcelPST } from "@controllers/factura.controller";
import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { swaggerOptions } from "@swagger/app.doc";

const swaggerDoc = swaggerJSDoc(swaggerOptions);

const router = Router();
const agenteRouter = Router();
const clienteRouter = Router();
const proveedorRouter = Router();
const ventaRouter = Router();
const seguimientoRouter = Router();
const inventarioRouter = Router();
const ordComprasRouter = Router();
const facturasRouter = Router();

agenteRouter
    .get("/", getAgentes)
    .put("/setMeta/:id/:meta", editMetaGlobalAgente);
router.use("/agente", agenteRouter);

clienteRouter
    .get("/", getClientes)
    .put("/setMeta/:id/:meta", editMetaCliente)
    .put("/setClienteAgente/:id/codAgente", setClienteAgente)
    .put("/removeClienteAgente/:id", removeClienteAgente);
router.use("/cliente", clienteRouter);

proveedorRouter
    .get("/", getProveedores)
    .put("/setDiaEntrega/:id/:entrega", editDiaEntregaProveedor);
router.use("/proveedor", proveedorRouter);

ventaRouter
    .get("/", getVentas)
    .get("/ventasAgrupadas", getVentasAgrupadas);
router.use("/venta", ventaRouter);

seguimientoRouter
    .get("/", getSeguimientos)
    .get("/getSeguimiento", getSeguimiento)
    .delete("/deleteSeguimiento", deleteSeguimiento)
    .put("/setCantEntSeguimiento/:id/:cantidadEntregada", editCantEntSeguimiento)
    .put("/setFacturaSeguimiento/:id/:factura", editFacturaSeguimiento)
    .put("/setEstatusOrdenSegumiento/:id/:estatusOrden", editEstatusOrdenSeguimiento)
    .put("/setFolioControlSeguimiento/:id/:folioControl", editFolioControlSeguimiento)
    .post("/postBaseSeguimiento", postBaseSeguimiento)
    .get("/getBase", getBase)
    .get("/getBases", getBases)
    .put("/setVdEntrada", editVdEntrada);
router.use("/seguimiento", seguimientoRouter);

inventarioRouter
    .get("/", getInventario)
    .put("/setMinMaxInventario/:id/:min/:max", editMinMaxInventario)
    .put("/setConsumoInventario/:id/:consumo", editConsumoInventario)
    .put("/setCantidadInventario/:id/:cantidad", editCantidadInventario)
    .post("/postLogInventario", postLogInventario)
    .get("/getLogsInventario", getLogsInventario)
    .get("/getLogsFechaInventario/:fechaInicio/:fechaFin", getLogsFechaInventario)
    .put("/setProveedorInventario/:id/:proveedor/:codProveedor", editProveedorInventario)
    .put("/setAlertaInventario/:id/:alerta", editAlertaInventario);
router.use("/inventario", inventarioRouter);

ordComprasRouter
    .get("/", getOrdCompras)
    .put("/setAutorizacionOrdCompra/:id/:autorizacion", editAutorizacionOrdCompra);
router.use("/ordCompra", ordComprasRouter);

facturasRouter
    .get("/", getFacturas)
    .get("/getFacturasAgrupdas", getFacturasAgrupadas)
    .put("/setEtiquetaFactura/:id/:etiqueta", editEtiquetaFactura)
    .post("/createEtiquetaFactura", createEtiquetaFactura)
    .get("/getEtiquetas", getEtiquetas)
    .post("/uploadExcel", uploadExcel)
    .post("/uploadExcelPST", uploadExcelPST)
    .post("/dataEliminaciones", dataEliminaciones)
    .post("/dataEtiquetas", dataEtiquetas)
    .post("/dataBG", dataBG)
    .post("/createLogReporte", createLogReporte)
    .get("/datosReporteEstadoFlujoEfectivo", datosReporteEstadoFlujoEfectivo)
    .get("/getLogsReporte", getLogsReportes)
    .put("/setEtiquetaCliente/:id/:etiqueta", editEtiquetaCliente)
    .post("/createEtiquetaCliente", createEtiquetaCliente)
    .get("/getEtiquetasCliente", getEtiquetasCliente);
router.use("/facturas", facturasRouter);

router.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

export default router;