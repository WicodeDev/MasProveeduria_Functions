import Etiqueta from "@models/movimientos/etiqueta";
import Facturas from "@models/movimientos/facturas";
import ErrorResponse from "@utils/errorResponse";
import { getRepository } from "fireorm";

import * as ExcelJS from 'exceljs';
import { storage } from "../config/firebase.config";
import { dataCombinado, dataFinal, dataMASBG, dataPSTBG, datosAgrupadosReporte, groupFacturasByReferencia } from "@utils/movimientos";
import HistorialReporte from "@models/movimientos/historialReporte";
import EtiquetaCliente from "@models/movimientos/etiquetaCliente";
import Cliente from "@models/personas/clientes";

/**
 * Data access Layer for Facturas
 */


export default class FacturasDAL{

    /**
     * GET Facturas
     * @returns List of Facturas
     */
    static async getFacturas(): Promise<Facturas[]>{
        try {
            const facturasRepo = getRepository(Facturas);
            const facturasList = await facturasRepo.find();
            if(facturasList.length == 0){
                throw new ErrorResponse("No se encontro ninguna factura", 204);
            }
            return facturasList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las facturas", errorResponse.code || 500);
        }
    }

    

    /**
     * GET Facturas Agrupadas
     * @returns List of Facturas Agrupadas
     */
    static async getFacturasAgrupadas(): Promise<any[]>{
        try {
            const facturasRepo = getRepository(Facturas);
            const facturasList = await facturasRepo.find();
            if(facturasList.length == 0){
                throw new ErrorResponse("No se encontro ninguna factura", 204);
            }
            return groupFacturasByReferencia(facturasList);
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las facturas", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE etiqueta Facturas
     * @Params id Factura id
     * @Params etiqueta to asign
     * @returns Factura edit
     */
    static async editEtiquetaFactura(id: string, etiqueta: object): Promise<Facturas> {
        try {
            const facturaRepo = getRepository(Facturas);
            const facturaExists = await facturaRepo.findById(id);
            if(!facturaExists){
                throw new ErrorResponse(`No se encontro ninguna factura con el id: ${id} `, 204);
            }
            const facturaEdited = await facturaRepo.update({...facturaExists, etiqueta: etiqueta})
            return facturaEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar la factura", errorResponse.code || 500);
        }
    }

    /**
     *  CREATE etiqueta Etiqueta
     * @Params etiqueta Etiqueta
     * @returns new Etiqueta
     */
    static async createEtiquetaFactura(etiqueta: Etiqueta): Promise<Etiqueta> {
        try {
            const etiquetaRepo = getRepository(Etiqueta);
            const newEtiqueta = await etiquetaRepo.create(etiqueta);
            return newEtiqueta;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al crear la factura", errorResponse.code || 500);
        }
    }

    /**
     * GET Etiquetas
     * @returns List of Etiquetas
     */
    static async getEtiquetas(): Promise<Etiqueta[]>{
        try {
            const etiquetaRepo = getRepository(Etiqueta);
            const etiquetasList = await etiquetaRepo.find();
            if(etiquetasList.length == 0){
                throw new ErrorResponse("No se encontro ninguna etiqueta", 204);
            }
            return etiquetasList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las etiquetas", errorResponse.code || 500);
        }
    }

    /**
     * POST upload excel
     * @Params keyFile
     * @returns respuesta
     */
    static async uploadExcel(keyFile: string): Promise<any> {
        try{
            const file = storage.bucket().file(keyFile);

            if(!file){
                throw new ErrorResponse("No se ha encontrado el archivo", 400);
             }
     
             if(!file.name.includes(".xlsx")){
                 throw new ErrorResponse("El archivo no es un archivo de excel", 400);
             }

            const data = await file.download();
            const buffer = data[0];

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);        

            if(!worksheet){
                throw new ErrorResponse("No se ha encontrado la hoja de ", 400);
            }              
            
            // Declaración de Variables Estado de Resultados MASP
            let VENTAS_PERIODO = 0;
            let VENTAS_EJERCICIO = 0;
            let VENTAS_DE_ACTIVOS_PERIODO = 0;
            let VENTAS_DE_ACTIVOS_EJERCICIO = 0;
            let DEVOL_Y_DESCUENTOS_PERIODO = 0;
            let DEVOL_Y_DESCUENTOS_EJERCICIO = 0;
            let VENTAS_NETAS_PERIODO = 0;
            let VENTAS_NETAS_EJERCICIO = 0;

            let COMPRAS_PERIODO = 0;
            let COMPRAS_EJERCICIO = 0;
            let DEV_DESCTO_Y_BONIF_S_COMPRA_PERIODO = 0;
            let DEV_DESCTO_Y_BONIF_S_COMPRA_EJERCICIO = 0;
            let GASTOS_SOBRE_COMPRA_IMPORTACION_PERIODO = 0;
            let GASTOS_SOBRE_COMPRA_IMPORTACION_EJERCICIO = 0;
            let COSTO_DE_VENTAS_PERIODO = 0;
            let COSTO_DE_VENTAS_EJERCICIO = 0;

            let  UTILIDAD_BRUTA_PERIODO = 0;
            let  UTILIDAD_BRUTA_EJERCICIO = 0;

            let GASTOS_DE_ADMINISTRACION_PERIODO = 0;
            let GASTOS_DE_ADMINISTRACION_EJERCICIO = 0;
            let GASTOS_DE_VENTA_PERIODO = 0;
            let GASTOS_DE_VENTA_EJERCICIO = 0;
            let GASTOS_DE_LOGISTICA_PERIODO = 0;
            let GASTOS_DE_LOGISTICA_EJERCICIO = 0;
            let GASTOS_DE_DIRECCION_PERIODO = 0;
            let GASTOS_DE_DIRECCION_EJERCICIO = 0;

            let GASTOS_DE_ADMON_Y_VTA_PERIODO = 0;
            let GASTOS_DE_ADMON_Y_VTA_EJERCICIO = 0;

            let DEPRECIACION_CONTABLE_PERIODO = 0;
            let DEPRECIACION_CONTABLE_EJERCICIO = 0;

            let UTILIDAD_DE_OPERACION_PERIODO = 0;
            let UTILIDAD_DE_OPERACION_EJERCICIO = 0;

            let GASTOS_FINANCIEROS_PERIODO = 0;
            let GASTOS_FINANCIEROS_EJERCICIO = 0;
            let PERDIDA_FINANCIERA_PERIODO = 0;
            let PERDIDA_FINANCIERA_EJERCICIO = 0;
            let COSTOS_INTEGRAL_FINANCIERO_PERIODO = 0;
            let COSTOS_INTEGRAL_FINANCIERO_EJERCICIO = 0;
            let OTROS_INGRESOS_PERIODO = 0;
            let OTROS_INGRESOS_EJERCICIO = 0;
            let foundOtrosIngresosMASP = false;

            let UTILIDAD_ANTES_DE_ISR_Y_PTU_PERIODO = 0;
            let UTILIDAD_ANTES_DE_ISR_Y_PTU_EJERCICIO = 0;

            // VARIABLES PARA LOS AJUSTES DE NOMINA DE LAS ELIMINACIONES
            let SUELDOS_ADMON = 0;

            // VARIABLES PARA EL BALANCE GENERAL
            let CAJA = 0;
            let BANCOS = 0;
            let CLIENTES = 0;
            let PROVISION_CUENTAS_INCOBRABLES = 0;
            let CTAS_COBRAR_FILIALES = 0;
            let DOCUMENTOS_POR_COBRAR = 0;
            let DEUDORES_DIVERSOS = 0;
            let ALMACEN_GENERAL_MPR = 0;
            let PAGOS_ANTICIPADOS = 0;
            let IVA_ACREDITABLE = 0;
            let IVA_POR_ACREEDITAR = 0;
            let SUBSIDIO_AL_EMPLEO = 0;
            let IMPUESTOS_PAGADOS_POR_ANTICIPADO = 0;
            let SUMA_ACTIVO_CIRCUALANTE = 0;
            let foundProvisionCuentasIncobrables = false;

            // PARTE FIJO DEL BALANCE GENERAL
            let MOBILIARIO_Y_EQUIPO = 0;
            let ACUMULADO_DEP_MOB = 0;
            let EQUIPO_DE_COMPUTO = 0;
            let DEP_ACUM_EQ_COMPUTO = 0;
            let EQUIPO_DE_REPARTO = 0;
            let DEP_ACUM_EQ_REPARTO = 0;
            let MOBILIARIO_Y_EQUIPO_ALMACEN = 0;
            let DEP_ACUM_EQ_ALMACEN = 0;
            let ALARMA_Y_EQ_SEGURIDAD = 0;
            let DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD = 0;
            let MAQUINARIA_ARRENDAMIENTO = 0;
            let ACUM_MAQUINARIA_ARRENDAMIENTO = 0;
            let DEP_ACUM_MAQUINARIA_Y_EQUIPO = 0;
            let SUMA_ACTIVO_FIJO = 0;

            // PARTE DIFERIDO DEL BALANCE GENERAL
            let GASTOS_DE_INSTALACION = 0;
            let AMORTI_ACUM_GTS_INSTALACION = 0;
            let DEPOSITOS_GARANTIA = 0;
            let SUMA_ACTIVO_DIFERIDO = 0;

            // PARTE PASIVO CORTO PLAZO DEL BALANCE GENERAL
            let PROVEEDORES = 0;
            let ACREEDORES_DIVERSOS = 0;
            let CUENTAS_PAGAR_FILIALES_OP = 0;
            let IVA_TRASLADADO = 0;
            let IVA_POR_TRASLADAR = 0;
            let IMPUESTOS_RETENIDOS = 0;
            let IMPUESTOS_PROPIOS = 0;
            let SUMA_PASIVO_CORTO_PLAZO = 0;

            // PARTE PASIVO LARGO PLAZO DEL BALANCE GENERAL
            let CREDITOS_BANCARIOS = 0;
            let SUMA_PASIVO_LARGO_PLAZO = 0;

            // PARTE CAPITAL DEL BALANCE GENERAL
            let CAPITAL_SOCIAL_FIJO = 0;
            let CAPITAL_SOCIAL_VARIABLE = 0;
            let RESERVA_LEGAL = 0;
            let RESULTADO_DE_EJERCICIOS_ANTERIORES = 0;
            let RESULTADO_DEL_EJERCICIO_REPORT = 0;
            let RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL = 0;
            let RESULTADO_DEL_EJERCICIO = 0;
            let SUPERAVIT_DEFICIT_ACT_CAPITAL = 0;
            let CAPITAL_CONTABLE = 0;

            // ESTADOS DE RESULTADOS DE MASP
            const rowValues = worksheet.getRow(3).values;
            let FECHA; 

            if (Array.isArray(rowValues)) {
                // Si es un array, acceder al índice 1
                FECHA = rowValues[1];
            } else if (typeof rowValues === 'object') {
                // Si es un objeto, acceder a la propiedad '1'
                FECHA = rowValues[1];
            }

            for (let rowNumber = 7; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);

                
                // Verifica si la fila existe y tiene valores
                if (row && row.values && Array.isArray(row.values) && row.values.length > 0) {
                    const rowValues = row.values;
                    // Declaración de Targets
                    const targetVentas = 'VENTAS';
                    const targetVentasActivos = 'VENTAS DE ACTIVOS';
                    const targetDevolYDesc = 'DESCTO.BONIFICA. Y DEVOLUCION S/VENTA';

                    const targetCompras = 'COMPRAS';
                    const targetDevDesctoYBonifc = 'DEV. DESCTO. Y BONIF. S/COMPRA';
                    const targetGastos = 'GASTOS SOBRE COMPRA IMPORTACION';
    
                    const targetGastosAdm = 'GASTOS DE ADMINISTRACION';
                    const targetGastosVenta = 'GASTOS DE VENTA';
                    const targetGatosLogistica = 'GASTOS DE LOGISTICA';
                    const targetGastosDireccion = 'GASTOS de DIRECCIÓN';

                    const targetDepreciacionContable = 'DEPRECIACION CONTABLE';

                    const targetGastosFinancieros = 'GASTOS FINANCIEROS';
                    const targetPerdidaFinanciera = 'PERDIDA FINANCIERA';
                    const targetOtrosIngresos = 'OTROS INGRESOS';

                    // Targets para los ajustes de nomina de las eliminaciones
                    const targetSueldosAdmon = 'SUELDOS ADMON';

                    // Targets para el balance general
                    const targetCaja = 'CAJA';
                    const targetBancos = 'BANCOS';
                    const targetClientes = 'CLIENTES';
                    const targetProvisionCuentasIncobrables = 'PROVISION PARA CUENTAS INCOBRABLES';
                    const targetCtasCobrarFiliales = 'CTAS. X COBRAR  FILIALES OP.';
                    const targetDocumentosPorCobrar = 'DOCUMENTOS POR COBRAR';
                    const targetDeudoresDiversos = 'DEUDORES DIVERSOS';
                    const targetAlmacenGeneralMPR = 'ALMACEN GENERAL MPR';
                    const targetPagosAnticipados = 'PAGOS ANTICIPADOS';
                    const targetIvaAcreditable = 'IVA ACREDITABLE';
                    const targetIvaPorAcreditar = 'IVA POR ACREEDITAR';
                    const targetSubsidioAlEmpleo = 'SUBSIDIO AL EMPLEO';
                    const targetImpuestosPagadosPorAnticipado = 'IMPUESTOS PAGADOS POR ANTICIPADO';

                    // Targets para el balance general parte fija
                    const targetMobiliarioYEquipo = 'MOBILIARIO Y EQUIPO DE OFICINA MAS';
                    const targetAcumDepMob = 'ACUMULADO DEP. MOB. Y EQ. DE OFICINA';
                    const targetEquipoDeComputo = 'EQUIPO DE COMPUTO MPR';
                    const targetDepAcumEqComputo = 'DEP. ACUM. EQ. DE COMPUTO';
                    const targetEquipoDeReparto = 'EQUIPO DE REPARTO MPR';
                    const targetDepAcumEqReparto = 'DEP. ACUM. DE EQ. DE REPARTO';
                    const targetMobiliarioYEquipoAlmacen = 'MOBILIARIO Y EQUIPO DE ALMACEN MPR';
                    const targetDepAcumEqAlmacen = 'DEP. ACUM. DE EQ. Y MOB. DE ALMACEN';
                    const targetAlarmaYEqSeguridad = 'ALARMA Y EQ. DE SEGURIDAD MPR';
                    const targetDepAcumAlarmaYEqSeguridad = 'DEP. ACUM. DE ALARMA Y EQ. DE SEGURIDAD';
                    const targetMaquinariaArrendamiento = 'MAQUINARIA PARA ARRENDAMIENTO MPR';
                    const targetAcumMaquinariaArrendamiento = 'ACUM. DEP. MAQUINARIA ARRENDAMIENTO';
                    const targetDepAcumMaquinariaYEquipo = 'DEP. ACUM. DEP. MAQUINARIA Y EQUIPO';

                    // Targets para el balance general parte diferido
                    const targetGastosDeInstalacion = 'GASTOS DE INSTALACION';
                    const targetAmortiAcumGtsInstalacion = 'AMORTI. ACUM. GTS DE INSTALACION';
                    const targetDepositosGarantia = 'DEPOSITOS EN GARANTIA';

                    // Targets para el balance general parte pasivo corto plazo
                    const targetProveedores = 'PROVEEDORES';
                    const targetAcreedoresDiversos = 'ACREEDORES DIVERSOS';
                    const targetCtasPagarFilialesOp = 'CTAS. X PAGAR FILIALES OP.';
                    const targetIvaTrasladado = 'IVA TRASLADADO';
                    const targetIvaPorTrasladar = 'IVA POR TRASLADAR';
                    const targetImpuestosRetenidos = 'IMPUESTOS RETENIDOS';
                    const targetImpuestosPropios = 'IMPUESTOS PROPIOS (CUOTA PATRONAL)';

                    // Targets para el balance general parte pasivo largo plazo
                    const targetCreditosBancarios = 'CREDITOS BANCARIOS';

                    // Targets para el balance general parte capital
                    const targetCapitalSocialFijo = 'CAPITAL SOCIAL FIJO';
                    const targetCapitalSocialVariable = 'CAPITAL SOCIAL VARIABLE';
                    const targetReservaLegal = 'RESERVA LEGAL';
                    const targetResultadoDeEjerciciosAnteriores = 'RESULTADO DE EJERCICOS ANTERIORES';
                    const targetResultadoDelEjercicioReport = 'RESULTADO DEL EJERCICIO';
                    const targetSuperavitDeficitActCapital = 'Superavit(+) / Déficit (-) en Act. de Capital ';

                    // Declaración de Index
                    const indexVentas = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetVentas.trim());
                    const indexVentasActivos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetVentasActivos.trim());
                    const indexDevolYDesc = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDevolYDesc.trim());
                    
                    const indexCompras = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCompras.trim());
                    const indexDevDesctoYBonifc = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDevDesctoYBonifc.trim());
                    const indexGastos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastos.trim());

                    const indexGastosAdm = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosAdm.trim());
                    const indexGastosVenta = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosVenta.trim());
                    const indexGatosLogistica = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGatosLogistica.trim());
                    const indexGastosDireccion = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosDireccion.trim());

                    const indexDepreciacionContable = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepreciacionContable.trim());

                    const indexGastosFinancieros = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosFinancieros.trim());
                    const indexPerdidaFinanciera = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetPerdidaFinanciera.trim());
                    const indexOtrosIngresos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetOtrosIngresos.trim());

                    // Index para los ajustes de nomina de las eliminaciones
                    const indexSueldosAdmon = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosAdmon.trim());

                    // Index para el balance general
                    const indexCaja = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCaja.trim());
                    const indexBancos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetBancos.trim());
                    const indexClientes = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetClientes.trim());
                    const indexProvisionCuentasIncobrables = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetProvisionCuentasIncobrables.trim());
                    const indexCtasCobrarFiliales = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCtasCobrarFiliales.trim());
                    const indexDocumentosPorCobrar = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDocumentosPorCobrar.trim());
                    const indexDeudoresDiversos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDeudoresDiversos.trim());
                    const indexAlmacenGeneralMPR = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAlmacenGeneralMPR.trim());
                    const indexPagosAnticipados = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetPagosAnticipados.trim());
                    const indexIvaAcreditable = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaAcreditable.trim());
                    const indexIvaPorAcreditar = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaPorAcreditar.trim());
                    const indexSubsidioAlEmpleo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSubsidioAlEmpleo.trim());
                    const indexImpuestosPagadosPorAnticipado = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetImpuestosPagadosPorAnticipado.trim());

                    // Index para el balance general parte fija
                    const indexMobiliarioYEquipo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMobiliarioYEquipo.trim());
                    const indexAcumDepMob = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAcumDepMob.trim());
                    const indexEquipoDeComputo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetEquipoDeComputo.trim());
                    const indexDepAcumEqComputo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumEqComputo.trim());
                    const indexEquipoDeReparto = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetEquipoDeReparto.trim());
                    const indexDepAcumEqReparto = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumEqReparto.trim());
                    const indexMobiliarioYEquipoAlmacen = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMobiliarioYEquipoAlmacen.trim());
                    const indexDepAcumEqAlmacen = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumEqAlmacen.trim());
                    const indexAlarmaYEqSeguridad = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAlarmaYEqSeguridad.trim());
                    const indexDepAcumAlarmaYEqSeguridad = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumAlarmaYEqSeguridad.trim());
                    const indexMaquinariaArrendamiento = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMaquinariaArrendamiento.trim());
                    const indexAcumMaquinariaArrendamiento = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAcumMaquinariaArrendamiento.trim());
                    const indexDepAcumMaquinariaYEquipo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumMaquinariaYEquipo.trim());

                    // Index para el balance general parte diferido
                    const indexGastosDeInstalacion = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosDeInstalacion.trim());
                    const indexAmortiAcumGtsInstalacion = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAmortiAcumGtsInstalacion.trim());
                    const indexDepositosGarantia = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepositosGarantia.trim());

                    // Index para el balance general parte pasivo corto plazo
                    const indexProveedores = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetProveedores.trim());
                    const indexAcreedoresDiversos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAcreedoresDiversos.trim());
                    const indexCtasPagarFilialesOp = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCtasPagarFilialesOp.trim());
                    const indexIvaTrasladado = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaTrasladado.trim());
                    const indexIvaPorTrasladar = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaPorTrasladar.trim());
                    const indexImpuestosRetenidos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetImpuestosRetenidos.trim());
                    const indexImpuestosPropios = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetImpuestosPropios.trim());

                    // Index para el balance general parte pasivo largo plazo
                    const indexCreditosBancarios = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCreditosBancarios.trim());

                    // Index para el balance general parte capital
                    const indexCapitalSocialFijo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCapitalSocialFijo.trim());
                    const indexCapitalSocialVariable = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCapitalSocialVariable.trim());
                    const indexReservaLegal = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetReservaLegal.trim());
                    const indexResultadoDeEjerciciosAnteriores = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetResultadoDeEjerciciosAnteriores.trim());
                    const indexResultadoDelEjercicioReport = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetResultadoDelEjercicioReport.trim());
                    const indexSuperavitDeficitActCapital = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSuperavitDeficitActCapital.trim());

                    
                    if (indexVentas !== -1 && indexVentas < rowValues.length - 1) {
                        const correspondingValue = rowValues.slice(indexVentas);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        VENTAS_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                        VENTAS_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                    }
                    if(indexVentasActivos !== -1 && indexVentasActivos < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexVentasActivos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        VENTAS_DE_ACTIVOS_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                        VENTAS_DE_ACTIVOS_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexDevolYDesc !== -1 && indexDevolYDesc < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDevolYDesc);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEVOL_Y_DESCUENTOS_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        DEVOL_Y_DESCUENTOS_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    VENTAS_NETAS_PERIODO = parseFloat((VENTAS_PERIODO! - VENTAS_DE_ACTIVOS_PERIODO! - DEVOL_Y_DESCUENTOS_PERIODO!).toFixed(2));
                    VENTAS_NETAS_EJERCICIO = parseFloat((VENTAS_EJERCICIO! - VENTAS_DE_ACTIVOS_EJERCICIO! - DEVOL_Y_DESCUENTOS_EJERCICIO!).toFixed(2));

                    if(indexCompras !== -1 && indexCompras < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCompras);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        COMPRAS_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        COMPRAS_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDevDesctoYBonifc !== -1 && indexDevDesctoYBonifc < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDevDesctoYBonifc);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEV_DESCTO_Y_BONIF_S_COMPRA_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        DEV_DESCTO_Y_BONIF_S_COMPRA_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexGastos !== -1 && indexGastos < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGastos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_SOBRE_COMPRA_IMPORTACION_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        GASTOS_SOBRE_COMPRA_IMPORTACION_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    COSTO_DE_VENTAS_PERIODO = parseFloat((COMPRAS_PERIODO! - DEV_DESCTO_Y_BONIF_S_COMPRA_PERIODO! + GASTOS_SOBRE_COMPRA_IMPORTACION_PERIODO!).toFixed(2));
                    COSTO_DE_VENTAS_EJERCICIO = parseFloat((COMPRAS_EJERCICIO! - DEV_DESCTO_Y_BONIF_S_COMPRA_EJERCICIO! + GASTOS_SOBRE_COMPRA_IMPORTACION_EJERCICIO!).toFixed(2));

                    UTILIDAD_BRUTA_PERIODO = parseFloat((VENTAS_NETAS_PERIODO! - COSTO_DE_VENTAS_PERIODO!).toFixed(2));
                    UTILIDAD_BRUTA_EJERCICIO = parseFloat((VENTAS_NETAS_EJERCICIO! - COSTO_DE_VENTAS_EJERCICIO!).toFixed(2));

                    if(indexGastosAdm !== -1 && indexGastosAdm < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGastosAdm);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_DE_ADMINISTRACION_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        GASTOS_DE_ADMINISTRACION_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexGastosVenta !== -1 && indexGastosVenta < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGastosVenta);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_DE_VENTA_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        GASTOS_DE_VENTA_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexGatosLogistica !== -1 && indexGatosLogistica < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGatosLogistica);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_DE_LOGISTICA_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        GASTOS_DE_LOGISTICA_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexGastosDireccion !== -1 && indexGastosDireccion < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGastosDireccion);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_DE_DIRECCION_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        GASTOS_DE_DIRECCION_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    GASTOS_DE_ADMON_Y_VTA_PERIODO = parseFloat((GASTOS_DE_ADMINISTRACION_PERIODO! + GASTOS_DE_VENTA_PERIODO! + GASTOS_DE_LOGISTICA_PERIODO! + GASTOS_DE_DIRECCION_PERIODO!).toFixed(2));
                    GASTOS_DE_ADMON_Y_VTA_EJERCICIO = parseFloat((GASTOS_DE_ADMINISTRACION_EJERCICIO! + GASTOS_DE_VENTA_EJERCICIO! + GASTOS_DE_LOGISTICA_EJERCICIO! + GASTOS_DE_DIRECCION_EJERCICIO!).toFixed(2));

                    if(indexDepreciacionContable !== -1 && indexDepreciacionContable < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepreciacionContable);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEPRECIACION_CONTABLE_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        DEPRECIACION_CONTABLE_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    UTILIDAD_DE_OPERACION_PERIODO = parseFloat((UTILIDAD_BRUTA_PERIODO! - GASTOS_DE_ADMON_Y_VTA_PERIODO! - DEPRECIACION_CONTABLE_PERIODO!).toFixed(2));
                    UTILIDAD_DE_OPERACION_EJERCICIO = parseFloat((UTILIDAD_BRUTA_EJERCICIO! - GASTOS_DE_ADMON_Y_VTA_EJERCICIO! - DEPRECIACION_CONTABLE_EJERCICIO!).toFixed(2));

                    if(indexGastosFinancieros !== -1 && indexGastosFinancieros < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGastosFinancieros);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_FINANCIEROS_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        GASTOS_FINANCIEROS_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                        const haberM = parseFloat(filteredValues[4]?.toString() || '0');
                        if(haberM > 0){
                            GASTOS_FINANCIEROS_PERIODO = GASTOS_FINANCIEROS_PERIODO - haberM;
                        }
                    }

                    if(indexPerdidaFinanciera !== -1 && indexPerdidaFinanciera < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexPerdidaFinanciera);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        PERDIDA_FINANCIERA_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                        PERDIDA_FINANCIERA_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    COSTOS_INTEGRAL_FINANCIERO_PERIODO = parseFloat((GASTOS_FINANCIEROS_PERIODO! + PERDIDA_FINANCIERA_PERIODO!).toFixed(2));
                    COSTOS_INTEGRAL_FINANCIERO_EJERCICIO = parseFloat((GASTOS_FINANCIEROS_EJERCICIO! + PERDIDA_FINANCIERA_EJERCICIO!).toFixed(2));

                    if(indexOtrosIngresos !== -1 && indexOtrosIngresos < rowValues.length - 1 && !foundOtrosIngresosMASP){
                        const correspondingValue = rowValues.slice(indexOtrosIngresos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        OTROS_INGRESOS_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                        OTROS_INGRESOS_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                        foundOtrosIngresosMASP = true;
                    }

                    UTILIDAD_ANTES_DE_ISR_Y_PTU_PERIODO = parseFloat((UTILIDAD_DE_OPERACION_PERIODO! - COSTOS_INTEGRAL_FINANCIERO_PERIODO + OTROS_INGRESOS_PERIODO!).toFixed(2));
                    UTILIDAD_ANTES_DE_ISR_Y_PTU_EJERCICIO = parseFloat((UTILIDAD_DE_OPERACION_EJERCICIO! - COSTOS_INTEGRAL_FINANCIERO_EJERCICIO + OTROS_INGRESOS_EJERCICIO!).toFixed(2));

                    if(indexSueldosAdmon !== -1 && indexSueldosAdmon < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexSueldosAdmon);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        SUELDOS_ADMON = parseFloat(filteredValues[3]?.toString() || '0');
                    }

                    // BALANCE GENERAL
                    if(indexCaja !== -1 && indexCaja < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCaja);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CAJA = parseFloat(filteredValues[5]?.toString() || '0');
                    }



                    if(indexBancos !== -1 && indexBancos < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexBancos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        BANCOS = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexProvisionCuentasIncobrables !== -1 && indexProvisionCuentasIncobrables < rowValues.length - 1 && !foundProvisionCuentasIncobrables){
                        const correspondingValue = rowValues.slice(indexProvisionCuentasIncobrables);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        PROVISION_CUENTAS_INCOBRABLES = parseFloat(filteredValues[5]?.toString() || '0');
                        foundProvisionCuentasIncobrables = true;
                    }

                    if(indexClientes !== -1 && indexClientes < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexClientes);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CLIENTES = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexCtasCobrarFiliales !== -1 && indexCtasCobrarFiliales < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCtasCobrarFiliales);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CTAS_COBRAR_FILIALES = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDocumentosPorCobrar !== -1 && indexDocumentosPorCobrar < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDocumentosPorCobrar);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DOCUMENTOS_POR_COBRAR = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDeudoresDiversos !== -1 && indexDeudoresDiversos < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDeudoresDiversos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEUDORES_DIVERSOS = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexAlmacenGeneralMPR !== -1 && indexAlmacenGeneralMPR < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexAlmacenGeneralMPR);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        ALMACEN_GENERAL_MPR = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexPagosAnticipados !== -1 && indexPagosAnticipados < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexPagosAnticipados);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        PAGOS_ANTICIPADOS = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexIvaAcreditable !== -1 && indexIvaAcreditable < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexIvaAcreditable);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IVA_ACREDITABLE = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexIvaPorAcreditar !== -1 && indexIvaPorAcreditar < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexIvaPorAcreditar);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IVA_POR_ACREEDITAR = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexSubsidioAlEmpleo !== -1 && indexSubsidioAlEmpleo < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexSubsidioAlEmpleo);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        SUBSIDIO_AL_EMPLEO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexImpuestosPagadosPorAnticipado !== -1 && indexImpuestosPagadosPorAnticipado < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexImpuestosPagadosPorAnticipado);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IMPUESTOS_PAGADOS_POR_ANTICIPADO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    // BALANCE GENERAL PARTE FIJA
                    if(indexMobiliarioYEquipo !== -1 && indexMobiliarioYEquipo < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexMobiliarioYEquipo);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        MOBILIARIO_Y_EQUIPO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexAcumDepMob !== -1 && indexAcumDepMob < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexAcumDepMob);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        ACUMULADO_DEP_MOB = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexEquipoDeComputo !== -1 && indexEquipoDeComputo < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexEquipoDeComputo);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        EQUIPO_DE_COMPUTO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDepAcumEqComputo !== -1 && indexDepAcumEqComputo < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepAcumEqComputo);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEP_ACUM_EQ_COMPUTO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexEquipoDeReparto !== -1 && indexEquipoDeReparto < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexEquipoDeReparto);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        EQUIPO_DE_REPARTO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDepAcumEqReparto !== -1 && indexDepAcumEqReparto < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepAcumEqReparto);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEP_ACUM_EQ_REPARTO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexMobiliarioYEquipoAlmacen !== -1 && indexMobiliarioYEquipoAlmacen < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexMobiliarioYEquipoAlmacen);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        MOBILIARIO_Y_EQUIPO_ALMACEN = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDepAcumEqAlmacen !== -1 && indexDepAcumEqAlmacen < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepAcumEqAlmacen);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEP_ACUM_EQ_ALMACEN = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexAlarmaYEqSeguridad !== -1 && indexAlarmaYEqSeguridad < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexAlarmaYEqSeguridad);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        ALARMA_Y_EQ_SEGURIDAD = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDepAcumAlarmaYEqSeguridad !== -1 && indexDepAcumAlarmaYEqSeguridad < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepAcumAlarmaYEqSeguridad);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexMaquinariaArrendamiento !== -1 && indexMaquinariaArrendamiento < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexMaquinariaArrendamiento);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        MAQUINARIA_ARRENDAMIENTO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexAcumMaquinariaArrendamiento !== -1 && indexAcumMaquinariaArrendamiento < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexAcumMaquinariaArrendamiento);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        ACUM_MAQUINARIA_ARRENDAMIENTO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDepAcumMaquinariaYEquipo !== -1 && indexDepAcumMaquinariaYEquipo < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepAcumMaquinariaYEquipo);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEP_ACUM_MAQUINARIA_Y_EQUIPO = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    // BALANCE GENERAL PARTE DIFERIDO
                    if(indexGastosDeInstalacion !== -1 && indexGastosDeInstalacion < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexGastosDeInstalacion);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        GASTOS_DE_INSTALACION = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexAmortiAcumGtsInstalacion !== -1 && indexAmortiAcumGtsInstalacion < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexAmortiAcumGtsInstalacion);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        AMORTI_ACUM_GTS_INSTALACION = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    if(indexDepositosGarantia !== -1 && indexDepositosGarantia < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexDepositosGarantia);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        DEPOSITOS_GARANTIA = parseFloat(filteredValues[5]?.toString() || '0');
                    }

                    // BALANCE GENERAL PARTE PASIVO CORTO PLAZO
                    if(indexProveedores !== -1 && indexProveedores < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexProveedores);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        PROVEEDORES = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexAcreedoresDiversos !== -1 && indexAcreedoresDiversos < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexAcreedoresDiversos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        ACREEDORES_DIVERSOS = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexCtasPagarFilialesOp !== -1 && indexCtasPagarFilialesOp < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCtasPagarFilialesOp);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CUENTAS_PAGAR_FILIALES_OP = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexIvaTrasladado !== -1 && indexIvaTrasladado < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexIvaTrasladado);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IVA_TRASLADADO = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexIvaPorTrasladar !== -1 && indexIvaPorTrasladar < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexIvaPorTrasladar);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IVA_POR_TRASLADAR = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexImpuestosRetenidos !== -1 && indexImpuestosRetenidos < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexImpuestosRetenidos);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IMPUESTOS_RETENIDOS = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexImpuestosPropios !== -1 && indexImpuestosPropios < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexImpuestosPropios);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        IMPUESTOS_PROPIOS = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    // BALANCE GENERAL PARTE PASIVO LARGO PLAZO
                    if(indexCreditosBancarios !== -1 && indexCreditosBancarios < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCreditosBancarios);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CREDITOS_BANCARIOS = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    // BALANCE GENERAL PARTE CAPITAL
                    if(indexCapitalSocialFijo !== -1 && indexCapitalSocialFijo < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCapitalSocialFijo);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CAPITAL_SOCIAL_FIJO = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexCapitalSocialVariable !== -1 && indexCapitalSocialVariable < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexCapitalSocialVariable);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        CAPITAL_SOCIAL_VARIABLE = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexReservaLegal !== -1 && indexReservaLegal < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexReservaLegal);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        RESERVA_LEGAL = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexResultadoDeEjerciciosAnteriores !== -1 && indexResultadoDeEjerciciosAnteriores < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexResultadoDeEjerciciosAnteriores);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        RESULTADO_DE_EJERCICIOS_ANTERIORES = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexResultadoDelEjercicioReport !== -1 && indexResultadoDelEjercicioReport < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexResultadoDelEjercicioReport);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        RESULTADO_DEL_EJERCICIO_REPORT = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                    if(indexSuperavitDeficitActCapital !== -1 && indexSuperavitDeficitActCapital < rowValues.length - 1){
                        const correspondingValue = rowValues.slice(indexSuperavitDeficitActCapital);
                        const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                        SUPERAVIT_DEFICIT_ACT_CAPITAL = parseFloat(filteredValues[6]?.toString() || '0');
                    }

                }   
            } 

            // BALANCE GENERAL
            CLIENTES = CLIENTES - (PROVISION_CUENTAS_INCOBRABLES);
            
            SUMA_ACTIVO_CIRCUALANTE = parseFloat((CAJA! + BANCOS! + CLIENTES! + PROVISION_CUENTAS_INCOBRABLES! + CTAS_COBRAR_FILIALES! + DOCUMENTOS_POR_COBRAR! + DEUDORES_DIVERSOS! + ALMACEN_GENERAL_MPR! + PAGOS_ANTICIPADOS! + IVA_ACREDITABLE! + IVA_POR_ACREEDITAR! + SUBSIDIO_AL_EMPLEO! + IMPUESTOS_PAGADOS_POR_ANTICIPADO!).toFixed(2));

            SUMA_ACTIVO_FIJO = parseFloat((MOBILIARIO_Y_EQUIPO! + ACUMULADO_DEP_MOB! + EQUIPO_DE_COMPUTO! + DEP_ACUM_EQ_COMPUTO! + EQUIPO_DE_REPARTO! + DEP_ACUM_EQ_REPARTO! + MOBILIARIO_Y_EQUIPO_ALMACEN! + DEP_ACUM_EQ_ALMACEN! + ALARMA_Y_EQ_SEGURIDAD! + DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD! + MAQUINARIA_ARRENDAMIENTO! + ACUM_MAQUINARIA_ARRENDAMIENTO! + DEP_ACUM_MAQUINARIA_Y_EQUIPO).toFixed(2));
            SUMA_ACTIVO_DIFERIDO = parseFloat((GASTOS_DE_INSTALACION! + AMORTI_ACUM_GTS_INSTALACION! + DEPOSITOS_GARANTIA!).toFixed(2));

            SUMA_PASIVO_CORTO_PLAZO  = parseFloat((PROVEEDORES! + ACREEDORES_DIVERSOS! + CUENTAS_PAGAR_FILIALES_OP! + IVA_TRASLADADO! + IVA_POR_TRASLADAR! + IMPUESTOS_RETENIDOS! + IMPUESTOS_PROPIOS!).toFixed(2));

            SUMA_PASIVO_LARGO_PLAZO = parseFloat((CREDITOS_BANCARIOS).toFixed(2));

            RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL = parseFloat(((RESULTADO_DE_EJERCICIOS_ANTERIORES!) + (RESULTADO_DEL_EJERCICIO_REPORT)).toFixed(2));
            RESULTADO_DEL_EJERCICIO = parseFloat((UTILIDAD_ANTES_DE_ISR_Y_PTU_EJERCICIO).toFixed(2));
            CAPITAL_CONTABLE = parseFloat((CAPITAL_SOCIAL_FIJO! + CAPITAL_SOCIAL_VARIABLE! + RESERVA_LEGAL! + RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL! + SUPERAVIT_DEFICIT_ACT_CAPITAL!).toFixed(2));

            let masER;

            masER = {
                ventasNetas: VENTAS_NETAS_PERIODO,
                costoVentas: COSTO_DE_VENTAS_PERIODO,
                gastosAdmonVTA: GASTOS_DE_ADMON_Y_VTA_PERIODO,
                depreContable: DEPRECIACION_CONTABLE_PERIODO,
                gastosFinancieros: GASTOS_FINANCIEROS_PERIODO,
                perdidaFinanciera: PERDIDA_FINANCIERA_PERIODO,
                otrosIngresos: OTROS_INGRESOS_PERIODO,
                utlAntesIsrYPtuE: UTILIDAD_ANTES_DE_ISR_Y_PTU_EJERCICIO,
                utlAntesIsrYPtuP: UTILIDAD_ANTES_DE_ISR_Y_PTU_PERIODO,
            }

            let masERF = {
                fecha: FECHA,
                ventasP: VENTAS_PERIODO,
                ventasE: VENTAS_EJERCICIO,
                ventasActivosP: VENTAS_DE_ACTIVOS_PERIODO,
                ventasActivosE: VENTAS_DE_ACTIVOS_EJERCICIO,
                devolDescVentaP: DEVOL_Y_DESCUENTOS_PERIODO,
                devolDescVentaE: DEVOL_Y_DESCUENTOS_EJERCICIO,
                ventasNetasP: VENTAS_NETAS_PERIODO,
                ventasNetasE: VENTAS_NETAS_EJERCICIO,
                comprasP: COMPRAS_PERIODO,
                comprasE: COMPRAS_EJERCICIO,
                devDescBonCompraP: DEV_DESCTO_Y_BONIF_S_COMPRA_PERIODO,
                devDescBonCompraE: DEV_DESCTO_Y_BONIF_S_COMPRA_EJERCICIO,
                gastosCompraImporP: GASTOS_SOBRE_COMPRA_IMPORTACION_PERIODO,
                gastosCompraImporE: GASTOS_SOBRE_COMPRA_IMPORTACION_EJERCICIO,
                costoVentasP: COSTO_DE_VENTAS_PERIODO,
                costoVentasE: COSTO_DE_VENTAS_EJERCICIO,
                utilidadBrutaP: UTILIDAD_BRUTA_PERIODO,
                utilidadBrutaE: UTILIDAD_BRUTA_EJERCICIO,
                gastosAdminP: GASTOS_DE_ADMINISTRACION_PERIODO,
                gastosAdminE: GASTOS_DE_ADMINISTRACION_EJERCICIO,
                gastosVentaP: GASTOS_DE_VENTA_PERIODO,
                gastosVentaE: GASTOS_DE_VENTA_EJERCICIO,
                gastosLogisticaP: GASTOS_DE_LOGISTICA_PERIODO,
                gastosLogisticaE: GASTOS_DE_LOGISTICA_EJERCICIO,
                gastosDireccionP: GASTOS_DE_DIRECCION_PERIODO,
                gastosDireccionE: GASTOS_DE_DIRECCION_EJERCICIO,
                gastosAdmonYVtaP: GASTOS_DE_ADMON_Y_VTA_PERIODO,
                gastosAdmonYVtaE: GASTOS_DE_ADMON_Y_VTA_EJERCICIO,
                depreciacionContableP: DEPRECIACION_CONTABLE_PERIODO,
                depreciacionContableE: DEPRECIACION_CONTABLE_EJERCICIO,
                utilidadOperacionP: UTILIDAD_DE_OPERACION_PERIODO,
                utilidadOperacionE: UTILIDAD_DE_OPERACION_EJERCICIO,
                gastosFinancierosP: GASTOS_FINANCIEROS_PERIODO,
                gastosFinancierosE: GASTOS_FINANCIEROS_EJERCICIO,
                perdidaFinancieraP: PERDIDA_FINANCIERA_PERIODO,
                perdidaFinancieraE: PERDIDA_FINANCIERA_EJERCICIO,
                costosIntegralesFinancierosP: COSTOS_INTEGRAL_FINANCIERO_PERIODO,
                costosIntegralesFinancierosE: COSTOS_INTEGRAL_FINANCIERO_EJERCICIO,
                otrosIngresosP: OTROS_INGRESOS_PERIODO,
                otrosIngresosE: OTROS_INGRESOS_EJERCICIO,
                utilidadAntesIsrYPtuP: UTILIDAD_ANTES_DE_ISR_Y_PTU_PERIODO,
                utilidadAntesIsrYPtuE: UTILIDAD_ANTES_DE_ISR_Y_PTU_EJERCICIO,
            }

            let elimM;

            elimM = {
                sueldosAdmon : SUELDOS_ADMON,
            };

            let afectMASP;

            afectMASP = {
                caja: CAJA,
                bancos: BANCOS,
                clientes: CLIENTES,
                provisionCuentasIncobrables: PROVISION_CUENTAS_INCOBRABLES,
                ctasCobrarFiliales: CTAS_COBRAR_FILIALES,
                documentosPorCobrar: DOCUMENTOS_POR_COBRAR,
                deudoresDiversos: DEUDORES_DIVERSOS,
                almacenGeneralMPR: ALMACEN_GENERAL_MPR,
                pagosAnticipados: PAGOS_ANTICIPADOS,
                ivaAcreditable: IVA_ACREDITABLE,
                ivaPorAcreditar: IVA_POR_ACREEDITAR,
                subsidioAlEmpleo: SUBSIDIO_AL_EMPLEO,
                impuestosPagadosPorAnticipado: IMPUESTOS_PAGADOS_POR_ANTICIPADO,
                sumaActivoCirculante: SUMA_ACTIVO_CIRCUALANTE,
                mobYEQOficina: MOBILIARIO_Y_EQUIPO,
                acumDepMob: ACUMULADO_DEP_MOB,
                equipoDeComputo: EQUIPO_DE_COMPUTO,
                depAcumEqComputo: DEP_ACUM_EQ_COMPUTO,
                equipoDeReparto: EQUIPO_DE_REPARTO,
                depAcumEqReparto: DEP_ACUM_EQ_REPARTO,
                mobYEQAlmacen: MOBILIARIO_Y_EQUIPO_ALMACEN,
                depAcumEQAlmacen: DEP_ACUM_EQ_ALMACEN,
                alarmaYEqSeguridad: ALARMA_Y_EQ_SEGURIDAD,
                depAcumAlarmaYEqSeguridad: DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD,
                maquinariaArrendamiento: MAQUINARIA_ARRENDAMIENTO,
                acumMaquinariaArrendamiento: ACUM_MAQUINARIA_ARRENDAMIENTO,
                depAcumMaquinariaYEquipo: DEP_ACUM_MAQUINARIA_Y_EQUIPO,
                sumaActivoFijo: SUMA_ACTIVO_FIJO,
                gastosDeInstalacion: GASTOS_DE_INSTALACION,
                amortiAcumGtsInstalacion: AMORTI_ACUM_GTS_INSTALACION,
                depositosGarantia: DEPOSITOS_GARANTIA,
                sumaActivoDiferido: SUMA_ACTIVO_DIFERIDO,
                proveedores: PROVEEDORES,
                acreedoresDiversos: ACREEDORES_DIVERSOS,
                ctasPagarFilialesOp: CUENTAS_PAGAR_FILIALES_OP,
                ivaTrasladado: IVA_TRASLADADO,
                ivaPorTrasladar: IVA_POR_TRASLADAR,
                impuestosRetenidos: IMPUESTOS_RETENIDOS,
                impuestosPropios: IMPUESTOS_PROPIOS,
                sumaPasivoCortoPlazo: SUMA_PASIVO_CORTO_PLAZO,
                creditosBancarios: CREDITOS_BANCARIOS,
                sumaPasivoLargoPlazo: SUMA_PASIVO_LARGO_PLAZO,
                capitalSocialFijo: CAPITAL_SOCIAL_FIJO,
                capitalSocialVariable: CAPITAL_SOCIAL_VARIABLE,
                reservaLegal: RESERVA_LEGAL,
                resultadoDeEjerciciosAnteriores: RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL,
                resultadoDelEjercicio: RESULTADO_DEL_EJERCICIO,
                superavitDeficitActCapital: SUPERAVIT_DEFICIT_ACT_CAPITAL,
                capitalContable: CAPITAL_CONTABLE,
            }

            dataMASBG(null, afectMASP);

            dataCombinado(masER, null, null, null, null, null);

            dataFinal(null, null, elimM);

            datosAgrupadosReporte(null, masERF, null, null, null, null, null, null);
            return true
        } catch (error){
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al subir el excel", errorResponse.code || 500);
        }
    }

    /**
     * POST upload excel PST
     * @Params keyFile
     * @returns respuesta
     */

    static async uploadExcelPST(keyFile: string): Promise<any> {
        try {
            const file = storage.bucket().file(keyFile);

            if(!file){
                throw new ErrorResponse("No se ha encontrado el archivo", 400);
             }
     
             if(!file.name.includes(".xlsx")){
                 throw new ErrorResponse("El archivo no es un archivo de excel", 400);
             }
     
             const data = await file.download();
             const buffer = data[0];
     
             const workbook = new ExcelJS.Workbook();
             await workbook.xlsx.load(buffer);
     
             const worksheet = workbook.getWorksheet(1);        
     
             if(!worksheet){
                 throw new ErrorResponse("No se ha encontrado la hoja de ", 400);
             }              
             
             // Declaración de Variables Estado de Resultados MASP
             let VENTAS_PST_PERIODO = 0;
             let VENTAS_PST_EJERCICIO = 0;
             let VENTAS_DE_ACTIVOS_PST_PERIODO = 0;
             let VENTAS_DE_ACTIVOS_PST_EJERCICIO = 0;
             let DEVOL_Y_DESCUENTOS_PST_PERIODO = 0;
             let DEVOL_Y_DESCUENTOS_PST_EJERCICIO = 0;
             let VENTAS_NETAS_PST_PERIODO = 0;
             let VENTAS_NETAS_PST_EJERCICIO = 0;
     
             let COMPRAS_PST_PERIODO = 0;
             let COMPRAS_PST_EJERCICIO = 0;
             let DEV_DESCTO_Y_BONIF_S_COMPRA_PST_PERIODO = 0;
             let DEV_DESCTO_Y_BONIF_S_COMPRA_PST_EJERCICIO = 0;
             let GASTOS_FABRICACION_SYR_PST_PERIODO = 0;
             let GASTOS_FABRICACION_SYR_PST_EJERCICIO = 0;
             let GASTOS_FABRICACION_BONDEADO_PST_PERIODO = 0;
             let GASTOS_FABRICACION_BONDEADO_PST_EJERCICIO = 0;
             let GASTOS_FABRICACION_CASCO_Y_APL_PST_PERIODO = 0;
             let GASTOS_FABRICACION_CASCO_Y_APL_PST_EJERCICIO = 0;
             let GASTOS_OPERATIVOS_ADMON_PST_PERIODO = 0;
             let GASTOS_OPERATIVOS_ADMON_PST_EJERCICIO = 0;
             let GASTOS_R_PST_PERIODO = 0;
             let GASTOS_R_PST_EJERCICIO = 0;
             let COSTOS_DE_VENTAS_PST_PERIODO = 0;
             let COSTOS_DE_VENTAS_PST_EJERCICIO = 0;
     
             let  UTILIDAD_BRUTA_PST_PERIODO = 0;
             let  UTILIDAD_BRUTA_PST_EJERCICIO = 0;
     
             let GASTOS_DE_ADMINISTRACION_PST_PERIODO = 0;
             let GASTOS_DE_ADMINISTRACION_PST_EJERCICIO = 0;
             let GASTOS_DE_VENTA_PST_PERIODO = 0;
             let GASTOS_DE_VENTA_PST_EJERCICIO = 0;
             let GASTOS_DE_LOGISTICA_PST_PERIODO = 0;
             let GASTOS_DE_LOGISTICA_PST_EJERCICIO = 0;
             let GASTOS_DE_DIRECCION_PST_PERIODO = 0;
             let GASTOS_DE_DIRECCION_PST_EJERCICIO = 0;
     
             let GASTOS_DE_ADMON_Y_VTA_PST_PERIODO = 0;
             let GASTOS_DE_ADMON_Y_VTA_PST_EJERCICIO = 0;
     
             let DEPRECIACION_CONTABLE_PST_PERIODO = 0;
             let DEPRECIACION_CONTABLE_PST_EJERCICIO = 0;
     
             let UTILIDAD_DE_OPERACION_PST_PERIODO = 0;
             let UTILIDAD_DE_OPERACION_PST_EJERCICIO = 0;
     
             let GASTOS_FINANCIEROS_PST_PERIODO = 0;
             let GASTOS_FINANCIEROS_PST_EJERCICIO = 0;
             let PERDIDA_FINANCIERA_PST_PERIODO = 0;
             let PERDIDA_FINANCIERA_PST_EJERCICIO = 0;
             let COSTOS_INTEGRAL_FINANCIERO_PST_PERIODO = 0;
             let COSTOS_INTEGRAL_FINANCIERO_PST_EJERCICIO = 0;
             let OTROS_INGRESOS_PST_PERIODO = 0;
             let OTROS_INGRESOS_PST_EJERCICIO = 0;
     
             let UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_PERIODO = 0;
             let UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_EJERCICIO = 0;
             let foundOtrosIngresos = false;
     
             let COMPRAS_R_PST = 0;
             let SUPERAVIT_DEBITO_PST = 0;
             let SUPERAVIT_CREDITO_PST = 0;
             let COSTO_DE_VENTAS_DEBITO_PST = 0;
             let COSTO_DE_VENTAS_CREDITO_PST = 0;
             let TOTAL_ELIMINACIONES_DEBITO_PST = 0;
             let TOTAL_ELIMINACIONES_CREDITO_PST = 0;
     
             // VARIABLES PARA LOS AJUSTES DE NOMINA DE LAS ELIMINACIONES
             let SUELDOS_ADMON_PST = 0;
             let SUELDOS_LOG_PST = 0;
             let SUELDOS_DIRECCION_PST = 0;
             let SUELDOS_OP_AD_PST = 0;
             let SUELDOS_ADMON_VENTAS_PST = 0;
             let SUELDOS_SYR_PST = 0;
             let SUELDOS_APL_PST = 0;
             let SUELDOS_BONDEADO_PST = 0;
     
             // VARIABLES PARA LOS SERVICIOS ADMINISTRATIVOS
             let SERVICIOS_ADMINISTRATIVOS_PST = 0;
             let TOTAL_ELIMINACIONES_SERVICIOS_ADMINISTRATIVOS_DEBITO_PST = 0;
             let TOTAL_ELIMINACIONES_SERVICIOS_ADMINISTRATIVOS_CREDITO_PST = 0;
     
             // VARIABLES PARA EL BALANCE GENERAL PST PARTE ACTIVO
             let CAJA = 0;
             let BANCOS = 0;
             let CLIENTES = 0;
             let PROVISION_CUENTAS_INCOBRABLES = 0;
             let CTAS_COBRAR_FILIALES_OP = 0;
             let DOCUMENTOS_POR_COBRAR = 0;
             let DEUDORES_DIVERSOS = 0;
             let ALMACEN_BONDEADO = 0;
             let PAGOS_ANTICIPADOS = 0;
             let IVA_ACREDITABLE = 0;
             let IVA_POR_ACREEDITAR = 0;
             let SUBSIDIO_AL_EMPLEO = 0;
             let IMPUESTOS_PAGADOS_POR_ANTICIPADO = 0;
             let SUMA_ACTIVO_CIRCULANTE = 0;
     
             // VARIABLES PARA EL BALANCE GENERAL PST PARTE FIJO
             let MOBILIARIO_Y_EQUIPO = 0;
             let ACUMULADO_DEP_MOB = 0;
             let EQUIPO_DE_COMPUTO = 0;
             let DEP_ACUM_EQ_COMPUTO = 0;
             let EQUIPO_DE_REPARTO = 0;
             let DEP_ACUM_EQ_REPARTO = 0;
             let MOBILIARIO_Y_EQUIPO_ALMACEN = 0;
             let DEP_ACUM_EQ_ALMACEN = 0;
             let ALARMA_Y_EQ_SEGURIDAD = 0;
             let DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD = 0;
             let MAQUINARIA_EQ_PST = 0;
             let DEP_ACUM_MAQUINARIA_EQ = 0;
             let MOLDES_SUAJADO_PST = 0;
             let DEP_ACUM_MOLDES_SUAJADO = 0;
             let SUMA_ACTIVO_FIJO = 0;
     
             // VARIABLES PARA EL BALANCE GENERAL PST PARTE DIFERIDO
             let DEPOSITOS_GARANTIA = 0;
             let SUMA_ACTIVO_DIFERIDO = 0;
     
             // VARIABLES PARA EL BALANCE GENERAL PST PARTE PASIVO CORTO PLAZO
             let PROVEEDORES = 0;
             let ACREEDORES_DIVERSOS = 0;
             let CUENTAS_PAGAR_FILIALES_OP = 0;
             let IVA_TRASLADADO = 0;
             let IVA_POR_TRASLADAR = 0;
             let IMPUESTOS_RETENIDOS = 0;
             let IMPUESTOS_PROPIOS = 0;
             let SUMA_PASIVO_CORTO_PLAZO = 0;
     
             // VARIABLES PARA EL BALANCE GENERAL PST PARTE PASIVO LARGO PLAZO
             let CREDITOS_BANCARIOS = 0;
             let SUMA_PASIVO_LARGO_PLAZO = 0;
     
             // VARIABLES PARA EL BALANCE GENERAL PST PARTE CAPITAL
             let CAPITAL_SOCIAL_FIJO = 0;
             let CAPITAL_SOCIAL_VARIABLE = 0;
             let RESERVA_LEGAL = 0;
             let RESULTADO_DE_EJERCICIOS_ANTERIORES = 0;
             let RESULTADO_DEL_EJERCICIO_REPORT = 0;
             let RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL = 0;
             let RESULTADO_DEL_EJERCICIO = 0;
             let SUPERAVIT_DEFICIT_ACT_CAPITAL = 0;
             let CAPITAL_CONTABLE = 0;
     
             // ESTADOS DE RESULTADOS DE MASP
             for (let rowNumber = 7; rowNumber <= worksheet.rowCount; rowNumber++) {
                 const row = worksheet.getRow(rowNumber);
                 
                 // Verifica si la fila existe y tiene valores
                 if (row && row.values && Array.isArray(row.values) && row.values.length > 0) {
                     const rowValues = row.values;
                     // Declaración de Targets
                     const targetVentas = 'VENTAS';
                     const targetVentasActivos = 'VENTAS DE ACTIVOS';
                     const targetDevolYDesc = 'DESCTO.BONIFICA. Y DEVOLUCION S/VENTA';
     
                     const targetCompras = 'COMPRAS';
                     const targetDevDesctoYBonifc = 'DEV. DESCTO. Y BONIF. S/COMPRA';
                     const targetGatosFabSYR = 'GTS FABRICACION SYR';
                     const targetGastosFabBon = 'GASTOS FABRICACION BONDEADO';
                     const targetGastosFabCasco = 'GASTOS FABRICACION CASCO Y APL';
                     const targetGatosOperativosAdmon = 'GASTOS OPERATIVOS/ADMON';
                     const targetGastosRPST = 'GASTOS R PST';
     
                     const targetGastosAdm = 'GASTOS DE ADMINISTRACION';
                     const targetGastosVenta = 'GASTOS DE VENTA';
                     const targetGatosLogistica = 'GASTOS DE LOGISTICA';
                     const targetGastosDireccion = 'GASTOS de DIRECCIÓN';
     
                     const targetDepreciacionContable = 'DEPRECIACION CONTABLE';
     
                     const targetGastosFinancieros = 'GASTOS FINANCIEROS';
                     const targetPerdidaFinanciera = 'PERDIDA FINANCIERA';
                     const targetOtrosIngresos = 'OTROS INGRESOS';
     
                     const targetComprasR = 'COMPRAS R';
     
                     // TARGETS PARA LOS AJUSTES DE NOMINA DE LAS ELIMINACIONES
                     const targetSueldosAdmon = 'SUELDOS ADMON';
                     const targetSueldosLog = 'SUELDOS LOG';
                     const targetSueldosDireccion = 'SUELDOS DIRECCION';
                     const targetSueldosOpAd = 'SUELDOS OP AD';
                     const targetSueldosAdmonVentas = 'SUELDOS ADMON VENTAS';
                     const targetSueldosSYR = 'SUELDOS SYR';
                     const targetSueldosApl = 'SUELDOS APL';
                     const targetSueldosBon = 'SUELDOS BONDEADO';
     
                     // TARGETS PARA LOS SERVICIOS ADMINISTRATIVOS
                     const targetServiciosAdministrativos = 'SERVICIOS ADMINISTRATIVOS';
     
                     // TARGETS PARA PST BG PARTE ACTIVO
                     const targetCaja = 'CAJA';
                     const targetBancos = 'BANCOS';
                     const targetClientes = 'CLIENTES';
                     const targetProvisionCuentasIncobrables = 'PROVISION PARA CUENTAS INCOBRABLES';
                     const targetCtasCobrarFilialesOp = 'CTAS. X COBRAR  FILIALES OP.';
                     const targetDocumentosPorCobrar = 'DOCUMENTOS POR COBRAR';
                     const targetDeudoresDiversos = 'DEUDORES DIVERSOS';
                     const targetAlmacenBondeado = 'ALMACEN BONDEADO';
                     const targetPagosAnticipados = 'PAGOS ANTICIPADOS';
                     const targetIvaAcreditable = 'IVA ACREDITABLE';
                     const targetIvaPorAcreditar = 'IVA POR ACREEDITAR';
                     const targetSubsidioAlEmpleo = 'SUBSIDIO AL EMPLEO';
                     const targetImpuestosPagadosPorAnticipado = 'IMPUESTOS PAGADOS POR ANTICIPADO';
     
                     // TARGETS PARA PST BG PARTE FIJO
                     const targetMobiliarioYEquipo = 'EQUIPO OFICINA PST';
                     const targetAcumDepMob = 'ACUMULADO DEP. MOB. Y EQ. DE OFICINA';
                    //  const targetEquipoDeComputo = 'EQUIPO DE COMPUTO PST';
                     const targetDepAcumEqComputo = 'DEP. ACUM. EQ. DE COMPUTO';
                     const targetEquipoDeReparto = 'EQUIPO DE REPARTO PST';
                     const targetDepAcumEqReparto = 'DEP. ACUM. DE EQ. DE REPARTO';
                     const targetMobiliarioYEquipoAlmacen = 'MOBILIARIO Y EQUIPO DE ALMACEN PST';
                     const targetDepAcumEqAlmacen = 'DEP. ACUM. DE EQ. Y MOB. DE ALMACEN';
                     const targetAlarmaYEqSeguridad = 'ALARMA Y EQ. DE SEGURIDAD PST';
                     const targetDepAcumAlarmaYEqSeguridad = 'DEP. ACUM. DE ALARMA Y EQ. DE SEGURIDAD';
                     const targetMaquinariaEqPST = 'MAQUINARIA Y EQUIPO PST';
                     const targetDepAcumMaquinariaEq = 'DEP. ACUM. DEP. MAQUINARIA Y EQUIPO';
                     const targetMoldesSuajadoPST = 'MOLDES SUAJADO PST';
                     const targetDepAcumMoldesSuajado = 'DEP. ACUM. MOLDES SUAJADO';
     
                     // TARGETS PARA PST BG PARTE DIFERIDO
                     const targetDepositosGarantia = 'DEPOSITOS EN GARANTIA';
     
                     // TARGETS PARA PST BG PARTE PASIVO CORTO PLAZO
                     const targetProveedores = 'PROVEEDORES';
                     const targetAcreedoresDiversos = 'ACREEDORES DIVERSOS';
                     const targetCtasPagarFilialesOp = 'CUENTAS X PAG. FILIALES OP.';
                     const targetIvaTrasladado = 'IVA TRASLADADO';
                     const targetIvaPorTrasladar = 'IVA POR TRASLADAR';
                     const targetImpuestosRetenidos = 'IMPUESTOS RETENIDOS';
                     const targetImpuestosPropios = 'IMPUESTOS PROPIOS (CUOTA PATRONAL)';
     
                     // TARGETS PARA PST BG PARTE PASIVO LARGO PLAZO
                     const targetCreditosBancarios = 'CREDITOS BANCARIOS';
     
                     // TARGETS PARA PST BG PARTE CAPITAL
                     const targetCapitalSocialFijo = 'CAPITAL SOCIAL FIJO';
                     const targetCapitalSocialVariable = 'CAPITAL SOCIAL VARIABLE';
                     const targetReservaLegal = 'RESERVA LEGAL';
                     const targetResultadoDeEjerciciosAnteriores = 'RESULTADO DE EJERCICOS ANTERIORES';
                     const targetResultadoDelEjercicioReport = 'RESULTADO DEL EJERCICIO';
                     const targetSuperavitDeficitActCapital = 'Superavit(+) / Déficit (-) en Act. de Capital ';
     
                     // Declaración de Index
                     // Estos index lo que hace es una busqueda en los rows existentes para encontrar el target, y a la vez elimina los espacios vacios
                     const indexVentas = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetVentas.trim());
                     const indexVentasActivos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetVentasActivos.trim());
                     const indexDevolYDesc = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDevolYDesc.trim());
                     
                     const indexCompras = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCompras.trim());
                     const indexDevDesctoYBonifc = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDevDesctoYBonifc.trim());
                     const indexGastosFabSYR = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGatosFabSYR.trim());
                     const indexGastosFabBon = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosFabBon.trim());
                     const indexGastosFabCasco = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosFabCasco.trim());
                     const indexGatosOperativosAdmon = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGatosOperativosAdmon.trim());
                     const indexGastosRPST = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosRPST.trim());
     
                     const indexGastosAdm = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosAdm.trim());
                     const indexGastosVenta = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosVenta.trim());
                     const indexGatosLogistica = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGatosLogistica.trim());
                     const indexGastosDireccion = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosDireccion.trim());
     
                     const indexDepreciacionContable = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepreciacionContable.trim());
     
                     const indexGastosFinancieros = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetGastosFinancieros.trim());
                     const indexPerdidaFinanciera = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetPerdidaFinanciera.trim());
                     const indexOtrosIngresos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetOtrosIngresos.trim());
     
                     const indexComprasR = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetComprasR.trim());
     
                     // INDEX PARA LOS AJUSTES DE NOMINA DE LAS ELIMINACIONES
                     const indexSueldosAdmon = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosAdmon.trim());
                     const indexSueldosLog = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosLog.trim());
                     const indexSueldosDireccion = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosDireccion.trim());
                     const indexSueldosOpAd = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosOpAd.trim());
                     const indexSueldosAdmonVentas = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosAdmonVentas.trim());
                     const indexSueldosSYR = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosSYR.trim());
                     const indexSueldosApl = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosApl.trim());
                     const indexSueldosBon = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSueldosBon.trim());
                     
                     // INDEX PARA LOS SERVICIOS ADMINISTRATIVOS
                     const indexServiciosAdministrativos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetServiciosAdministrativos.trim());
     
                     // INDEX PARA PST BG PARTE ACTIVO
                     const indexCaja = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCaja.trim());
                     const indexBancos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetBancos.trim());
                     const indexClientes = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetClientes.trim());
                     const indexProvisionCuentasIncobrables = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetProvisionCuentasIncobrables.trim());
                     const indexCtasCobrarFilialesOp = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCtasCobrarFilialesOp.trim());
                     const indexDocumentosPorCobrar = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDocumentosPorCobrar.trim());
                     const indexDeudoresDiversos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDeudoresDiversos.trim());
                     const indexAlmacenBondeado = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAlmacenBondeado.trim());
                     const indexPagosAnticipados = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetPagosAnticipados.trim());
                     const indexIvaAcreditable = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaAcreditable.trim());
                     const indexIvaPorAcreditar = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaPorAcreditar.trim());
                     const indexSubsidioAlEmpleo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSubsidioAlEmpleo.trim());
                     const indexImpuestosPagadosPorAnticipado = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetImpuestosPagadosPorAnticipado.trim());
     
                     // INDEX PARA PST BG PARTE FIJO
                     const indexMobiliarioYEquipo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMobiliarioYEquipo.trim());
                     const indexAcumDepMob = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAcumDepMob.trim());
                    //  const indexEquipoDeComputo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetEquipoDeComputo.trim());
                     const indexDepAcumEqComputo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumEqComputo.trim());
                     const indexEquipoDeReparto = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetEquipoDeReparto.trim());
                     const indexDepAcumEqReparto = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumEqReparto.trim());
                     const indexMobiliarioYEquipoAlmacen = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMobiliarioYEquipoAlmacen.trim());
                     const indexDepAcumEqAlmacen = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumEqAlmacen.trim());
                     const indexAlarmaYEqSeguridad = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAlarmaYEqSeguridad.trim());
                     const indexDepAcumAlarmaYEqSeguridad = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumAlarmaYEqSeguridad.trim());
                     const indexMaquinariaEqPST = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMaquinariaEqPST.trim());
                     const indexDepAcumMaquinariaEq = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumMaquinariaEq.trim());
                     const indexMoldesSuajadoPST = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetMoldesSuajadoPST.trim());
                     const indexDepAcumMoldesSuajado = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepAcumMoldesSuajado.trim());
     
                     // INDEX PARA PST BG PARTE DIFERIDO
                     const indexDepositosGarantia = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetDepositosGarantia.trim());
     
                     // INDEX PARA PST BG PARTE PASIVO CORTO PLAZO
                     const indexProveedores = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetProveedores.trim());
                     const indexAcreedoresDiversos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetAcreedoresDiversos.trim());
                     const indexCtasPagarFilialesOp = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCtasPagarFilialesOp.trim());
                     const indexIvaTrasladado = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaTrasladado.trim());
                     const indexIvaPorTrasladar = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetIvaPorTrasladar.trim());
                     const indexImpuestosRetenidos = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetImpuestosRetenidos.trim());
                     const indexImpuestosPropios = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetImpuestosPropios.trim());
     
                     // INDEX PARA PST BG PARTE PASIVO LARGO PLAZO
                     const indexCreditosBancarios = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCreditosBancarios.trim());
     
                     // INDEX PARA PST BG PARTE CAPITAL
                     const indexCapitalSocialFijo = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCapitalSocialFijo.trim());
                     const indexCapitalSocialVariable = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetCapitalSocialVariable.trim());
                     const indexReservaLegal = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetReservaLegal.trim());
                     const indexResultadoDeEjerciciosAnteriores = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetResultadoDeEjerciciosAnteriores.trim());
                     const indexResultadoDelEjercicioReport = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetResultadoDelEjercicioReport.trim());
                     const indexSuperavitDeficitActCapital = rowValues.findIndex(value => typeof value === 'string' && value.trim() === targetSuperavitDeficitActCapital.trim());
     
                     // Estos ifs lo que hace es que cuando encuentra el target, busca el valor que le corresponde y lo asigna a la variable
                     if (indexVentas !== -1 && indexVentas < rowValues.length - 1) {
                         const correspondingValue = rowValues.slice(indexVentas);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         VENTAS_PST_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                         VENTAS_PST_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexVentasActivos !== -1 && indexVentasActivos < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexVentasActivos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         VENTAS_DE_ACTIVOS_PST_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                         VENTAS_DE_ACTIVOS_PST_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexDevolYDesc !== -1 && indexDevolYDesc < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDevolYDesc);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEVOL_Y_DESCUENTOS_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         DEVOL_Y_DESCUENTOS_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
     
                     VENTAS_NETAS_PST_PERIODO = parseFloat((VENTAS_PST_PERIODO! - VENTAS_DE_ACTIVOS_PST_PERIODO! - DEVOL_Y_DESCUENTOS_PST_PERIODO!).toFixed(2));
                     VENTAS_NETAS_PST_EJERCICIO = parseFloat((VENTAS_PST_EJERCICIO! - VENTAS_DE_ACTIVOS_PST_EJERCICIO! - DEVOL_Y_DESCUENTOS_PST_EJERCICIO!).toFixed(2));
     
                     if(indexCompras !== -1 && indexCompras < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCompras);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         COMPRAS_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         COMPRAS_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDevDesctoYBonifc !== -1 && indexDevDesctoYBonifc < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDevDesctoYBonifc);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEV_DESCTO_Y_BONIF_S_COMPRA_PST_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                         DEV_DESCTO_Y_BONIF_S_COMPRA_PST_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexGastosFabSYR !== -1 && indexGastosFabSYR < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosFabSYR);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_FABRICACION_SYR_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_FABRICACION_SYR_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGastosFabBon !== -1 && indexGastosFabBon < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosFabBon);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_FABRICACION_BONDEADO_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_FABRICACION_BONDEADO_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGastosFabCasco !== -1 && indexGastosFabCasco < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosFabCasco);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_FABRICACION_CASCO_Y_APL_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_FABRICACION_CASCO_Y_APL_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGatosOperativosAdmon !== -1 && indexGatosOperativosAdmon < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGatosOperativosAdmon);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_OPERATIVOS_ADMON_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_OPERATIVOS_ADMON_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGastosRPST !== -1 && indexGastosRPST < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosRPST);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_R_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_R_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     COSTOS_DE_VENTAS_PST_PERIODO = parseFloat((COMPRAS_PST_PERIODO! - DEV_DESCTO_Y_BONIF_S_COMPRA_PST_PERIODO! + GASTOS_FABRICACION_SYR_PST_PERIODO! + GASTOS_FABRICACION_BONDEADO_PST_PERIODO! + GASTOS_FABRICACION_CASCO_Y_APL_PST_PERIODO! + GASTOS_OPERATIVOS_ADMON_PST_PERIODO! + GASTOS_R_PST_PERIODO!).toFixed(2));
                     COSTOS_DE_VENTAS_PST_EJERCICIO = parseFloat((COMPRAS_PST_EJERCICIO! - DEV_DESCTO_Y_BONIF_S_COMPRA_PST_EJERCICIO! + GASTOS_FABRICACION_SYR_PST_EJERCICIO! + GASTOS_FABRICACION_BONDEADO_PST_EJERCICIO! + GASTOS_FABRICACION_CASCO_Y_APL_PST_EJERCICIO! + GASTOS_OPERATIVOS_ADMON_PST_EJERCICIO! + GASTOS_R_PST_EJERCICIO!).toFixed(2));
     
                     UTILIDAD_BRUTA_PST_PERIODO = parseFloat((VENTAS_NETAS_PST_PERIODO! - COSTOS_DE_VENTAS_PST_PERIODO!).toFixed(2));
                     UTILIDAD_BRUTA_PST_EJERCICIO = parseFloat((VENTAS_NETAS_PST_EJERCICIO! - COSTOS_DE_VENTAS_PST_EJERCICIO!).toFixed(2));
     
                     if(indexGastosAdm !== -1 && indexGastosAdm < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosAdm);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_DE_ADMINISTRACION_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_DE_ADMINISTRACION_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGastosVenta !== -1 && indexGastosVenta < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosVenta);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_DE_VENTA_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_DE_VENTA_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGatosLogistica !== -1 && indexGatosLogistica < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGatosLogistica);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_DE_LOGISTICA_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_DE_LOGISTICA_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexGastosDireccion !== -1 && indexGastosDireccion < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosDireccion);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_DE_DIRECCION_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_DE_DIRECCION_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     GASTOS_DE_ADMON_Y_VTA_PST_PERIODO = parseFloat((GASTOS_DE_ADMINISTRACION_PST_PERIODO! + GASTOS_DE_VENTA_PST_PERIODO! + GASTOS_DE_LOGISTICA_PST_PERIODO! + GASTOS_DE_DIRECCION_PST_PERIODO!).toFixed(2));
                     GASTOS_DE_ADMON_Y_VTA_PST_EJERCICIO = parseFloat((GASTOS_DE_ADMINISTRACION_PST_EJERCICIO! + GASTOS_DE_VENTA_PST_EJERCICIO! + GASTOS_DE_LOGISTICA_PST_EJERCICIO! + GASTOS_DE_DIRECCION_PST_EJERCICIO!).toFixed(2));
     
                     if(indexDepreciacionContable !== -1 && indexDepreciacionContable < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepreciacionContable);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEPRECIACION_CONTABLE_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         DEPRECIACION_CONTABLE_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     UTILIDAD_DE_OPERACION_PST_PERIODO = parseFloat((UTILIDAD_BRUTA_PST_PERIODO! - GASTOS_DE_ADMON_Y_VTA_PST_PERIODO! - DEPRECIACION_CONTABLE_PST_PERIODO!).toFixed(2));
                     UTILIDAD_DE_OPERACION_PST_EJERCICIO = parseFloat((UTILIDAD_BRUTA_PST_EJERCICIO! - GASTOS_DE_ADMON_Y_VTA_PST_EJERCICIO! - DEPRECIACION_CONTABLE_PST_EJERCICIO!).toFixed(2));
     
                     if(indexGastosFinancieros !== -1 && indexGastosFinancieros < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexGastosFinancieros);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         GASTOS_FINANCIEROS_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         GASTOS_FINANCIEROS_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                         const haberM = parseFloat(filteredValues[4]?.toString() || '0');
                         if(haberM > 0){
                             GASTOS_FINANCIEROS_PST_PERIODO = GASTOS_FINANCIEROS_PST_PERIODO - haberM;
                         }
                     }
     
                     if(indexPerdidaFinanciera !== -1 && indexPerdidaFinanciera < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexPerdidaFinanciera);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         PERDIDA_FINANCIERA_PST_PERIODO = parseFloat(filteredValues[3]?.toString() || '0');
                         PERDIDA_FINANCIERA_PST_EJERCICIO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     COSTOS_INTEGRAL_FINANCIERO_PST_PERIODO = parseFloat((GASTOS_FINANCIEROS_PST_PERIODO! + PERDIDA_FINANCIERA_PST_PERIODO!).toFixed(2));
                     COSTOS_INTEGRAL_FINANCIERO_PST_EJERCICIO = parseFloat((GASTOS_FINANCIEROS_PST_EJERCICIO! + PERDIDA_FINANCIERA_PST_EJERCICIO!).toFixed(2));
     
                     if(indexOtrosIngresos !== -1 && indexOtrosIngresos < rowValues.length - 1 && !foundOtrosIngresos){
                         const correspondingValue = rowValues.slice(indexOtrosIngresos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         OTROS_INGRESOS_PST_PERIODO = parseFloat(filteredValues[4]?.toString() || '0');
                         OTROS_INGRESOS_PST_EJERCICIO = parseFloat(filteredValues[6]?.toString() || '0');
                         foundOtrosIngresos = true;
                     }
     
                     UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_PERIODO = parseFloat((UTILIDAD_DE_OPERACION_PST_PERIODO! - COSTOS_INTEGRAL_FINANCIERO_PST_PERIODO + OTROS_INGRESOS_PST_PERIODO! + VENTAS_DE_ACTIVOS_PST_PERIODO!).toFixed(2));
                     UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_EJERCICIO = parseFloat((UTILIDAD_DE_OPERACION_PST_EJERCICIO! - COSTOS_INTEGRAL_FINANCIERO_PST_EJERCICIO + OTROS_INGRESOS_PST_EJERCICIO! + VENTAS_DE_ACTIVOS_PST_EJERCICIO).toFixed(2));
     
                     // ELIMINACIONES PST
                     if(indexComprasR !== -1 && indexComprasR < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexComprasR);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         COMPRAS_R_PST = parseFloat(filteredValues[3]?.toString() || '0');
                         SUPERAVIT_DEBITO_PST = COMPRAS_R_PST;
                         COSTO_DE_VENTAS_CREDITO_PST = COMPRAS_R_PST;
                     }
     
                     TOTAL_ELIMINACIONES_DEBITO_PST = parseFloat((SUPERAVIT_DEBITO_PST! + COSTO_DE_VENTAS_DEBITO_PST!).toFixed(2));
                     TOTAL_ELIMINACIONES_CREDITO_PST = parseFloat((SUPERAVIT_CREDITO_PST! + COSTO_DE_VENTAS_CREDITO_PST!).toFixed(2));
     
                     // AJUSTES DE NOMINA DE LAS ELIMINACIONES
                     if(indexSueldosAdmon !== -1 && indexSueldosAdmon < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosAdmon);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_ADMON_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosLog !== -1 && indexSueldosLog < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosLog);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_LOG_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosDireccion !== -1 && indexSueldosDireccion < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosDireccion);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_DIRECCION_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosOpAd !== -1 && indexSueldosOpAd < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosOpAd);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_OP_AD_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosAdmonVentas !== -1 && indexSueldosAdmonVentas < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosAdmonVentas);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_ADMON_VENTAS_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosSYR !== -1 && indexSueldosSYR < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosSYR);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_SYR_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosApl !== -1 && indexSueldosApl < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosApl);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_APL_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     if(indexSueldosBon !== -1 && indexSueldosBon < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSueldosBon);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUELDOS_BONDEADO_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     // SERVICIOS ADMINISTRATIVOS
                     if(indexServiciosAdministrativos !== -1 && indexServiciosAdministrativos < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexServiciosAdministrativos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SERVICIOS_ADMINISTRATIVOS_PST = parseFloat(filteredValues[3]?.toString() || '0');
                     }
     
                     TOTAL_ELIMINACIONES_SERVICIOS_ADMINISTRATIVOS_DEBITO_PST = parseFloat((SERVICIOS_ADMINISTRATIVOS_PST).toFixed(2));
                     TOTAL_ELIMINACIONES_SERVICIOS_ADMINISTRATIVOS_CREDITO_PST = parseFloat((SERVICIOS_ADMINISTRATIVOS_PST).toFixed(2));
     
                     // PARTE DE LA BALANZA GENERAL PST
                     if(indexCaja !== -1 && indexCaja < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCaja);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CAJA = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexBancos !== -1 && indexBancos < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexBancos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         BANCOS = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexClientes !== -1 && indexClientes < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexClientes);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CLIENTES = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexProvisionCuentasIncobrables !== -1 && indexProvisionCuentasIncobrables < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexProvisionCuentasIncobrables);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         PROVISION_CUENTAS_INCOBRABLES = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexCtasCobrarFilialesOp !== -1 && indexCtasCobrarFilialesOp < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCtasCobrarFilialesOp);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CTAS_COBRAR_FILIALES_OP = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDocumentosPorCobrar !== -1 && indexDocumentosPorCobrar < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDocumentosPorCobrar);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DOCUMENTOS_POR_COBRAR = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDeudoresDiversos !== -1 && indexDeudoresDiversos < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDeudoresDiversos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEUDORES_DIVERSOS = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexAlmacenBondeado !== -1 && indexAlmacenBondeado < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexAlmacenBondeado);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         ALMACEN_BONDEADO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexPagosAnticipados !== -1 && indexPagosAnticipados < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexPagosAnticipados);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         PAGOS_ANTICIPADOS = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexIvaAcreditable !== -1 && indexIvaAcreditable < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexIvaAcreditable);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         // IVA_ACREDITABLE = parseFloat(filteredValues[4]?.toString() || '0');
                         IVA_ACREDITABLE = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexIvaPorAcreditar !== -1 && indexIvaPorAcreditar < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexIvaPorAcreditar);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         IVA_POR_ACREEDITAR = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexSubsidioAlEmpleo !== -1 && indexSubsidioAlEmpleo < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSubsidioAlEmpleo);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUBSIDIO_AL_EMPLEO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexImpuestosPagadosPorAnticipado !== -1 && indexImpuestosPagadosPorAnticipado < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexImpuestosPagadosPorAnticipado);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         IMPUESTOS_PAGADOS_POR_ANTICIPADO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     // PARTE DE LA BALANZA GENERAL PST PARTE FIJO
                     if(indexMobiliarioYEquipo !== -1 && indexMobiliarioYEquipo < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexMobiliarioYEquipo);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         MOBILIARIO_Y_EQUIPO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexAcumDepMob !== -1 && indexAcumDepMob < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexAcumDepMob);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         ACUMULADO_DEP_MOB = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDepAcumEqComputo !== -1 && indexDepAcumEqComputo < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumEqComputo);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         EQUIPO_DE_COMPUTO = parseFloat(filteredValues[5]?.toString() || '0');
                         EQUIPO_DE_COMPUTO = - (EQUIPO_DE_COMPUTO);
                     }
     
                     if(indexDepAcumEqComputo !== -1 && indexDepAcumEqComputo < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumEqComputo);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEP_ACUM_EQ_COMPUTO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexEquipoDeReparto !== -1 && indexEquipoDeReparto < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexEquipoDeReparto);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         EQUIPO_DE_REPARTO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDepAcumEqReparto !== -1 && indexDepAcumEqReparto < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumEqReparto);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEP_ACUM_EQ_REPARTO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexMobiliarioYEquipoAlmacen !== -1 && indexMobiliarioYEquipoAlmacen < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexMobiliarioYEquipoAlmacen);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         MOBILIARIO_Y_EQUIPO_ALMACEN = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDepAcumEqAlmacen !== -1 && indexDepAcumEqAlmacen < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumEqAlmacen);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEP_ACUM_EQ_ALMACEN = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexAlarmaYEqSeguridad !== -1 && indexAlarmaYEqSeguridad < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexAlarmaYEqSeguridad);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         ALARMA_Y_EQ_SEGURIDAD = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDepAcumAlarmaYEqSeguridad !== -1 && indexDepAcumAlarmaYEqSeguridad < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumAlarmaYEqSeguridad);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexMaquinariaEqPST !== -1 && indexMaquinariaEqPST < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexMaquinariaEqPST);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         MAQUINARIA_EQ_PST = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDepAcumMaquinariaEq !== -1 && indexDepAcumMaquinariaEq < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumMaquinariaEq);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEP_ACUM_MAQUINARIA_EQ = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexMoldesSuajadoPST !== -1 && indexMoldesSuajadoPST < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexMoldesSuajadoPST);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         MOLDES_SUAJADO_PST = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     if(indexDepAcumMoldesSuajado !== -1 && indexDepAcumMoldesSuajado < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepAcumMoldesSuajado);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEP_ACUM_MOLDES_SUAJADO = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     // BALANZA GENERAL PST PARTE DIFERIDO
                     if(indexDepositosGarantia !== -1 && indexDepositosGarantia < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexDepositosGarantia);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         DEPOSITOS_GARANTIA = parseFloat(filteredValues[5]?.toString() || '0');
                     }
     
                     // BALANZA GENERAL PST PARTE PASIVO CORTO PLAZO
                     if(indexProveedores !== -1 && indexProveedores < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexProveedores);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         PROVEEDORES = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexAcreedoresDiversos !== -1 && indexAcreedoresDiversos < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexAcreedoresDiversos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         ACREEDORES_DIVERSOS = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexCtasPagarFilialesOp !== -1 && indexCtasPagarFilialesOp < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCtasPagarFilialesOp);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CUENTAS_PAGAR_FILIALES_OP = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexIvaTrasladado !== -1 && indexIvaTrasladado < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexIvaTrasladado);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         IVA_TRASLADADO = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexIvaPorTrasladar !== -1 && indexIvaPorTrasladar < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexIvaPorTrasladar);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         IVA_POR_TRASLADAR = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexImpuestosRetenidos !== -1 && indexImpuestosRetenidos < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexImpuestosRetenidos);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         IMPUESTOS_RETENIDOS = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexImpuestosPropios !== -1 && indexImpuestosPropios < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexImpuestosPropios);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         IMPUESTOS_PROPIOS = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     // BALANZA GENERAL PST PARTE PASIVO LARGO PLAZO
                     if(indexCreditosBancarios !== -1 && indexCreditosBancarios < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCreditosBancarios);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CREDITOS_BANCARIOS = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     // BALANZA GENERAL PST PARTE CAPITAL
                     if(indexCapitalSocialFijo !== -1 && indexCapitalSocialFijo < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCapitalSocialFijo);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CAPITAL_SOCIAL_FIJO = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexCapitalSocialVariable !== -1 && indexCapitalSocialVariable < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexCapitalSocialVariable);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         CAPITAL_SOCIAL_VARIABLE = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexReservaLegal !== -1 && indexReservaLegal < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexReservaLegal);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         RESERVA_LEGAL = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexResultadoDeEjerciciosAnteriores !== -1 && indexResultadoDeEjerciciosAnteriores < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexResultadoDeEjerciciosAnteriores);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         RESULTADO_DE_EJERCICIOS_ANTERIORES = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexResultadoDelEjercicioReport !== -1 && indexResultadoDelEjercicioReport < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexResultadoDelEjercicioReport);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         RESULTADO_DEL_EJERCICIO_REPORT = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                     if(indexSuperavitDeficitActCapital !== -1 && indexSuperavitDeficitActCapital < rowValues.length - 1){
                         const correspondingValue = rowValues.slice(indexSuperavitDeficitActCapital);
                         const filteredValues = correspondingValue.filter(value => value !== undefined && value !== null && value !== '');
                         SUPERAVIT_DEFICIT_ACT_CAPITAL = parseFloat(filteredValues[6]?.toString() || '0');
                     }
     
                 }
             } 
     
             CLIENTES = CLIENTES - (PROVISION_CUENTAS_INCOBRABLES);
     
             SUMA_ACTIVO_CIRCULANTE = parseFloat((CAJA! + BANCOS! + CLIENTES! + PROVISION_CUENTAS_INCOBRABLES! + CTAS_COBRAR_FILIALES_OP! + DOCUMENTOS_POR_COBRAR! + DEUDORES_DIVERSOS! + ALMACEN_BONDEADO! + PAGOS_ANTICIPADOS! + IVA_ACREDITABLE! + IVA_POR_ACREEDITAR! + SUBSIDIO_AL_EMPLEO! + IMPUESTOS_PAGADOS_POR_ANTICIPADO).toFixed(2));
     
             SUMA_ACTIVO_FIJO = parseFloat((MOBILIARIO_Y_EQUIPO! + ACUMULADO_DEP_MOB! + EQUIPO_DE_COMPUTO! + DEP_ACUM_EQ_COMPUTO! + EQUIPO_DE_REPARTO! + DEP_ACUM_EQ_REPARTO! + MOBILIARIO_Y_EQUIPO_ALMACEN! + DEP_ACUM_EQ_ALMACEN! + ALARMA_Y_EQ_SEGURIDAD! + DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD! + MAQUINARIA_EQ_PST! + DEP_ACUM_MAQUINARIA_EQ! + MOLDES_SUAJADO_PST! + DEP_ACUM_MOLDES_SUAJADO!).toFixed(2));
     
             SUMA_ACTIVO_DIFERIDO = parseFloat((DEPOSITOS_GARANTIA!).toFixed(2));
     
             SUMA_PASIVO_CORTO_PLAZO = parseFloat((PROVEEDORES! + ACREEDORES_DIVERSOS! + CUENTAS_PAGAR_FILIALES_OP! + IVA_TRASLADADO! + IVA_POR_TRASLADAR! + IMPUESTOS_RETENIDOS! + IMPUESTOS_PROPIOS).toFixed(2));
     
             SUMA_PASIVO_LARGO_PLAZO = parseFloat((CREDITOS_BANCARIOS!).toFixed(2));
     
             RESULTADO_DEL_EJERCICIO = parseFloat((UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_EJERCICIO).toFixed(2));
     
             RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL = parseFloat(((RESULTADO_DE_EJERCICIOS_ANTERIORES!) + (RESULTADO_DEL_EJERCICIO_REPORT)).toFixed(2));
             CAPITAL_CONTABLE = parseFloat((CAPITAL_SOCIAL_FIJO! + CAPITAL_SOCIAL_VARIABLE! + RESERVA_LEGAL! + RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL! + RESULTADO_DEL_EJERCICIO! + SUPERAVIT_DEFICIT_ACT_CAPITAL!).toFixed(2));
     
     
             let pstER;
     
             pstER = {
                 ventasNetas: VENTAS_NETAS_PST_PERIODO,
                 costoVentas: COSTOS_DE_VENTAS_PST_PERIODO,
                 gastosAdmonVTA: GASTOS_DE_ADMON_Y_VTA_PST_PERIODO,
                 depreContable: DEPRECIACION_CONTABLE_PST_PERIODO,
                 gastosFinancieros: GASTOS_FINANCIEROS_PST_PERIODO,
                 perdidaFinanciera: PERDIDA_FINANCIERA_PST_PERIODO,
                 otrosIngresos: OTROS_INGRESOS_PST_PERIODO,
                 utlAntesIsrYPtuE: UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_EJERCICIO,
                 utlAntesIsrYPtuP: UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_PERIODO
             }
             
             let elim;
     
             elim = {
                 sueldosAdmon: SUELDOS_ADMON_PST,
                 sueldosLog: SUELDOS_LOG_PST,
                 sueldosDireccion: SUELDOS_DIRECCION_PST,
                 sueldosOpAd: SUELDOS_OP_AD_PST,
                 sueldosAdmonVentas: SUELDOS_ADMON_VENTAS_PST,
                 sueldosSYR: SUELDOS_SYR_PST,
                 sueldosApl: SUELDOS_APL_PST,
                 sueldosBon: SUELDOS_BONDEADO_PST,
                 totalElimDisD: TOTAL_ELIMINACIONES_DEBITO_PST,
                 totalElimDisC: TOTAL_ELIMINACIONES_CREDITO_PST,
                 totalElimSAD: TOTAL_ELIMINACIONES_SERVICIOS_ADMINISTRATIVOS_DEBITO_PST,
                 totalElimSAC: TOTAL_ELIMINACIONES_SERVICIOS_ADMINISTRATIVOS_CREDITO_PST,
                 costoVentas: COSTO_DE_VENTAS_CREDITO_PST,
                 serviciosAdmin: SERVICIOS_ADMINISTRATIVOS_PST,
                 superavitDefiActuD: SUPERAVIT_DEBITO_PST,
                 superavitDefiActuS: SERVICIOS_ADMINISTRATIVOS_PST
     
             };
     
             let afectPST;
     
             afectPST = {
                 caja: CAJA,
                 bancos: BANCOS,
                 clientes: CLIENTES,
                 provisionCuentasIncobrables: PROVISION_CUENTAS_INCOBRABLES,
                 ctasCobrarFilialesOp: CTAS_COBRAR_FILIALES_OP,
                 documentosPorCobrar: DOCUMENTOS_POR_COBRAR,
                 deudoresDiversos: DEUDORES_DIVERSOS,
                 almacenBondeado: ALMACEN_BONDEADO,
                 pagosAnticipados: PAGOS_ANTICIPADOS,
                 ivaAcreditable: IVA_ACREDITABLE,
                 ivaPorAcreditar: IVA_POR_ACREEDITAR,
                 subsidioAlEmpleo: SUBSIDIO_AL_EMPLEO,
                 impuestosPagadosPorAnticipado: IMPUESTOS_PAGADOS_POR_ANTICIPADO,
                 sumaActivoCirculante: SUMA_ACTIVO_CIRCULANTE,
                 mobiliarioYEquipo: MOBILIARIO_Y_EQUIPO,
                 acumDepMob: ACUMULADO_DEP_MOB,
                 equipoDeComputo: EQUIPO_DE_COMPUTO,
                 depAcumEqComputo: DEP_ACUM_EQ_COMPUTO,
                 equipoDeReparto: EQUIPO_DE_REPARTO,
                 depAcumEqReparto: DEP_ACUM_EQ_REPARTO,
                 mobiliarioYEquipoAlmacen: MOBILIARIO_Y_EQUIPO_ALMACEN,
                 depAcumEqAlmacen: DEP_ACUM_EQ_ALMACEN,
                 alarmaYEqSeguridad: ALARMA_Y_EQ_SEGURIDAD,
                 depAcumAlarmaYEqSeguridad: DEP_ACUM_ALARMA_Y_EQ_SEGURIDAD,
                 maquinariaEqPST: MAQUINARIA_EQ_PST,
                 depAcumMaquinariaEq: DEP_ACUM_MAQUINARIA_EQ,
                 moldesSuajadoPST: MOLDES_SUAJADO_PST,
                 depAcumMoldesSuajado: DEP_ACUM_MOLDES_SUAJADO,
                 sumaActivoFijo: SUMA_ACTIVO_FIJO,
                 depositosGarantia: DEPOSITOS_GARANTIA,
                 sumaActivoDiferido: SUMA_ACTIVO_DIFERIDO,
                 proveedores: PROVEEDORES,
                 acreedoresDiversos: ACREEDORES_DIVERSOS,
                 ctasPagarFilialesOp: CUENTAS_PAGAR_FILIALES_OP,
                 ivaTrasladado: IVA_TRASLADADO,
                 ivaPorTrasladar: IVA_POR_TRASLADAR,
                 impuestosRetenidos: IMPUESTOS_RETENIDOS,
                 impuestosPropios: IMPUESTOS_PROPIOS,
                 sumaPasivoCortoPlazo: SUMA_PASIVO_CORTO_PLAZO,
                 creditosBancarios: CREDITOS_BANCARIOS,
                 sumaPasivoLargoPlazo: SUMA_PASIVO_LARGO_PLAZO,
                 capitalSocialFijo: CAPITAL_SOCIAL_FIJO,
                 capitalSocialVariable: CAPITAL_SOCIAL_VARIABLE,
                 reservaLegal: RESERVA_LEGAL,
                 resultadoDeEjerciciosAnteriores: RESULTADO_DE_EJERCICIOS_ANTERIORES_FINAL,
                 resultadoDelEjercicio: RESULTADO_DEL_EJERCICIO,
                 superavitDeficitActCapital: SUPERAVIT_DEFICIT_ACT_CAPITAL,
                 capitalContable: CAPITAL_CONTABLE,
             }
     
             let pstERF;
     
             pstERF  = {
                 ventasP: VENTAS_PST_PERIODO,
                 ventasE: VENTAS_PST_EJERCICIO,
                 ventasActivosP: VENTAS_DE_ACTIVOS_PST_PERIODO,
                 ventasActivosE: VENTAS_DE_ACTIVOS_PST_EJERCICIO,
                 devolYDescVentaP: DEVOL_Y_DESCUENTOS_PST_PERIODO,
                 devolYDescVentaE: DEVOL_Y_DESCUENTOS_PST_EJERCICIO,
                 ventasNetasP: VENTAS_NETAS_PST_PERIODO,
                 ventasNetasE: VENTAS_NETAS_PST_EJERCICIO,
                 comprasP: COMPRAS_PST_PERIODO,
                 comprasE: COMPRAS_PST_EJERCICIO,
                 devDesYBoniComP: DEV_DESCTO_Y_BONIF_S_COMPRA_PST_PERIODO,
                 devDesYBoniComE: DEV_DESCTO_Y_BONIF_S_COMPRA_PST_EJERCICIO,
                 gastosFabriSYRP: GASTOS_FABRICACION_SYR_PST_PERIODO,
                 gastosFabriSYRE: GASTOS_FABRICACION_SYR_PST_EJERCICIO,
                 gastosFabriBondP: GASTOS_FABRICACION_BONDEADO_PST_PERIODO,
                 gastosFabriBondE: GASTOS_FABRICACION_BONDEADO_PST_EJERCICIO,
                 gastosFabriCascYAPLP: GASTOS_FABRICACION_CASCO_Y_APL_PST_PERIODO,
                 gastosFabriCascYAPLE: GASTOS_FABRICACION_CASCO_Y_APL_PST_EJERCICIO,
                 gastosOperaAdmonP: GASTOS_OPERATIVOS_ADMON_PST_PERIODO,
                 gastosOperaAdmonE: GASTOS_OPERATIVOS_ADMON_PST_EJERCICIO,
                 gastosRPSTP: GASTOS_R_PST_PERIODO,
                 gastosRPSTE: GASTOS_R_PST_EJERCICIO,
                 costoVentasP: COSTOS_DE_VENTAS_PST_PERIODO,
                 costoVentasE: COSTOS_DE_VENTAS_PST_EJERCICIO,
                 utilidadBrutaP: UTILIDAD_BRUTA_PST_PERIODO,
                 utilidadBrutaE: UTILIDAD_BRUTA_PST_EJERCICIO,
                 gastosAdminP: GASTOS_DE_ADMINISTRACION_PST_PERIODO,
                 gastosAdminE: GASTOS_DE_ADMINISTRACION_PST_EJERCICIO,
                 gastosVentasP: GASTOS_DE_VENTA_PST_PERIODO,
                 gastosVentasE: GASTOS_DE_VENTA_PST_EJERCICIO,
                 gastosLogisticaP: GASTOS_DE_LOGISTICA_PST_PERIODO,
                 gastosLogisticaE: GASTOS_DE_LOGISTICA_PST_EJERCICIO,
                 gastosDireccionP: GASTOS_DE_DIRECCION_PST_PERIODO,
                 gastosDireccionE: GASTOS_DE_DIRECCION_PST_EJERCICIO,
                 gastosAdmonYVTAP: GASTOS_DE_ADMON_Y_VTA_PST_PERIODO,
                 gastosAdmonYVTAE: GASTOS_DE_ADMON_Y_VTA_PST_EJERCICIO,
                 depreContableP: DEPRECIACION_CONTABLE_PST_PERIODO,
                 depreContableE: DEPRECIACION_CONTABLE_PST_EJERCICIO,
                 utilidadOperaP: UTILIDAD_DE_OPERACION_PST_PERIODO,
                 utilidadOperaE: UTILIDAD_DE_OPERACION_PST_EJERCICIO,
                 gastosFinancP: GASTOS_FINANCIEROS_PST_PERIODO,
                 gastosFinancE: GASTOS_FINANCIEROS_PST_EJERCICIO,
                 perdidaFinancP: PERDIDA_FINANCIERA_PST_PERIODO,
                 perdidaFinancE: PERDIDA_FINANCIERA_PST_EJERCICIO,
                 costoIntFinancP: COSTOS_INTEGRAL_FINANCIERO_PST_PERIODO,
                 costoIntFinancE: COSTOS_INTEGRAL_FINANCIERO_PST_EJERCICIO,
                 otrosIngresosP: OTROS_INGRESOS_PST_PERIODO,
                 otrosIngresosE: OTROS_INGRESOS_PST_EJERCICIO,
                 utilidadAntesIsrYPtuP: UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_PERIODO,
                 utilidadAntesIsrYPtuE: UTILIDAD_ANTES_DE_ISR_Y_PTU_PST_EJERCICIO
             }
     
             dataPSTBG(null, afectPST);
     
             dataCombinado(null, pstER, null, null, null, null);
     
             dataFinal(null, elim, null);
     
             datosAgrupadosReporte(null, null, pstERF, null, null, null, null, null);
            return true
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al subir el excel", errorResponse.code || 500);
        }
    }

    /**
     * POST mandar eliminaciones 
     * @Params eliminaciones
     * @returns respuesta
     */

    static async dataEliminaciones(eliminaciones: Eliminaciones): Promise<any>{
        try {
            let VENTAS_MAS_PST_VN = eliminaciones.ventasMASPAPST;
            let VENTAS_PST_MAS_VN = eliminaciones.ventasPSTAMASP;
            let RENTA_MAQUINARIA_VN = eliminaciones.rentaMaquinaria;
            let INGRESOS_PST_TRAMITE_VN = eliminaciones.ingresosPSTramite;
            let RENTA_BODEGA_VN = eliminaciones.rentaBodega;
            let INGRESOS_PST_IGUALA_VN = eliminaciones.ingresosPSTIguala;
            let INGRESOS_PST_COMISION_VN = eliminaciones.ingresosPSTComision;

            let SUELDOS_ADMON = eliminaciones.sueldosADMON;
            let SUELDOS_LOG = eliminaciones.sueldosLOG;
            let SUELDOS_DIRECCION = eliminaciones.sueldosDIRECCION;
            let SUELDOS_OP_AD = eliminaciones.sueldosOPAD;
            let SUELDOS_ADMON_VENTAS = eliminaciones.sueldosADMONVENTAS;
            let SUELDOS_SYR = eliminaciones.sueldosSYR;
            let SUELDOS_APL = eliminaciones.sueldosAPL;
            let SUELDOS_BONDEADO = eliminaciones.sueldosBONDEADO;

            let VENTAS_PST_MAS_CV = VENTAS_PST_MAS_VN;
            let RENTA_MAQUINARIA_CV = RENTA_MAQUINARIA_VN;
            let INGRESOS_PST_TRAMITE_CV = INGRESOS_PST_TRAMITE_VN;

            // VENTAS_MAS_PST_VN = VENTAS_MAS_PST_VN - RENTA_MAQUINARIA_VN - RENTA_BODEGA_VN;
            let VENTAS_MAS_PST_CV = VENTAS_MAS_PST_VN;

            let GASTOS_ADMON_VTA = RENTA_BODEGA_VN + INGRESOS_PST_IGUALA_VN + INGRESOS_PST_COMISION_VN;

            let VENTAS_NETAS_TOTALES = VENTAS_MAS_PST_VN + VENTAS_PST_MAS_VN + RENTA_MAQUINARIA_VN + INGRESOS_PST_TRAMITE_VN + RENTA_BODEGA_VN + INGRESOS_PST_IGUALA_VN + INGRESOS_PST_COMISION_VN;
            let COSTO_DE_VENTAS = VENTAS_MAS_PST_CV + VENTAS_PST_MAS_CV + RENTA_MAQUINARIA_CV + INGRESOS_PST_TRAMITE_CV;

            let SUMA = COSTO_DE_VENTAS + GASTOS_ADMON_VTA;

            let diferencia = 0;
            let diferencia2 = 0;

            // Condición para sacarr el superavit deficit por actualización para el debito
            if(SUMA > VENTAS_NETAS_TOTALES){
                diferencia = SUMA - VENTAS_NETAS_TOTALES;
            }

            // Condición para sacarr el superavit deficit por actualización para el credito
            if(VENTAS_NETAS_TOTALES > SUMA){
                diferencia2 = VENTAS_NETAS_TOTALES - SUMA;
            }

            let TOTAL_ELIMINACIONES_DEBITO = VENTAS_NETAS_TOTALES + diferencia;
            let TOTAL_ELIMINACIONES_CREDITO = COSTO_DE_VENTAS + GASTOS_ADMON_VTA + diferencia2;

            let dataElim;

            dataElim = {
                sueldosAdmonD: SUELDOS_ADMON,
                sueldosLogD: SUELDOS_LOG,
                sueldosDireccionD: SUELDOS_DIRECCION,
                sueldosOpAdD: SUELDOS_OP_AD,
                sueldosAdmonVentasD: SUELDOS_ADMON_VENTAS,
                sueldosSYRD: SUELDOS_SYR,
                sueldosAplD: SUELDOS_APL,
                sueldosBonD: SUELDOS_BONDEADO,
                totalElimInterD: TOTAL_ELIMINACIONES_DEBITO,
                totalElimInterC: TOTAL_ELIMINACIONES_CREDITO,
                ventasNetas: VENTAS_NETAS_TOTALES,
                costoVentas: COSTO_DE_VENTAS,
                gastosAdmonVTA: GASTOS_ADMON_VTA,
                superavitDefiActuI: diferencia,
            }

            dataFinal(dataElim, null, null);
            return true
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las eliminaciones", errorResponse.code || 500);
        }
    }

    /**
     * POST mandar etiquetas 
     * @Params etiquetas Etiquetas
     * @returns respuesta
     */

    static async dataEtiquetas(etiquetas: Etiquetas): Promise<any> {
        try {
            const etiquetasMasp: Etiquetas = {};
            const etiquetasPst: Etiquetas = {};

            for (const nombreEtiqueta in etiquetas) {
                if (Object.prototype.hasOwnProperty.call(etiquetas, nombreEtiqueta)) {
                    const valor = etiquetas[nombreEtiqueta];
                    if (typeof valor === 'number') {
                        if (nombreEtiqueta.includes('MASP')) {
                            // Etiqueta MASP
                            etiquetasMasp[nombreEtiqueta] = valor;
                        } else if (nombreEtiqueta.includes('PST')) {
                            // Etiqueta PST
                            etiquetasPst[nombreEtiqueta] = valor;
                        }
                    } else {
                        throw new ErrorResponse(`El valor de la etiqueta ${nombreEtiqueta} no es un número`, 400);
                    }
                }
            }

            // VARIABLES MASP
            let CLIENTES_MASP_1 = etiquetasMasp['MORA MASP'];
            let CLIENTES_MASP_2 = etiquetasMasp['NO EXIGIBLE MASP'];
            let CLIENTES_MASP_3 = etiquetasMasp['SUSPENSION MASP'];
            let CLIENTES_MASP_4 = etiquetasMasp['CXC FILIAL MASP'];
            let PROVISION_CUENTAS_INCOBRABLES_MASP = etiquetasMasp['SUSPENSION MASP'];
            let CTAS_COBRAR_FILIALES_OP_MASP_1 = etiquetasMasp['CXC FILIAL MASP'];
            let CTAS_COBRAR_FILIALES_OP_MASP_2 = etiquetasMasp['DIV FILIAL MASP'];
            let CTAS_COBRAR_FILIALES_OP_MASP_3 = etiquetasMasp['DXC FILIAL MASP'];
            let DOCUMENTOS_POR_COBRAR_MASP_1 = etiquetasMasp['DXC FILIAL MASP'];
            let DOCUMENTOS_POR_COBRAR_MASP_2 = etiquetasMasp['SALDAR DOC MASP'];
            let DEUDORES_DIVERSOS_MASP_1 = etiquetasMasp['DIV FILIAL MASP'];
            let DEUDORES_DIVERSOS_MASP_2 = etiquetasMasp['SALDAR DEU MASP'];
            let ALMACEN_GENERAL_MPR = etiquetasMasp['ACTUALIZAR MASP'];
            let MAQUINARIA_ARRENDAMIENTO_MASP = etiquetasMasp['CANCELAR MASP'];
            let ACUM_MAQUINARIA_ARRENDAMIENTO_MASP = etiquetasMasp['CANCELAR MASP'];
            let GASTOS_DE_INSTALACION_MASP = etiquetasMasp['AMORTIZAR MASP'];
            let AMORTI_ACUM_GTS_INSTALACION = etiquetasMasp['AMORTIZAR MASP'];
            let PROVEEDORES_MASP_1 = etiquetasMasp['ACUERDO MASP'];
            let PROVEEDORES_MASP_2 = etiquetasMasp['CXP FILIAL MASP'];
            let ACREEDORES_DIVERSOS_MASP_1 = etiquetasMasp['NO EXIGIBLE MASP'];
            let ACREEDORES_DIVERSOS_MASP_2 = etiquetasMasp['ACRE FILIAL MASP'];
            let ACREEDORES_DIVERSOS_MASP_3 = etiquetasMasp['PRESCRIPCION MASP'];
            let CTAS_PAGAR_FILIALES_OP_MASP_1 = etiquetasMasp['CXP FILIAL MASP'];
            let CTAS_PAGAR_FILIALES_OP_MASP_2 = etiquetasMasp['ACRE FILIAL MASP'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_1 = etiquetasMasp['MORA MASP'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_2 = etiquetasMasp['SALDAR DOC MASP'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_3 = etiquetasMasp['SALDAR DEU MASP'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_MASP_1 = etiquetasMasp['ACUERDO MASP'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_MASP_2 = etiquetasMasp['PRESCRIPCION MASP'];
            let SUPERAVIT_DEFICIT_ACT_CAPITAL_MASP = etiquetasMasp['ACTUALIZAR MASP'];
            
            // OPERACIONES DE LAS ETIQUETAS DE MASP
            let CLIENTES_MASP_FINAL = CLIENTES_MASP_1 + CLIENTES_MASP_2 + CLIENTES_MASP_3 + CLIENTES_MASP_4;
            let CTAS_COBRAR_FILIALES_OP_MASP_FINAL  = CTAS_COBRAR_FILIALES_OP_MASP_1 + CTAS_COBRAR_FILIALES_OP_MASP_2 + CTAS_COBRAR_FILIALES_OP_MASP_3;
            let DOCUMENTOS_POR_COBRAR_MASP_FINAL = DOCUMENTOS_POR_COBRAR_MASP_1 + DOCUMENTOS_POR_COBRAR_MASP_2;
            let DEUDORES_DIVERSOS_MASP_FINAL = DEUDORES_DIVERSOS_MASP_1 + DEUDORES_DIVERSOS_MASP_2;
            let PROVEEDORES_MASP_FINAL = PROVEEDORES_MASP_1 + PROVEEDORES_MASP_2;
            let ACREEDORES_DIVERSOS_MASP_FINAL = ACREEDORES_DIVERSOS_MASP_1 + ACREEDORES_DIVERSOS_MASP_2 + ACREEDORES_DIVERSOS_MASP_3;
            let CTAS_PAGAR_FILIALES_OP_MASP_FINAL = CTAS_PAGAR_FILIALES_OP_MASP_1 + CTAS_PAGAR_FILIALES_OP_MASP_2;
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_FINAL = RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_1 + RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_2 + RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_3;
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_MASP_FINAL = RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_MASP_1 + RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_MASP_2;


            let dataAfectMASP

            dataAfectMASP = {
                clientes: CLIENTES_MASP_FINAL,
                provCuentasInc: PROVISION_CUENTAS_INCOBRABLES_MASP,
                ctasCobrarFilOp: CTAS_COBRAR_FILIALES_OP_MASP_FINAL,
                docPorCobrar: DOCUMENTOS_POR_COBRAR_MASP_FINAL,
                deudoresDiversos: DEUDORES_DIVERSOS_MASP_FINAL,
                almacenGeneral: ALMACEN_GENERAL_MPR,
                maquinariaArrendamiento: MAQUINARIA_ARRENDAMIENTO_MASP,
                acumMaquinariaArrendamiento: ACUM_MAQUINARIA_ARRENDAMIENTO_MASP,
                gastosInstalacion: GASTOS_DE_INSTALACION_MASP,
                amortiAcumGtsInstalacion: AMORTI_ACUM_GTS_INSTALACION,
                proveedores: PROVEEDORES_MASP_FINAL,
                acreedoresDiversos: ACREEDORES_DIVERSOS_MASP_FINAL,
                ctasPagarFilOp: CTAS_PAGAR_FILIALES_OP_MASP_FINAL,
                resulEjAntDeudor: RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_MASP_FINAL,
                resulEjAntAcreedor: RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_MASP_FINAL,
                superavitDeficitCapital: SUPERAVIT_DEFICIT_ACT_CAPITAL_MASP
            }

            dataMASBG(dataAfectMASP, null);

            // VARIABLES PST
            let CLIENTES_PST_1 = etiquetasPst['MORA PST'];
            let CLIENTES_PST_2 = etiquetasPst['NO EXIGIBLE PST'];
            let CLIENTES_PST_3 = etiquetasPst['SUSPENSION PST'];
            let CLIENTES_PST_4 = etiquetasPst['CXC FILIAL PST'];
            let PROVISION_CUENTAS_INCOBRABLES_PST = etiquetasPst['SUSPENSION PST'];
            let CTAS_COBRAR_FILIALES_OP_PST_1 = etiquetasPst['CXC FILIAL PST'];
            let CTAS_COBRAR_FILIALES_OP_PST_2 = etiquetasPst['DIV FILIAL PST'];
            let CTAS_COBRAR_FILIALES_OP_PST_3 = etiquetasPst['DXC FILIAL PST'];
            let DOCUMENTOS_POR_COBRAR_PST_1 = etiquetasPst['DXC FILIAL PST'];
            let DOCUMENTOS_POR_COBRAR_PST_2 = etiquetasPst['SALDAR DOC PST'];
            let DEUDORES_DIVERSOS_PST_1 = etiquetasPst['DIV FILIAL PST'];
            let DEUDORES_DIVERSOS_PST_2 = etiquetasPst['SALDAR DEU PST'];
            let ALMACEN_BONDEADO = etiquetasPst['ACTUALIZAR PST'];
            let MAQUINARIA_ARRENDAMIENTO_PST = etiquetasPst['CANCELAR PST'];
            let ACUM_MAQUINARIA_ARRENDAMIENTO_PST = etiquetasPst['CANCELAR PST'];
            let GASTOS_DE_INSTALACION_PST = etiquetasPst['AMORTIZAR PST'];
            let AMORTI_ACUM_GTS_INSTALACION_PST = etiquetasPst['AMORTIZAR PST'];
            let PROVEEDORES_PST_1 = etiquetasPst['ACUERDO PST'];
            let PROVEEDORES_PST_2 = etiquetasPst['CXP FILIAL PST'];
            let ACREEDORES_DIVERSOS_PST_1 = etiquetasPst['NO EXIGIBLE PST'];
            let ACREEDORES_DIVERSOS_PST_2 = etiquetasPst['ACRE FILIAL PST'];
            let ACREEDORES_DIVERSOS_PST_3 = etiquetasPst['PRESCRIPCION PST'];
            let CTAS_PAGAR_FILIALES_OP_PST_1 = etiquetasPst['CXP FILIAL PST'];
            let CTAS_PAGAR_FILIALES_OP_PST_2 = etiquetasPst['ACRE FILIAL PST'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_1 = etiquetasPst['MORA PST'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_2 = etiquetasPst['SALDAR DOC PST'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_3 = etiquetasPst['SALDAR DEU PST'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_PST_1 = etiquetasPst['ACUERDO PST'];
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_PST_2 = etiquetasPst['PRESCRIPCION PST'];
            let SUPERAVIT_DEFICIT_ACT_CAPITAL_PST = etiquetasPst['ACTUALIZAR PST'];
            
            // OPERACIONES DE LAS ETIQUETAS DE PST
            let CLIENTES_PST_FINAL = CLIENTES_PST_1 + CLIENTES_PST_2 + CLIENTES_PST_3 + CLIENTES_PST_4;
            let CTAS_COBRAR_FILIALES_OP_PST_FINAL  = CTAS_COBRAR_FILIALES_OP_PST_1 + CTAS_COBRAR_FILIALES_OP_PST_2 + CTAS_COBRAR_FILIALES_OP_PST_3;
            let DOCUMENTOS_POR_COBRAR_PST_FINAL = DOCUMENTOS_POR_COBRAR_PST_1 + DOCUMENTOS_POR_COBRAR_PST_2;
            let DEUDORES_DIVERSOS_PST_FINAL = DEUDORES_DIVERSOS_PST_1 + DEUDORES_DIVERSOS_PST_2;
            let PROVEEDORES_PST_FINAL = PROVEEDORES_PST_1 + PROVEEDORES_PST_2;
            let ACREEDORES_DIVERSOS_PST_FINAL = ACREEDORES_DIVERSOS_PST_1 + ACREEDORES_DIVERSOS_PST_2 + ACREEDORES_DIVERSOS_PST_3;
            let CTAS_PAGAR_FILIALES_OP_PST_FINAL = CTAS_PAGAR_FILIALES_OP_PST_1 + CTAS_PAGAR_FILIALES_OP_PST_2;
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_FINAL = RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_1 + RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_2 + RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_3;
            let RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_PST_FINAL = RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_PST_1 + RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_PST_2;

            let dataAfectPST;

            dataAfectPST = {
                clientes: CLIENTES_PST_FINAL,
                provCuentasInc: PROVISION_CUENTAS_INCOBRABLES_PST,
                ctasCobrarFilOp: CTAS_COBRAR_FILIALES_OP_PST_FINAL,
                docPorCobrar: DOCUMENTOS_POR_COBRAR_PST_FINAL,
                deudoresDiversos: DEUDORES_DIVERSOS_PST_FINAL,
                almacenBon: ALMACEN_BONDEADO,
                maqArrendamiento: MAQUINARIA_ARRENDAMIENTO_PST,
                acumMaqArrendamiento: ACUM_MAQUINARIA_ARRENDAMIENTO_PST,
                gastosInstalacion: GASTOS_DE_INSTALACION_PST,
                amortGtsInstalacion: AMORTI_ACUM_GTS_INSTALACION_PST,
                proveedores: PROVEEDORES_PST_FINAL,
                acreedoresDiversos: ACREEDORES_DIVERSOS_PST_FINAL,
                ctasPagarFilOp: CTAS_PAGAR_FILIALES_OP_PST_FINAL,
                resulEjAntDeudor: RESULTADOS_DE_EJERCICIOS_ANTERIORES_DEUDOR_PST_FINAL,
                resulEjAntAcreedor: RESULTADOS_DE_EJERCICIOS_ANTERIORES_ACREEDOR_PST_FINAL,
                superavitDeficit: SUPERAVIT_DEFICIT_ACT_CAPITAL_PST
            }

            dataPSTBG(dataAfectPST, null);
            return true
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las etiquetas", errorResponse.code || 500);
        }
    }

    /**
     * POST mandar bg 
     * @Params bg BG
     * @returns respuesta
     */

    static async dataBG(bg: BG): Promise<any> {
        try {
            let UTILIDADES_RETENIDAS_MASP = bg.utilidadesRetenidasMASP;
            let UTILIDADES_RETENIDAS_PST = bg.utilidadesRetenidasPST;
            let SUPERAVIT_ACTUALIZACION_ANTERIOR = bg.superavitDefiActuAntes;
            let UTILIDADES_RETENIDAS_ANTERIOR = bg.utilidadesRetenidasAnterior;
            let UTILIDADES_EJERCICIO_ANTERIOR = bg.utilidadesEjercicioAnterior;
        
            let dataBG;
        
            dataBG = {
                utilidadesRetenidasMASP: UTILIDADES_RETENIDAS_MASP,
                utilidadesRetenidasPST: UTILIDADES_RETENIDAS_PST,
                superavitDefiActuAntes: SUPERAVIT_ACTUALIZACION_ANTERIOR,
                utilidadesRetenidasAnterior: UTILIDADES_RETENIDAS_ANTERIOR,
                utilidadesEjercicioAnterior: UTILIDADES_EJERCICIO_ANTERIOR
            }
        
            dataCombinado(null, null, null, null, null, dataBG);
            return true
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener el bg", errorResponse.code || 500);
        }
    }

    /**
     * CREATE log Reporte
     * @Params logReporte logReporte
     * @returns New log Reporte
     */
    static async createLogReporte(historialReporte: HistorialReporte): Promise<HistorialReporte> {
        try {
            const etiquetaRepo = getRepository(HistorialReporte);
            const newLogReporte = etiquetaRepo.create(historialReporte);
            return newLogReporte;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al crear la factura", errorResponse.code || 500);
        }
    }

    /**
     * GET Datos Reporte
     * @returns List of datos reportes
     */
    static async datosReporteEstadoFlujoEfectivo(): Promise<any> {
        try {
            const isApi = true
            const groupedData = datosAgrupadosReporte(isApi, null, null, null, null, null, null, null);
            return groupedData;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los datos del reporte", errorResponse.code || 500);
        }
    }

    /**
     * GET Logs Reportes
     * @returns List of Logs Reportes
     */
    static async getLogsReportes(): Promise<HistorialReporte[]> {
        try {
            const logReporteRepo = getRepository(HistorialReporte);
            const logsReportes = await logReporteRepo.find();
            return logsReportes;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener los logs de reportes", errorResponse.code || 500);
        }
    }

    /**
     * UPDATE etiqueta Clientes
     * @Params id Etiqueta Cliente id
     * @Params Etiqueta cliente to asign
     * @returns Cliente edit
     */

    static async editEtiquetaCliente(id: string, etiqueta: string): Promise<Cliente> {
        try {
            const ClienteRepo = getRepository(Cliente);
            const ClienteExists = await ClienteRepo.findById(id);
            if(!ClienteExists){
                throw new ErrorResponse(`No se encontro ningun cliente con el id: ${id} `, 204);
            }
            const ClienteEdited = await ClienteRepo.update({...ClienteExists, etiqueta: etiqueta})
            return ClienteEdited;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al editar la factura", errorResponse.code || 500);
        }
    }

    /**
     *  CREATE etiqueta Etiqueta Cliente
     * @Params etiqueta Etiqueta Cliente
     * @returns new Etiqueta Cliente
     */
    static async createEtiquetaCliente(etiqueta: EtiquetaCliente): Promise<Etiqueta> {
        try {
            const etiquetaClienteRepo = getRepository(EtiquetaCliente);
            const newEtiquetaCliente = await etiquetaClienteRepo.create(etiqueta);
            return newEtiquetaCliente;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al crear la factura", errorResponse.code || 500);
        }
    }

    /**
     * GET Etiquetas Cliente
     * @returns List of Etiquetas Cliente
     */
    static async getEtiquetasCliente(): Promise<EtiquetaCliente[]>{
        try {
            const etiquetaClienteRepo = getRepository(EtiquetaCliente);
            const etiquetasClienteList = await etiquetaClienteRepo.find();
            if(etiquetasClienteList.length == 0){
                throw new ErrorResponse("No se encontro ninguna etiqueta", 204);
            }
            return etiquetasClienteList;
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            throw new ErrorResponse(errorResponse.message || "Error al obtener las etiquetas", errorResponse.code || 500);
        }
    }
}