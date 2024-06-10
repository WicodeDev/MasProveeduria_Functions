

export function groupFacturasByReferencia(facturas: any[]) {
    const groupedFacturas: { [key: string]: any[] } = {};
    facturas.forEach((factura) => {
        const referencia = factura.referencia;
        if (!groupedFacturas[referencia]) {
            groupedFacturas[referencia] = [];
        }
        groupedFacturas[referencia].push(factura);
    });
    return Object.values(groupedFacturas);
}

let receivedData = {
    dataElim: false,
    dataPST: false,
    dataMASP: false
};

let storedData: {
    dataElim: any | null,
    dataPST: any | null,
    dataMASP: any | null
} = {
    dataElim: null,
    dataPST: null,
    dataMASP: null
};

let dataCount = 0;

// Funcion que junta  los 3 datos 
export function dataFinal (dataElim: any, dataPST: any, dataMASP: any) {

    if (dataElim) {
        receivedData.dataElim = true;
        storedData.dataElim = dataElim;
        dataCount++;
    }

    if (dataPST) {
        receivedData.dataPST = true;
        storedData.dataPST = dataPST;
        dataCount++;
    }

    if (dataMASP) {
        receivedData.dataMASP = true;
        storedData.dataMASP = dataMASP;
        dataCount++;
    }

    
    if(dataCount === 3){

        let COSTO_DE_VENTAS_NOMINA = 0;
        let GASTOS_ADMON_VTA_NOMINA = 0;
        let SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA = 0;
        let TOTAL_ELIMINACIONES_DEBITO_NOMINA = 0;
        let TOTAL_ELIMINACIONES_CREDITO_NOMINA = 0;
        let SUMA_DEBITO_A = 0;
        let SUMA_CREDITO_A = 0;
        let SUMA_DEBITO_B = 0;
        let SUMA_CREDITO_B = 0;

        const safeValue = (value: any) => value || 0;
        
        SUMA_DEBITO_B = safeValue(storedData.dataElim?.sueldosSYRD) + safeValue(storedData.dataElim?.sueldosAplD) + safeValue(storedData.dataElim?.sueldosBonD);
        SUMA_CREDITO_B = safeValue(storedData.dataPST?.sueldosSYR) + safeValue(storedData.dataPST?.sueldosApl) + safeValue(storedData.dataPST?.sueldosBon);

        if(SUMA_DEBITO_B > SUMA_CREDITO_B){
            COSTO_DE_VENTAS_NOMINA = SUMA_DEBITO_B - SUMA_CREDITO_B;
        }

        SUMA_DEBITO_A = safeValue(storedData.dataElim?.sueldosAdmonD) + safeValue(storedData.dataElim?.sueldosLogD) + safeValue(storedData.dataElim?.sueldosDireccionD) + safeValue(storedData.dataElim?.sueldosOpAdD) + safeValue(storedData.dataElim?.sueldosAdmonVentasD);
        SUMA_CREDITO_A = safeValue(storedData.dataMASP?.sueldosAdmon) +  safeValue(storedData.dataPST?.sueldosAdmon) + safeValue(storedData.dataPST?.sueldosLog) + safeValue(storedData.dataPST?.sueldosDireccion) + safeValue(storedData.dataPST?.sueldosOpAd) + safeValue(storedData.dataPST?.sueldosAdmonVentas);

        if(SUMA_DEBITO_A > SUMA_CREDITO_A){
            GASTOS_ADMON_VTA_NOMINA = SUMA_DEBITO_A - SUMA_CREDITO_A;
        }

        SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA = COSTO_DE_VENTAS_NOMINA + GASTOS_ADMON_VTA_NOMINA;

        if(SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA > 0){
            SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA = SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA;
        }

        TOTAL_ELIMINACIONES_DEBITO_NOMINA =  parseFloat((COSTO_DE_VENTAS_NOMINA + GASTOS_ADMON_VTA_NOMINA).toFixed(2));
        TOTAL_ELIMINACIONES_CREDITO_NOMINA = parseFloat((SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA).toFixed(2));

        let elim;

        elim = {
            ventasNetas: storedData.dataElim?.ventasNetas,
            costosVentasN: COSTO_DE_VENTAS_NOMINA,
            costoVentasI: storedData.dataElim?.costoVentas,
            costoVentasR: storedData.dataPST?.costoVentas,
            gastosAdmonVtaN: GASTOS_ADMON_VTA_NOMINA,
            gastosAdmonVtaI: storedData.dataElim?.gastosAdmonVTA,
            serviciosAdmin: storedData.dataPST?.serviciosAdmin,
            superavitDefiActuN: SUPERAVIT_DEFICIT_ACTUALIZACION_NOMINA,
            superavitDefiActuI: storedData.dataElim?.superavitDefiActuI
        };

        dataCombinado(null, null, elim, null, null, null);

        dataCount = 0;
        receivedData = {
            dataElim: false,
            dataPST: false,
            dataMASP: false
        };
    } else {
    }
}


let receivedDataAfec = {
    dataAfectMASP: false,
    afectMASP: false
};

let storedDataAfect: {
    dataAfectMASP: any | null,
    afectMASP: any | null
} = {
    dataAfectMASP: null,
    afectMASP: null
};

let dataCountAfect = 0;

export function dataMASBG (dataAfectMASP: any, afectMASP: any){

    if (dataAfectMASP) {
        receivedDataAfec.dataAfectMASP = true;
        storedDataAfect.dataAfectMASP = dataAfectMASP;
        dataCountAfect++;
    }

    if(afectMASP){
        receivedDataAfec.afectMASP = true;
        storedDataAfect.afectMASP = afectMASP;
        dataCountAfect++;
    }

    if(dataCountAfect === 2){
        const safeValue = (value: any) => value || 0;

        let CLIENTES_AFECTACIONES = 0;
        let PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES = 0;
        let CTAS_COBRAR_FILIALES_OP_AFECTACIONES = 0;
        let DOCUMENTOS_POR_COBRAR_AFECTACIONES = 0;
        let DEUDORES_DIVERSOS_AFECTACIONES = 0;
        let ALMACEN_GENERAL_AFECTACIONES = 0;
        let SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES = 0;

        CLIENTES_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.clientes) - safeValue(storedDataAfect.dataAfectMASP?.clientes);
        PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.provisionCuentasIncobrables) + safeValue(storedDataAfect.dataAfectMASP?.provCuentasInc);
        CTAS_COBRAR_FILIALES_OP_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.ctasCobrarFiliales) + safeValue(storedDataAfect.dataAfectMASP?.ctasCobrarFilOp);
        DOCUMENTOS_POR_COBRAR_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.documentosPorCobrar) - safeValue(storedDataAfect.dataAfectMASP?.docPorCobrar);
        DEUDORES_DIVERSOS_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.deudoresDiversos) - safeValue(storedDataAfect.dataAfectMASP?.deudoresDiversos);
        ALMACEN_GENERAL_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.almacenGeneralMPR) - safeValue(storedDataAfect.dataAfectMASP?.almacenGeneral);

        SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.caja) + safeValue(storedDataAfect.afectMASP?.bancos) +CLIENTES_AFECTACIONES + PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES + CTAS_COBRAR_FILIALES_OP_AFECTACIONES + DOCUMENTOS_POR_COBRAR_AFECTACIONES + DEUDORES_DIVERSOS_AFECTACIONES + ALMACEN_GENERAL_AFECTACIONES + safeValue(storedDataAfect.afectMASP?.pagosAnticipados) + safeValue(storedDataAfect.afectMASP?.ivaAcreditable) + safeValue(storedDataAfect.afectMASP?.ivaPorAcreditar) + safeValue(storedDataAfect.afectMASP?.subsidioAlEmpleo) + safeValue(storedDataAfect.afectMASP?.impuestosPagadosPorAnticipado);

        // VARIABLES MAS BG FIJO
        let MAQUINARIA_ARRENDAMIENTO_AFECTACIONES = 0;
        let ACUM_MAQUINARIA_ARRENDAMIENTO_AFECTACIONES = 0;
        let SUMA_ACTIVO_FIJO_AFECTACIONES = 0;

        MAQUINARIA_ARRENDAMIENTO_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.maquinariaArrendamiento) - safeValue(storedDataAfect.dataAfectMASP?.maquinariaArrendamiento);
        ACUM_MAQUINARIA_ARRENDAMIENTO_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.acumMaquinariaArrendamiento) + safeValue(storedDataAfect.dataAfectMASP?.acumMaquinariaArrendamiento);

        SUMA_ACTIVO_FIJO_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.mobYEQOficina) + safeValue(storedDataAfect.afectMASP?.acumDepMob) + safeValue(storedDataAfect.afectMASP?.equipoDeComputo) + safeValue(storedDataAfect.afectMASP?.depAcumEqComputo) + safeValue(storedDataAfect.afectMASP?.equipoDeReparto) + safeValue(storedDataAfect.afectMASP?.depAcumEqReparto) + safeValue(storedDataAfect.afectMASP?.mobYEQAlmacen) + safeValue(storedDataAfect.afectMASP?.depAcumEQAlmacen) + safeValue(storedDataAfect.afectMASP?.alarmaYEqSeguridad) + safeValue(storedDataAfect.afectMASP?.depAcumAlarmaYEqSeguridad) + MAQUINARIA_ARRENDAMIENTO_AFECTACIONES + ACUM_MAQUINARIA_ARRENDAMIENTO_AFECTACIONES + safeValue(storedDataAfect.afectMASP?.depAcumMaquinariaYEquipo);

        // VARIABLES MAS BG DIFERIDO
        let GASTOS_DE_INSTALACION_AFECTACIONES = 0;
        let AMORTI_ACUM_GTS_INSTALACION_AFECTACIONES = 0;
        let SUMA_ACTIVO_DIFERIDO_AFECTACIONES = 0;
        let SUMA_EL_ACTIVO = 0;
        let SUMA_EL_ACTIVO_AFECTACIONES = 0;

        GASTOS_DE_INSTALACION_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.gastosDeInstalacion) - safeValue(storedDataAfect.dataAfectMASP?.gastosInstalacion);
        AMORTI_ACUM_GTS_INSTALACION_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.amortiAcumGtsInstalacion) + safeValue(storedDataAfect.dataAfectMASP?.amortiAcumGtsInstalacion);

        SUMA_ACTIVO_DIFERIDO_AFECTACIONES = GASTOS_DE_INSTALACION_AFECTACIONES + AMORTI_ACUM_GTS_INSTALACION_AFECTACIONES + safeValue(storedDataAfect.afectMASP?.depositosGarantia);

        SUMA_EL_ACTIVO = safeValue(storedDataAfect.afectMASP?.sumaActivoCirculante) + safeValue(storedDataAfect.afectMASP?.sumaActivoFijo) + safeValue(storedDataAfect.afectMASP?.sumaActivoDiferido);
        SUMA_EL_ACTIVO_AFECTACIONES = SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES + SUMA_ACTIVO_FIJO_AFECTACIONES + SUMA_ACTIVO_DIFERIDO_AFECTACIONES;

        // VATIABLES MAS BG PASIVO CORTO PLAZO
        let PROVEEDORES_AFECTACIONES = 0;
        let ACREEDORES_DIVERSOS_AFECTACIONES = 0;
        let CTAS_PAGAR_FILIALES_OP_AFECTACIONES = 0;
        let SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES = 0;

        PROVEEDORES_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.proveedores) - safeValue(storedDataAfect.dataAfectMASP?.proveedores);
        ACREEDORES_DIVERSOS_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.acreedoresDiversos) - safeValue(storedDataAfect.dataAfectMASP?.acreedoresDiversos);
        CTAS_PAGAR_FILIALES_OP_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.ctasPagarFilOp) + safeValue(storedDataAfect.dataAfectMASP?.ctasPagarFilOp);

        SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES = PROVEEDORES_AFECTACIONES + ACREEDORES_DIVERSOS_AFECTACIONES + CTAS_PAGAR_FILIALES_OP_AFECTACIONES + safeValue(storedDataAfect.afectMASP?.ivaTrasladado) + safeValue(storedDataAfect.afectMASP?.ivaPorTrasladar) + safeValue(storedDataAfect.afectMASP?.impuestosRetenidos) + safeValue(storedDataAfect.afectMASP?.impuestosPropios);

        // VARIABLES MAS BG PASIVO LARGO PLAZO
        let SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES = 0;
        let SUMA_EL_PASIVO = 0;
        let SUMA_EL_PASIVO_AFECTACIONES = 0;

        SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.creditosBancarios);

        SUMA_EL_PASIVO = safeValue(storedDataAfect.afectMASP?.sumaPasivoCortoPlazo) + safeValue(storedDataAfect.afectMASP?.sumaPasivoLargoPlazo);
        SUMA_EL_PASIVO_AFECTACIONES = SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES + SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES;

        // VARIABLES MAS BG CAPITAL
        let RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES = 0;
        let SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES = 0;
        let SUMA_CAPITAL_CONTABLE_AFECTACIONES = 0;
        let SUMA_PASIVO_CAPITAL = 0;
        let SUMA_PASIVO_CAPITAL_AFECTACIONES = 0;

        RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.resultadoDeEjerciciosAnteriores) + safeValue(storedDataAfect.dataAfectMASP?.resulEjAntAcreedor) - safeValue(storedDataAfect.dataAfectMASP?.resulEjAntDeudor);
        SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.superavitDeficitCapital) - safeValue(storedDataAfect.dataAfectMASP?.superavitDeficitCapital);

        SUMA_CAPITAL_CONTABLE_AFECTACIONES = safeValue(storedDataAfect.afectMASP?.capitalSocialFijo) + safeValue(storedDataAfect.afectMASP?.capitalSocialVariable) + safeValue(storedDataAfect.afectMASP?.reservaLegal) + RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES + safeValue(storedDataAfect.afectMASP?.resultadoDelEjercicio)  + SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES;

        SUMA_PASIVO_CAPITAL = SUMA_EL_PASIVO + safeValue(storedDataAfect.afectMASP?.capitalContable);
        SUMA_PASIVO_CAPITAL_AFECTACIONES = SUMA_EL_PASIVO_AFECTACIONES + SUMA_CAPITAL_CONTABLE_AFECTACIONES;

        let masBG;

        // 

        masBG = {
            caja: storedDataAfect.afectMASP?.caja,
            bancos: storedDataAfect.afectMASP?.bancos,
            clientes: CLIENTES_AFECTACIONES,
            ctasCobrarFilOp: CTAS_COBRAR_FILIALES_OP_AFECTACIONES,
            almacenGeneral: ALMACEN_GENERAL_AFECTACIONES,
            pagosAnti: storedDataAfect.afectMASP?.pagosAnticipados,
            provCuenInc: PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES,
            docCobrar: DOCUMENTOS_POR_COBRAR_AFECTACIONES,
            deudoresDiversos: DEUDORES_DIVERSOS_AFECTACIONES,
            ivAcred: storedDataAfect.afectMASP?.ivaAcreditable,
            ivaPAcred: storedDataAfect.afectMASP?.ivaPorAcreditar,
            subEmpleo: storedDataAfect.afectMASP?.subsidioAlEmpleo,
            impPagAnt: storedDataAfect.afectMASP?.impuestosPagadosPorAnticipado,
            mobYEQOficina: storedDataAfect.afectMASP?.mobYEQOficina,
            equipoDeComputo: storedDataAfect.afectMASP?.equipoDeComputo,
            mobYEQAlmacen: storedDataAfect.afectMASP?.mobYEQAlmacen,
            alarmaYEqSeguridad: storedDataAfect.afectMASP?.alarmaYEqSeguridad,
            maquinariaArrendamiento: MAQUINARIA_ARRENDAMIENTO_AFECTACIONES,
            equipoDeReparto: storedDataAfect.afectMASP?.equipoDeReparto,
            acumDepMob: storedDataAfect.afectMASP?.acumDepMob,
            depAcumEqComputo: storedDataAfect.afectMASP?.depAcumEqComputo,
            depAcumEqReparto: storedDataAfect.afectMASP?.depAcumEqReparto,
            depAcumEQAlmacen: storedDataAfect.afectMASP?.depAcumEQAlmacen,
            depAcumAlarmaYEqSeguridad: storedDataAfect.afectMASP?.depAcumAlarmaYEqSeguridad,
            acumMaquinariaArrendamiento: ACUM_MAQUINARIA_ARRENDAMIENTO_AFECTACIONES,
            depAcumMaquinariaYEquipo: storedDataAfect.afectMASP?.depAcumMaquinariaYEquipo,
            sumaActivoDiferido: SUMA_ACTIVO_DIFERIDO_AFECTACIONES,
            proveedores: PROVEEDORES_AFECTACIONES,
            ctasPagFilOP: CTAS_PAGAR_FILIALES_OP_AFECTACIONES,
            ivaTrasladado: storedDataAfect.afectMASP?.ivaTrasladado,
            ivaPTrasladar: storedDataAfect.afectMASP?.ivaPorTrasladar,
            impRetenidos: storedDataAfect.afectMASP?.impuestosRetenidos,
            impPropios: storedDataAfect.afectMASP?.impuestosPropios,
            acreedoresDiversos: ACREEDORES_DIVERSOS_AFECTACIONES,
            creditosBancarios: storedDataAfect.afectMASP?.creditosBancarios,
            capitalSocialFijo: storedDataAfect.afectMASP?.capitalSocialFijo,
            capitalSocialVariable: storedDataAfect.afectMASP?.capitalSocialVariable,
            reservaLegal: storedDataAfect.afectMASP?.reservaLegal,
            resultadoDelEjercicio: RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES,
            superavitDefictCapital: SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES,
        }

        let masBGF;

        masBGF = {
            cajaN: storedDataAfect.afectMASP?.caja,
            cajaA: storedDataAfect.afectMASP?.caja,
            bancosN: storedDataAfect.afectMASP?.bancos,
            bancosA: storedDataAfect.afectMASP?.bancos,
            clientesN: storedDataAfect.afectMASP?.clientes,
            clientesA: CLIENTES_AFECTACIONES,
            provCuentIncoN: storedDataAfect.afectMASP?.provisionCuentasIncobrables,
            provCuentIncoA: PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES,
            ctasCobrarFilN: storedDataAfect.afectMASP?.ctasCobrarFiliales,
            ctasCobrarFilA: CTAS_COBRAR_FILIALES_OP_AFECTACIONES,
            docPorCobrarN: storedDataAfect.afectMASP?.documentosPorCobrar,
            docPorCobrarA: DOCUMENTOS_POR_COBRAR_AFECTACIONES,
            deudoresDivN: storedDataAfect.afectMASP?.deudoresDiversos,
            deudoresDivA: DEUDORES_DIVERSOS_AFECTACIONES,
            almacenGeneralN: storedDataAfect.afectMASP?.almacenGeneralMPR,
            almacenGeneralA: ALMACEN_GENERAL_AFECTACIONES,
            pagosAnticipN: storedDataAfect.afectMASP?.pagosAnticipados,
            pagosAnticipA: storedDataAfect.afectMASP?.pagosAnticipados,
            ivaAcredN: storedDataAfect.afectMASP?.ivaAcreditable,
            ivaAcredA: storedDataAfect.afectMASP?.ivaAcreditable,
            ivaPorAcredN: storedDataAfect.afectMASP?.ivaPorAcreditar,
            ivaPorAcredA: storedDataAfect.afectMASP?.ivaPorAcreditar,
            subsidioEmpleoN: storedDataAfect.afectMASP?.subsidioAlEmpleo,
            subsidioEmpleoA: storedDataAfect.afectMASP?.subsidioAlEmpleo,
            impPagAntN: storedDataAfect.afectMASP?.impuestosPagadosPorAnticipado,
            impPagAntA: storedDataAfect.afectMASP?.impuestosPagadosPorAnticipado,
            sumaActivoCircN: storedDataAfect.afectMASP?.sumaActivoCirculante,
            sumaActivoCircA: SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES,
            mobYEQOficinaN: storedDataAfect.afectMASP?.mobYEQOficina,
            mobYEQOficinaA: storedDataAfect.afectMASP?.mobYEQOficina,
            acumDepMobN: storedDataAfect.afectMASP?.acumDepMob,
            acumDepMobA: storedDataAfect.afectMASP?.acumDepMob,
            equipoDeComputoN: storedDataAfect.afectMASP?.equipoDeComputo,
            equipoDeComputoA: storedDataAfect.afectMASP?.equipoDeComputo,
            depAcumEqComputoN: storedDataAfect.afectMASP?.depAcumEqComputo,
            depAcumEqComputoA: storedDataAfect.afectMASP?.depAcumEqComputo,
            equipoDeRepartoN: storedDataAfect.afectMASP?.equipoDeReparto,
            equipoDeRepartoA: storedDataAfect.afectMASP?.equipoDeReparto,
            depAcumEqRepartoN: storedDataAfect.afectMASP?.depAcumEqReparto,
            depAcumEqRepartoA: storedDataAfect.afectMASP?.depAcumEqReparto,
            mobYEQAlmacenN: storedDataAfect.afectMASP?.mobYEQAlmacen,
            mobYEQAlmacenA: storedDataAfect.afectMASP?.mobYEQAlmacen,
            depAcumEQAlmacenN: storedDataAfect.afectMASP?.depAcumEQAlmacen,
            depAcumEQAlmacenA: storedDataAfect.afectMASP?.depAcumEQAlmacen,
            alarmaYEqSeguridadN: storedDataAfect.afectMASP?.alarmaYEqSeguridad,
            alarmaYEqSeguridadA: storedDataAfect.afectMASP?.alarmaYEqSeguridad,
            depAcumAlarmaYEqSeguridadN: storedDataAfect.afectMASP?.depAcumAlarmaYEqSeguridad,
            depAcumAlarmaYEqSeguridadA: storedDataAfect.afectMASP?.depAcumAlarmaYEqSeguridad,
            maquinariaArrendamientoN: storedDataAfect.afectMASP?.maquinariaArrendamiento,
            maquinariaArrendamientoA: MAQUINARIA_ARRENDAMIENTO_AFECTACIONES,
            acumMaquinariaArrendamientoN: storedDataAfect.afectMASP?.acumMaquinariaArrendamiento,
            acumMaquinariaArrendamientoA: ACUM_MAQUINARIA_ARRENDAMIENTO_AFECTACIONES,
            depAcumMaquinariaYEquipoN: storedDataAfect.afectMASP?.depAcumMaquinariaYEquipo,
            depAcumMaquinariaYEquipoA: storedDataAfect.afectMASP?.depAcumMaquinariaYEquipo,
            sumaActivoFijoN: storedDataAfect.afectMASP?.sumaActivoFijo,
            sumaActivoFijoA: SUMA_ACTIVO_FIJO_AFECTACIONES,
            gastosDeInstalacionN: storedDataAfect.afectMASP?.gastosDeInstalacion,
            gastosDeInstalacionA: GASTOS_DE_INSTALACION_AFECTACIONES,
            amortiAcumGtsInstalacionN: storedDataAfect.afectMASP?.amortiAcumGtsInstalacion,
            amortiAcumGtsInstalacionA: AMORTI_ACUM_GTS_INSTALACION_AFECTACIONES,
            depositosGarantiaN: storedDataAfect.afectMASP?.depositosGarantia,
            depositosGarantiaA: storedDataAfect.afectMASP?.depositosGarantia,
            sumaActivoDiferidoN: storedDataAfect.afectMASP?.sumaActivoDiferido,
            sumaActivoDiferidoA: SUMA_ACTIVO_DIFERIDO_AFECTACIONES,
            sumaActivoN: SUMA_EL_ACTIVO,
            sumaActivoA: SUMA_EL_ACTIVO_AFECTACIONES,
            proveedoresN: storedDataAfect.afectMASP?.proveedores,
            proveedoresA: PROVEEDORES_AFECTACIONES,
            acreedoresDiversosN: storedDataAfect.afectMASP?.acreedoresDiversos,
            acreedoresDiversosA: ACREEDORES_DIVERSOS_AFECTACIONES,
            ctasPagarFilOpN: storedDataAfect.afectMASP?.ctasPagarFilOp,
            ctasPagarFilOpA: CTAS_PAGAR_FILIALES_OP_AFECTACIONES,
            ivaTrasladadoN: storedDataAfect.afectMASP?.ivaTrasladado,
            ivaTrasladadoA: storedDataAfect.afectMASP?.ivaTrasladado,
            ivaPorTrasladarN: storedDataAfect.afectMASP?.ivaPorTrasladar,
            ivaPorTrasladarA: storedDataAfect.afectMASP?.ivaPorTrasladar,
            impuestosRetenidosN: storedDataAfect.afectMASP?.impuestosRetenidos,
            impuestosRetenidosA: storedDataAfect.afectMASP?.impuestosRetenidos,
            impuestosPropiosN: storedDataAfect.afectMASP?.impuestosPropios,
            impuestosPropiosA: storedDataAfect.afectMASP?.impuestosPropios,
            sumaPasivoCortoPlazoN: storedDataAfect.afectMASP?.sumaPasivoCortoPlazo,
            sumaPasivoCortoPlazoA: SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES,
            creditosBancariosN: storedDataAfect.afectMASP?.creditosBancarios,
            creditosBancariosA: storedDataAfect.afectMASP?.creditosBancarios,
            sumaPasivoLargoPlazoN: storedDataAfect.afectMASP?.sumaPasivoLargoPlazo,
            sumaPasivoLargoPlazoA: SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES,
            sumaPasivoN: SUMA_EL_PASIVO,
            sumaPasivoA: SUMA_EL_PASIVO_AFECTACIONES,
            capitalSocialFijoN: storedDataAfect.afectMASP?.capitalSocialFijo,
            capitalSocialFijoA: storedDataAfect.afectMASP?.capitalSocialFijo,
            capitalSocialVariableN: storedDataAfect.afectMASP?.capitalSocialVariable,
            capitalSocialVariableA: storedDataAfect.afectMASP?.capitalSocialVariable,
            reservaLegalN: storedDataAfect.afectMASP?.reservaLegal,
            reservaLegalA: storedDataAfect.afectMASP?.reservaLegal,
            resultadoDeEjerciciosAnterioresN: storedDataAfect.afectMASP?.resultadoDeEjerciciosAnteriores,
            resultadoDeEjerciciosAnterioresA: RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES,
            resultadoDelEjercicioN: storedDataAfect.afectMASP?.resultadoDelEjercicio,
            resultadoDelEjercicioA: storedDataAfect.afectMASP?.resultadoDelEjercicio,
            superavitDeficitCapitalN: storedDataAfect.afectMASP?.superavitDeficitCapital,
            superavitDeficitCapitalA: SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES,
            capitalContableN: storedDataAfect.afectMASP?.capitalContable,
            capitalContableA: SUMA_CAPITAL_CONTABLE_AFECTACIONES,
            sumaPasivoCapitalN: SUMA_PASIVO_CAPITAL,
            sumaPasivoCapitalA: SUMA_PASIVO_CAPITAL_AFECTACIONES
        }

        dataCombinado(null, null, null, masBG, null, null);

        datosAgrupadosReporte(null, null, null, masBGF, null, null, null, null);
    
        receivedDataAfec = {
            dataAfectMASP: false,
            afectMASP: false,
        }
        dataCountAfect = 0;
        
    }
}

let receivedDataAfecPST = {
    dataAfectPST: false,
    afectPST: false
};

let storedDataAfectPST: {
    dataAfectPST: any | null,
    afectPST: any | null
} = {
    dataAfectPST: null,
    afectPST: null
};

let dataCountAfectPST = 0;

export function dataPSTBG (dataAfectPST: any, afectPST: any){

    if (dataAfectPST) {
        receivedDataAfecPST.dataAfectPST = true;
        storedDataAfectPST.dataAfectPST = dataAfectPST;
        dataCountAfectPST++;
    }

    if(afectPST){
        receivedDataAfecPST.afectPST = true;
        storedDataAfectPST.afectPST = afectPST;
        dataCountAfectPST++;
    }

    if(dataCountAfectPST === 2){
        const safeValue = (value: any) => value || 0;

        let CLIENTES_AFECTACIONES = 0;
        let PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES = 0;
        let CTAS_COBRAR_FILIALES_OP_AFECTACIONES = 0;
        let DOCUMENTOS_POR_COBRAR_AFECTACIONES = 0;
        let DEUDORES_DIVERSOS_AFECTACIONES = 0;
        let ALMACEN_BONDEADO_AFECTACIONES = 0;
        let SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES = 0;

        CLIENTES_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.clientes) - safeValue(storedDataAfectPST.dataAfectPST?.clientes);
        PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.provisionCuentasIncobrables) + safeValue(storedDataAfectPST.dataAfectPST?.provCuentasInc);
        CTAS_COBRAR_FILIALES_OP_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.ctasCobrarFilialesOp) + safeValue(storedDataAfectPST.dataAfectPST?.ctasCobrarFilOp);
        DOCUMENTOS_POR_COBRAR_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.documentosPorCobrar) - safeValue(storedDataAfectPST.dataAfectPST?.docPorCobrar);
        DEUDORES_DIVERSOS_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.deudoresDiversos) - safeValue(storedDataAfectPST.dataAfectPST?.deudoresDiversos);
        ALMACEN_BONDEADO_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.almacenBondeado) + safeValue(storedDataAfectPST.dataAfectPST?.almacenBon);

        SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.caja) + safeValue(storedDataAfectPST.afectPST?.bancos) +CLIENTES_AFECTACIONES + PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES + CTAS_COBRAR_FILIALES_OP_AFECTACIONES + DOCUMENTOS_POR_COBRAR_AFECTACIONES + DEUDORES_DIVERSOS_AFECTACIONES + ALMACEN_BONDEADO_AFECTACIONES + safeValue(storedDataAfectPST.afectPST?.pagosAnticipados) + safeValue(storedDataAfectPST.afectPST?.ivaAcreditable) + safeValue(storedDataAfectPST.afectPST?.ivaPorAcreditar) + safeValue(storedDataAfectPST.afectPST?.subsidioAlEmpleo) + safeValue(storedDataAfectPST.afectPST?.impuestosPagadosPorAnticipado);

        // VARIABLES PARA LA PARTE FIJA
        let SUMA_ACTIVO_FIJO_AFECTACIONES = 0;

        SUMA_ACTIVO_FIJO_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.sumaActivoFijo);

        let SUMA_EL_ACTIVO = 0;
        let SUMA_EL_ACTIVO_AFECTACIONES = 0;

        SUMA_EL_ACTIVO = safeValue(storedDataAfectPST.afectPST?.sumaActivoCirculante) + safeValue(storedDataAfectPST.afectPST?.sumaActivoFijo) + safeValue(storedDataAfectPST.afectPST?.sumaActivoDiferido);
        SUMA_EL_ACTIVO_AFECTACIONES = SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES + SUMA_ACTIVO_FIJO_AFECTACIONES + safeValue(storedDataAfectPST?.afectPST?.sumaActivoDiferido);

        // VARIABLES PARA LA PARTE PASIVA CORTO PLAZO
        let PROVEEDORES_AFECTACIONES = 0;
        let ACREEDORES_DIVERSOS_AFECTACIONES = 0;
        let CTAS_PAGAR_FILIALES_OP_AFECTACIONES = 0;
        let SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES = 0;

        PROVEEDORES_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.proveedores) - safeValue(storedDataAfectPST.dataAfectPST?.proveedores);
        ACREEDORES_DIVERSOS_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.acreedoresDiversos) - safeValue(storedDataAfectPST.dataAfectPST?.acreedoresDiversos);
        CTAS_PAGAR_FILIALES_OP_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.ctasPagarFilialesOp) + safeValue(storedDataAfectPST.dataAfectPST?.ctasPagarFilOp);

        SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES = PROVEEDORES_AFECTACIONES + ACREEDORES_DIVERSOS_AFECTACIONES + CTAS_PAGAR_FILIALES_OP_AFECTACIONES + safeValue(storedDataAfectPST.afectPST?.ivaTrasladado) + safeValue(storedDataAfectPST.afectPST?.ivaPorTrasladar) + safeValue(storedDataAfectPST.afectPST?.impuestosRetenidos) + safeValue(storedDataAfectPST.afectPST?.impuestosPropios);

        // VARIABLES PARA LA PARTE PASIVA LARGO PLAZO
        let SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES = 0;
        let SUMA_EL_PASIVO = 0;
        let SUMA_EL_PASIVO_AFECTACIONES = 0;

        SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.sumaPasivoLargoPlazo);
        SUMA_EL_PASIVO = safeValue(storedDataAfectPST.afectPST?.sumaPasivoCortoPlazo) + safeValue(storedDataAfectPST.afectPST?.sumaPasivoLargoPlazo);
        SUMA_EL_PASIVO_AFECTACIONES = SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES + SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES;

        // VARIABLES PARA LA PARTE CAPITAL
        let RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES = 0;
        let SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES = 0;
        let SUMA_CAPITAL_CONTABLE_AFECTACIONES = 0;
        let SUMA_PASIVO_CAPITAL = 0;
        let SUMA_PASIVO_CAPITAL_AFECTACIONES = 0;

        RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.resultadoDeEjerciciosAnteriores) + safeValue(storedDataAfectPST.dataAfectPST?.resulEjAntAcreedor) - safeValue(storedDataAfectPST.dataAfectPST?.resulEjAntDeudor);
        SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.superavitDeficitActCapital) + safeValue(storedDataAfectPST.dataAfectPST?.superavitDeficit);

        SUMA_CAPITAL_CONTABLE_AFECTACIONES = safeValue(storedDataAfectPST.afectPST?.capitalSocialFijo) + safeValue(storedDataAfectPST.afectPST?.capitalSocialVariable) + safeValue(storedDataAfectPST.afectPST?.reservaLegal) + RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES + safeValue(storedDataAfectPST.afectPST?.resultadoDelEjercicio)  + SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES;
        SUMA_PASIVO_CAPITAL = SUMA_EL_PASIVO + safeValue(storedDataAfectPST.afectPST?.capitalContable);
        SUMA_PASIVO_CAPITAL_AFECTACIONES = SUMA_EL_PASIVO_AFECTACIONES + SUMA_CAPITAL_CONTABLE_AFECTACIONES;

        // 

        let pstBG;

        pstBG = {
            caja: storedDataAfectPST.afectPST?.caja,
            bancos: storedDataAfectPST.afectPST?.bancos,
            clientes: CLIENTES_AFECTACIONES,
            ctasCobrarFilOp: CTAS_COBRAR_FILIALES_OP_AFECTACIONES,
            almacenBondeado: ALMACEN_BONDEADO_AFECTACIONES,
            pagosAnticipados: storedDataAfectPST.afectPST?.pagosAnticipados,
            provisionCuentasIncobrables: PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES,
            documentosPorCobrar: DOCUMENTOS_POR_COBRAR_AFECTACIONES,
            deudoresDiversos: DEUDORES_DIVERSOS_AFECTACIONES,
            ivaAcreditable: storedDataAfectPST.afectPST?.ivaAcreditable,
            ivaPAcreditar: storedDataAfectPST.afectPST?.ivaPorAcreditar,
            subEmpleo: storedDataAfectPST.afectPST?.subsidioAlEmpleo,
            impuestosPagadosPorAnticipado:  storedDataAfectPST.afectPST?.impuestosPagadosPorAnticipado,
            mobiliarioYEquipo: storedDataAfectPST.afectPST?.mobiliarioYEquipo,
            equipoDeComputo: storedDataAfectPST.afectPST?.equipoDeComputo,
            mobiliarioYEquipoAlmacen: storedDataAfectPST.afectPST?.mobiliarioYEquipoAlmacen,
            alarmaYEqSeguridad: storedDataAfectPST.afectPST?.alarmaYEqSeguridad,
            maquinariaEqPST: storedDataAfectPST.afectPST?.maquinariaEqPST,
            moldesSuajadoPST: storedDataAfectPST.afectPST?.moldesSuajadoPST,
            equipoDeReparto: storedDataAfectPST?.afectPST.equipoDeReparto,
            acumDepMob: storedDataAfectPST.afectPST?.acumDepMob,
            depAcumEqComputo: storedDataAfectPST.afectPST?.depAcumEqComputo,
            depAcumEqReparto: storedDataAfectPST.afectPST?.depAcumEqReparto,
            depAcumEqAlmacen: storedDataAfectPST.afectPST?.depAcumEqAlmacen,
            depAcumAlarmaYEqSeguridad: storedDataAfectPST.afectPST?.depAcumAlarmaYEqSeguridad,
            depAcumMaquinariaEq: storedDataAfectPST.afectPST?.depAcumMaquinariaEq,
            depAcumMoldesSuajado: storedDataAfectPST.afectPST?.depAcumMoldesSuajado,
            sumaActivoDiferido:  storedDataAfectPST.afectPST?.sumaActivoDiferido,
            proveedores: PROVEEDORES_AFECTACIONES,
            ctasPagarFilOp: CTAS_PAGAR_FILIALES_OP_AFECTACIONES,
            ivaTrasladado: storedDataAfectPST.afectPST?.ivaTrasladado,
            ivaPTrasladar: storedDataAfectPST.afectPST?.ivaPorTrasladar,
            impRetenidos: storedDataAfectPST.afectPST?.impuestosRetenidos,
            impuestosPropios: storedDataAfectPST.afectPST?.impuestosPropios,
            acreedoresDiversos: ACREEDORES_DIVERSOS_AFECTACIONES,
            creditosBancarios: storedDataAfectPST.afectPST?.creditosBancarios,
            capitalSocialFijo: storedDataAfectPST.afectPST?.capitalSocialFijo,
            capitalSocialVariable: storedDataAfectPST.afectPST?.capitalSocialVariable,
            reservaLegal: storedDataAfectPST.afectPST?.reservaLegal,
            resultadoDelEjercicio: RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES,
            superavitDefiCapital: SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES,
            capitalContable: SUMA_CAPITAL_CONTABLE_AFECTACIONES
        }

        let pstBGF;

        pstBGF = {
            cajaN: storedDataAfectPST.afectPST?.caja,
            cajaA: storedDataAfectPST.afectPST?.caja,
            bancosN: storedDataAfectPST.afectPST?.bancos,
            bancosA: storedDataAfectPST.afectPST?.bancos,
            clientesN: storedDataAfectPST.afectPST?.clientes,
            clientesA: CLIENTES_AFECTACIONES,
            provCuentIncoN: storedDataAfectPST.afectPST?.provisionCuentasIncobrables,
            provCuentIncoA: PROVISION_CUENTAS_INCOBRABLES_AFECTACIONES,
            ctasCobrarFilN: storedDataAfectPST.afectPST?.ctasCobrarFilialesOp,
            ctasCobrarFilA: CTAS_COBRAR_FILIALES_OP_AFECTACIONES,
            docPorCobrarN: storedDataAfectPST.afectPST?.documentosPorCobrar,
            docPorCobrarA: DOCUMENTOS_POR_COBRAR_AFECTACIONES,
            deudoresDivN: storedDataAfectPST.afectPST?.deudoresDiversos,
            deudoresDivA: DEUDORES_DIVERSOS_AFECTACIONES,
            almacenBondeadoN: storedDataAfectPST.afectPST?.almacenBondeado,
            almacenBondeadoA: ALMACEN_BONDEADO_AFECTACIONES,
            pagosAnticipN: storedDataAfectPST.afectPST?.pagosAnticipados,
            pagosAnticipA: storedDataAfectPST.afectPST?.pagosAnticipados,
            ivaAcredN: storedDataAfectPST.afectPST?.ivaAcreditable,
            ivaAcredA: storedDataAfectPST.afectPST?.ivaAcreditable,
            ivaPorAcredN: storedDataAfectPST.afectPST?.ivaPorAcreditar,
            ivaPorAcredA: storedDataAfectPST.afectPST?.ivaPorAcreditar,
            subsidioEmpleoN: storedDataAfectPST.afectPST?.subsidioAlEmpleo,
            subsidioEmpleoA: storedDataAfectPST.afectPST?.subsidioAlEmpleo,
            impPagAntN: storedDataAfectPST.afectPST?.impuestosPagadosPorAnticipado,
            impPagAntA: storedDataAfectPST.afectPST?.impuestosPagadosPorAnticipado,
            sumaActivoCircN: storedDataAfectPST.afectPST?.sumaActivoCirculante,
            sumaActivoCircA: SUMA_ACTIVO_CIRCUALANTE_AFECTACIONES,
            mobYEQOficinaN: storedDataAfectPST.afectPST?.mobiliarioYEquipo,
            mobYEQOficinaA: storedDataAfectPST.afectPST?.mobiliarioYEquipo,
            acumDepMobN: storedDataAfectPST.afectPST?.acumDepMob,
            acumDepMobA: storedDataAfectPST.afectPST?.acumDepMob,
            equipoDeComputoN: storedDataAfectPST.afectPST?.equipoDeComputo,
            equipoDeComputoA: storedDataAfectPST.afectPST?.equipoDeComputo,
            depAcumEqComputoN: storedDataAfectPST.afectPST?.depAcumEqComputo,
            depAcumEqComputoA: storedDataAfectPST.afectPST?.depAcumEqComputo,
            equipoDeComputoPN: storedDataAfectPST.afectPST?.equipoDeComputo,
            equipoDeComputoPA: storedDataAfectPST.afectPST?.equipoDeComputo,
            depAcumEqComputoPN: storedDataAfectPST.afectPST?.depAcumEqComputo,
            depAcumEqComputoPA: storedDataAfectPST.afectPST?.depAcumEqComputo,
            equipoDeRepartoN: storedDataAfectPST.afectPST?.equipoDeReparto,
            equipoDeRepartoA: storedDataAfectPST.afectPST?.equipoDeReparto,
            depAcumEqRepartoN: storedDataAfectPST.afectPST?.depAcumEqReparto,
            depAcumEqRepartoA: storedDataAfectPST.afectPST?.depAcumEqReparto,
            mobYEQAlmacenN: storedDataAfectPST.afectPST?.mobiliarioYEquipoAlmacen,
            mobYEQAlmacenA: storedDataAfectPST.afectPST?.mobiliarioYEquipoAlmacen,
            depAcumEQAlmacenN: storedDataAfectPST.afectPST?.depAcumEqAlmacen,
            depAcumEQAlmacenA: storedDataAfectPST.afectPST?.depAcumEqAlmacen,
            alarmaYEqSeguridadN: storedDataAfectPST.afectPST?.alarmaYEqSeguridad,
            alarmaYEqSeguridadA: storedDataAfectPST.afectPST?.alarmaYEqSeguridad,
            depAcumAlarmaYEqSeguridadN: storedDataAfectPST.afectPST?.depAcumAlarmaYEqSeguridad,
            depAcumAlarmaYEqSeguridadA: storedDataAfectPST.afectPST?.depAcumAlarmaYEqSeguridad,
            maquinariaEqPSTN: storedDataAfectPST.afectPST?.maquinariaEqPST,
            maquinariaEqPSTA: storedDataAfectPST.afectPST?.maquinariaEqPST,
            depAcumMaquinariaEqN: storedDataAfectPST.afectPST?.depAcumMaquinariaEq,
            depAcumMaquinariaEqA: storedDataAfectPST.afectPST?.depAcumMaquinariaEq,
            moldesSuajadoPSTN: storedDataAfectPST.afectPST?.moldesSuajadoPST,
            moldesSuajadoPSTA: storedDataAfectPST.afectPST?.moldesSuajadoPST,
            depAcumMoldesSuajadoN: storedDataAfectPST.afectPST?.depAcumMoldesSuajado,
            depAcumMoldesSuajadoA: storedDataAfectPST.afectPST?.depAcumMoldesSuajado,
            sumaActivoFijoN: storedDataAfectPST.afectPST?.sumaActivoFijo,
            sumaActivoFijoA: SUMA_ACTIVO_FIJO_AFECTACIONES,
            depositosGarantiaN: storedDataAfectPST.afectPST?.depositosGarantia,
            depositosGarantiaA: storedDataAfectPST.afectPST?.depositosGarantia,
            sumaActivoDiferidoN: storedDataAfectPST.afectPST?.sumaActivoDiferido,
            sumaActivoDiferidoA: storedDataAfectPST.afectPST?.sumaActivoDiferido,
            sumaActivoN: SUMA_EL_ACTIVO,
            sumaActivoA: SUMA_EL_ACTIVO_AFECTACIONES,
            proveedoresN: storedDataAfectPST.afectPST?.proveedores,
            proveedoresA: PROVEEDORES_AFECTACIONES,
            acreedoresDiversosN: storedDataAfectPST.afectPST?.acreedoresDiversos,
            acreedoresDiversosA: ACREEDORES_DIVERSOS_AFECTACIONES,
            ctasPagarFilOpN: storedDataAfectPST.afectPST?.ctasPagarFilialesOp,
            ctasPagarFilOpA: CTAS_PAGAR_FILIALES_OP_AFECTACIONES,
            ivaTrasladadoN: storedDataAfectPST.afectPST?.ivaTrasladado,
            ivaTrasladadoA: storedDataAfectPST.afectPST?.ivaTrasladado,
            ivaPorTrasladarN: storedDataAfectPST.afectPST?.ivaPorTrasladar,
            ivaPorTrasladarA: storedDataAfectPST.afectPST?.ivaPorTrasladar,
            impuestosRetenidosN: storedDataAfectPST.afectPST?.impuestosRetenidos,
            impuestosRetenidosA: storedDataAfectPST.afectPST?.impuestosRetenidos,
            impuestosPropiosN: storedDataAfectPST.afectPST?.impuestosPropios,
            impuestosPropiosA: storedDataAfectPST.afectPST?.impuestosPropios,
            sumaPasivoCortoPlazoN: storedDataAfectPST.afectPST?.sumaPasivoCortoPlazo,
            sumaPasivoCortoPlazoA: SUMA_PASIVO_CORTO_PLAZO_AFECTACIONES,
            sumaPasivoN: SUMA_EL_PASIVO,
            sumaPasivoA: SUMA_EL_PASIVO_AFECTACIONES,
            creditosBancariosN: storedDataAfectPST.afectPST?.creditosBancarios,
            creditosBancariosA: storedDataAfectPST.afectPST?.creditosBancarios,
            sumaPasivoLargoPlazoN: storedDataAfectPST.afectPST?.sumaPasivoLargoPlazo,
            sumaPasivoLargoPlazoA: SUMA_PASIVO_LARGO_PLAZO_AFECTACIONES,
            capitalSocialFijoN: storedDataAfectPST.afectPST?.capitalSocialFijo,
            capitalSocialFijoA: storedDataAfectPST.afectPST?.capitalSocialFijo,
            capitalSocialVariableN: storedDataAfectPST.afectPST?.capitalSocialVariable,
            capitalSocialVariableA: storedDataAfectPST.afectPST?.capitalSocialVariable,
            reservaLegalN: storedDataAfectPST.afectPST?.reservaLegal,
            reservaLegalA: storedDataAfectPST.afectPST?.reservaLegal,
            resultadoDeEjerciciosAnterioresN: storedDataAfectPST.afectPST?.resultadoDeEjerciciosAnteriores,
            resultadoDeEjerciciosAnterioresA: RESULTADO_DE_EJERCICIOS_ANTERIORES_AFECTACIONES,
            resultadoDelEjercicioN: storedDataAfectPST.afectPST?.resultadoDelEjercicio,
            resultadoDelEjercicioA: storedDataAfectPST.afectPST?.resultadoDelEjercicio,
            superavitDeficitCapitalN: storedDataAfectPST.afectPST?.superavitDeficitActCapital,
            superavitDeficitCapitalA: SUPERAVIT_DEFICIT_ACTUALIZACION_AFECTACIONES,
            capitalContableN: storedDataAfectPST.afectPST?.capitalContable,
            capitalContableA: SUMA_CAPITAL_CONTABLE_AFECTACIONES,
            sumaPasivoCapitalN: SUMA_PASIVO_CAPITAL,
            sumaPasivoCapitalA: SUMA_PASIVO_CAPITAL_AFECTACIONES
        }

        dataCombinado(null, null, null, null, pstBG, null);

        datosAgrupadosReporte(null, null, null, null, pstBGF, null, null, null);

        receivedDataAfecPST  = {
            dataAfectPST: false,
            afectPST: false
        }

        dataCountAfectPST = 0;

    }
}


let receivedDataComb = {
    masER: false,
    pstER: false,
    elim: false,
    masBG: false,
    pstBG: false,
    dataBG: false
};

let storedDataComb: {
    masER: any | null,
    pstER: any | null,
    elim: any | null,
    masBG: any | null,
    pstBG: any | null,
    dataBG: any | null
} = {
    masER: null,
    pstER: null,
    elim: null,
    masBG: null,
    pstBG: null,
    dataBG: null
};

let dataCountComb = 0;

export function dataCombinado (masER: any, pstER: any, elim: any, masBG: any, pstBG: any, dataBG: any ) {

    if (masER) {
        receivedDataComb.masER = true;
        storedDataComb.masER = masER;
        dataCountComb++;
    }

    if(pstER){
        receivedDataComb.pstER = true;
        storedDataComb.pstER = pstER;
        dataCountComb++;
    }

    if(elim){
        receivedDataComb.elim = true;
        storedDataComb.elim = elim;
        dataCountComb++;
    }

    if(masBG){
        receivedDataComb.masBG = true;
        storedDataComb.masBG = masBG;
        dataCountComb++;
    }

    if(pstBG){
        receivedDataComb.pstBG = true;
        storedDataComb.pstBG = pstBG;
        dataCountComb++;
    }

    if(dataBG){
        receivedDataComb.dataBG = true;
        storedDataComb.dataBG = dataBG;
        dataCountComb++;
    }

    if(dataCountComb === 6){
        const safeValue = (value: any) => value || 0;

        // VARIABLES ESTADO DE RESULTADOS
        let VENTAS_TOTALES_MASP = 0;
        let VENTAS_TOTALES_PST = 0;
        let VENTAS_TOTALES_ELIM = 0;
        let VENTAS_TOTALES_COMB = 0;
        let COSTOS_VENTAS_MASP = 0;
        let COSTOS_VENTAS_PST = 0;
        let COSTOS_VENTAS_ELIM_D = 0;
        let COSTOS_VENTAS_ELIM_C = 0;
        let COSTOS_VENTAS_COMB = 0;
        let UTILIDAD_BRUTA_MASP = 0;
        let UTILIDAD_BRUTA_PST = 0;
        let UTILIDAD_BRUTA_COMB = 0;
        let GASTOS_ADMON_VTA_MASP = 0;
        let GASTOS_ADMON_VTA_PST = 0;
        let GASTOS_ADMON_VTA_ELIM_D = 0;
        let GASTOS_ADMON_VTA_ELIM_C = 0;
        let GASTOS_ADMON_VTA_COMB = 0;
        let AGREGAR_POR_MESD = 0;
        let AGREGAR_POR_MESC = 0;
        let DEPRECIACION_AMORTIZACION_MASP = 0;
        let DEPRECIACION_AMORTIZACION_PST = 0;
        let DEPRECIACION_AMORTIZACION_COMB = 0;
        let UTILIDAD_OPERACIONAL_MASP = 0;
        let UTILIDAD_OPERACIONAL_PST = 0;
        let UTILIDAD_OPERACIONAL_COMB = 0;
        let GASTOS_FINANCIEROS_MASP = 0;
        let GASTOS_FINANCIEROS_PST = 0;
        let GASTOS_FINANCIEROS_COMB = 0;
        let PRODUCTOS_FINANCIEROS_MASP = 0;
        let PRODUCTOS_FINANCIEROS_PST = 0;
        let PRODUCTOS_FINANCIEROS_COMB = 0;
        let PERDIDA_POSICION_MON_MASP = 0;
        let PERDIDA_POSICION_MON_PST = 0;
        let PERDIDA_POSICION_MON_COMB = 0;
        let PERDIDA_CAMBIARA_MASP = 0;
        let PERDIDA_CAMBIARA_PST = 0;
        let PERDIDA_CAMBIARA_COMB = 0;
        let COSTO_INTEGRAL_FINANCIERO_MASP = 0;
        let COSTO_INTEGRAL_FINANCIERO_PST = 0;
        let COSTO_INTEGRAL_FINANCIERO_COMB = 0;
        let OTROS_GASTOS_MASP = 0;
        let OTROS_GASTOS_PST = 0;
        let OTROS_GASTOS_COMB = 0;
        let UT_ANTES_ISR_PTU_MASP = 0;
        let UT_ANTES_ISR_PTU_PST = 0;
        let UT_ANTES_ISR_PTU_COMB = 0;
        let IMP_SOBRE_RENTA_MASP = 0;
        let IMP_SOBRE_RENTA_PST = 0;
        let IMP_SOBRE_RENTA_COMB = 0;
        let IMP_DIFERIDO_MASP = 0;
        let IMP_DIFERIDO_PST = 0;
        let IMP_DIFERIDO_COMB = 0;
        let PTU_MASP  = 0;
        let PTU_PST = 0;
        let PTU_COMB = 0;
        let IMP_ACTIVO_MASP = 0;
        let IMP_ACTIVO_PST = 0;
        let IMP_ACTIVO_COMB = 0;
        let UT_ANTES_PART_EXTAORD_MASP = 0;
        let UT_ANTES_PART_EXTAORD_PST = 0;
        let UT_ANTES_PART_EXTAORD_COMB = 0;
        let PERIDIDA_EXT_MASP = 0;
        let PERIDIDA_EXT_PST = 0;
        let PERIDIDA_EXT_COMB = 0;
        let PERDIDA_SUBSIDIARIAS_MASP = 0;
        let PERDIDA_SUBSIDIARIAS_PST = 0;
        let PERDIDA_SUBSIDIARIAS_COMB = 0;
        let UTILIDAD_NETA_MASP = 0;
        let UTILIDAD_NETA_PST = 0;
        let UTILIDAD_NETA_COMB = 0;

        // VARIABLES BALANCE GENERAL PARTE ACTIVO
        let CAJA_MASP = 0;
        let CAJA_PST = 0;
        let CAJA_COMB = 0;
        let CLIENTES_MASP = 0;
        let CLIENTES_PST = 0;
        let CLIENTES_COMB = 0;
        let CTAS_COBRAR_FILIALESOP_MASP = 0;
        let CTAS_COBRAR_FILIALESOP_PST = 0;
        let CTAS_COBRAR_FILIALESOP_ELIM = 0;
        let CTAS_COBRAR_FILIALESOP_COMB = 0;
        let INVENTARIO_MASP = 0;
        let INVENTARIOS_PST = 0;
        let INVENTARIOS_COMB = 0;
        let PAGOS_ANTICIPADOS_MASP = 0;
        let PAGOS_ANTICIPADOS_PST = 0;
        let PAGOS_ANTICIPADOS_COMB = 0;
        let PROV_CUENTAS_INCOBRABLES_MASP = 0;
        let PROV_CUENTAS_INCOBRABLES_PST = 0;
        let PROV_CUENTAS_INCOBRABLES_COMB = 0;
        let DEUDORES_DIVERSOS_MASP = 0;
        let DEUDORES_DIVERSOS_PST = 0;
        let DEUDORES_DIVERSOS_COMB = 0;    
        let IVA_IMP_PAG_ANTI_MASP = 0;
        let IVA_IMP_PAG_ANTI_PST = 0;
        let IVA_IMP_PAG_ANTI_COMB = 0;        
        let TOTAL_ACTIVO_CIRCULANTE_MASP = 0;
        let TOTAL_ACTIVO_CIRCULANTE_PST = 0;
        let TOTAL_ACTIVO_CIRCULANTE_COMB = 0;
        let TERRENOS_Y_EDIFICIOS_MASP = 0;
        let TERRENOS_Y_EDIFICIOS_PST = 0;
        let TERRENOS_Y_EDIFICIOS_COMB = 0;
        let MAQUINARIA_Y_EQUIPO_MASP = 0;
        let MAQUINARIA_Y_EQUIPO_PST = 0;
        let MAQUINARIA_Y_EQUIPO_COMB = 0;
        let EQUIPO_TRANSPORTE_MASP = 0;
        let EQUIPO_TRANSPORTE_PST = 0;
        let EQUIPO_TRANSPORTE_COMB = 0;
        let ACTUALIZACION_ACTIVO_FIJO_MASP = 0;
        let ACTUALIZACION_ACTIVO_FIJO_PST = 0;
        let ACTUALIZACION_ACTIVO_FIJO_COMB = 0;
        let DEPRECIACION_ACUMULADA_MASP = 0;
        let DEPRECIACION_ACUMULADA_PST = 0;
        let DEPRECIACION_ACUMULADA_COMB = 0;
        let ACTIVOS_FIJOS_MASP = 0;
        let ACTIVOS_FIJOS_PST = 0;
        let ACTIVOS_FIJOS_COMB = 0;
        let INVERSION_SUBSIDIARIAS_MASP = 0;
        let INVERSION_SUBSIDIARIAS_PST = 0;
        let INVERSION_SUBSIDIARIAS_COMB = 0;
        let ACTIVOS_DIFERIDOS_MASP = 0;
        let ACTIVOS_DIFERIDOS_PST = 0;
        let ACTIVOS_DIFERIDOS_COMB = 0;
        let OTROS_ACTIVOS_MASP = 0;
        let OTROS_ACTIVOS_PST = 0;
        let OTROS_ACTIVOS_COMB = 0;
        let TOTAL_ACTIVO_MASP = 0;
        let TOTAL_ACTIVO_PST = 0;
        let TOTAL_ACTIVO_COMB = 0;

        // BALANCE GENERAL PARTE PASIVO
        let PROVEEDORES_MASP = 0;
        let PROVEEDORES_PST = 0;
        let PROVEEDORES_COMB = 0;
        let CTAS_PAG_FILIALES_OP_MASP = 0;
        let CTAS_PAG_FILIALES_OP_PST = 0;
        let CTAS_PAG_FILIALES_OP_ELIM = 0;
        let CTAS_PAG_FILIALES_OP_COMB = 0;
        let INTERESES_PAGAR_MASP = 0;
        let INTERESES_PAGAR_COMB = 0;
        let INTERESES_PAGAR_PST = 0;
        let IMP_PAGAR_PTU_MASP = 0;
        let IMP_PAGAR_PTU_PST = 0;
        let IMP_PAGAR_PTU_COMB = 0;
        let GASTOS_ACUM_MASP = 0;
        let GASTOS_ACUM_PST = 0;
        let GASTOS_ACUM_COMB = 0;
        let APALANCAMIENTO_MASP = 0;
        let APALANCAMIENTO_PST = 0;
        let APALANCAMIENTO_ELIMD = 0;
        let APALANCAMIENTO_ELIMC = 0;
        let APALANCAMIENTO_COMB: number 
        let NETO_FILIAL = 0;
        let BANCOS_CORTO_PLAZO_MASP  = 0;
        let BANCOS_CORTO_PLAZO_PST = 0;
        let BANCOS_CORTO_PLAZO_COMB = 0;
        let OTROS_PASIVOS_MASP = 0;
        let OTROS_PASIVOS_PST = 0;
        let OTROS_PASIVOS_COMB = 0;
        let LP_BANCOS_MASP = 0;
        let LP_BANCOS_PST = 0;
        let LP_BANCOS_COMB = 0;
        let LP_OTROS_BANCOS_MASP = 0;
        let LP_OTROS_BANCOS_PST = 0;
        let LP_OTROS_BANCOS_COMB = 0;
        let ACREEDORES_DIVERSOS_MASP = 0;
        let ACREEDORES_DIVERSOS_PST = 0;
        let ACREEDORES_DIVERSOS_COMB = 0;
        let OTROS_PAS_CIR_NO_OPERAT_MASP = 0;
        let OTROS_PAS_CIR_NO_OPERAT_PST = 0;
        let OTROS_PAS_CIR_NO_OPERAT_COMB = 0;
        let TOTAL_PASIVO_CIRCULANTE_MASP = 0;
        let TOTAL_PASIVO_CIRCULANTE_PST = 0;
        let TOTAL_PASIVO_CIRCULANTE_COMB = 0;
        let BANCOS_LARGO_PLAZO_MASP = 0;
        let BANCOS_LARGO_PLAZO_PST = 0;
        let BANCOS_LARGO_PLAZO_COMB = 0;
        let OTROS_BANCOS_LP_MASP = 0;
        let OTROS_BANCOS_LP_PST= 0;
        let OTROS_BANCOS_LP_COMB = 0;
        let OTROS_PASIVOS_FINANC_MASP = 0;
        let OTROS_PASIVOS_FINANC_PST = 0;
        let OTROS_PASIVOS_FINANC_COMB = 0;
        let PRIMAS_ANTIGUEDAD_MASP = 0;
        let PRIMAS_ANTIGUEDAD_PST = 0;
        let PRIMAS_ANTIGUEDAD_COMB = 0;
        let PASIVO_DIFEREIDO_MASP = 0;
        let PASIVO_DIFEREIDO_PST = 0;
        let PASIVO_DIFEREIDO_COMB = 0;
        let IMP_DIFERIDOS_MASP = 0;
        let IMP_DIFERIDOS_PST = 0;
        let IMP_DIFERIDOS_COMB = 0;
        let TOTAL_PASIVO_LP_MASP = 0;
        let TOTAL_PASIVO_LP_PST = 0;
        let TOTAL_PASIVO_LP_COMB = 0;
        let TOTAL_PASIVO_MASP = 0;
        let TOTAL_PASIVO_PST = 0;
        let TOTAL_PASIVO_COMB = 0;

        // VARIABLES BALANCE GENERAL PARTE CAPITAL
        let CAPITAL_SOCIAL_MASP = 0;
        let CAPITAL_SOCIAL_PST = 0;
        let CAPITAL_SOCIAL_COMB = 0;
        let APORTACIONES_FUTUROS_MASP = 0;
        let APORTACIONES_FUTUROS_PST = 0;
        let APORTACIONES_FUTUROS_COMB = 0;
        let IMP_DIFERIDOSC_MASP = 0;
        let IMP_DIFERIDOSC_PST = 0;
        let IMP_DIFERIDOSC_COMB = 0;
        let SUPERAVIT_DEFICIT_ACT_MASP1 = 0;
        let SUPERAVIT_DEFICIT_ACT_MASP2 = 0;
        let SUPERAVIT_DEFICIT_ACT_MASP3 = 0;
        let SUPERAVIT_DEFICIT_ACT_MASPF = 0;
        let SUPERAVIT_DEFICIT_ACT_PST1 = 0;
        let SUPERAVIT_DEFICIT_ACT_PST2 = 0;
        let SUPERAVIT_DEFICIT_ACT_PST3 = 0;
        let SUPERAVIT_DEFICIT_ACT_PSTF = 0;
        let SUPERAVIT_DEFICIT_ACT_ELIM_D1 = 0;
        let SUPERAVIT_DEFICIT_ACT_ELIM_D2 = 0;
        let SUPERAVIT_DEFICIT_ACT_ELIM_DF = 0;
        let SUPERAVIT_DEFICIT_ACT_ELIM_C1 = 0;
        let SUPERAVIT_DEFICIT_ACT_ELIM_C2 = 0;
        let SUPERAVIT_DEFICIT_ACT_ELIM_CF = 0;
        let SUPERAVIT_DEFICIT_ACT_COMB = 0;
        let UTILIDADES_RETENIDAS_MASP = 0;
        let UTILIDADES_RETENIDAS_PST = 0;
        let UTILIDADES_RETENIDAS_COMB = 0;
        let UTILIDAD_DEL_EJERCICIO_MASP = 0;
        let UTILIDAD_DEL_EJERCICIO_PST = 0;
        let UTILIDAD_DEL_EJERCICIO_COMB = 0;
        let INSUFICIENCIA_INVENTARIO_MASP = 0;
        let INSUFICIENCIA_INVENTARIO_PST = 0;
        let INSUFICIENCIA_INVENTARIO_COMB = 0;
        let TOTAL_CAP_CONTABLE_MASP = 0;
        let TOTAL_CAP_CONTABLE_PST = 0;
        let TOTAL_CAP_CONTABLE_COMB = 0;
        let TOTAL_PASIVO_CAP_CONT_MASP = 0;
        let TOTAL_PASIVO_CAP_CONT_PST = 0;
        let TOTAL_PASIVO_CAP_CONT_COMB = 0;
        let COMPROBACION_MASP = 0;
        let COMPROBACION_PST = 0;
        let COMPROBACION_COMB = 0;
        let UTILIDADES_RETENIDAS_MASP_BG = safeValue(storedDataComb?.dataBG.utilidadesRetenidasMASP);
        let UTILIDADES_RETENIDAS_PST_BG = safeValue(storedDataComb?.dataBG.utilidadesRetenidasPST);
        let SUPERAVIT_ACTUALIZACION_ANTERIOR = safeValue(storedDataComb?.dataBG.superavitDefiActuAntes);
        let UTILIDADES_RETENIDAS_ANTERIOR = safeValue(storedDataComb?.dataBG.utilidadesRetenidasAnterior);
        let UTILIDADES_EJERCICIO_ANTERIOR = safeValue(storedDataComb?.dataBG.utilidadesEjercicioAnterior);

        VENTAS_TOTALES_MASP = (safeValue(storedDataComb?.masER?.ventasNetas) / 1000);
        VENTAS_TOTALES_MASP = Math.round(VENTAS_TOTALES_MASP);
        VENTAS_TOTALES_PST = (safeValue(storedDataComb?.pstER?.ventasNetas) / 1000);
        VENTAS_TOTALES_PST = Math.round(VENTAS_TOTALES_PST);
        VENTAS_TOTALES_ELIM = (safeValue(storedDataComb?.elim.ventasNetas) / 1000);
        VENTAS_TOTALES_ELIM = Math.round(VENTAS_TOTALES_ELIM);
        VENTAS_TOTALES_COMB = VENTAS_TOTALES_MASP + VENTAS_TOTALES_PST - VENTAS_TOTALES_ELIM;

        COSTOS_VENTAS_MASP = (safeValue(storedDataComb?.masER?.costoVentas) / 1000);
        COSTOS_VENTAS_MASP = Math.round(COSTOS_VENTAS_MASP);
        COSTOS_VENTAS_PST = (safeValue(storedDataComb?.pstER?.costoVentas) / 1000);
        COSTOS_VENTAS_PST = Math.round(COSTOS_VENTAS_PST);
        COSTOS_VENTAS_ELIM_D = (safeValue(storedDataComb?.elim?.costosVentasN) / 1000);
        COSTOS_VENTAS_ELIM_D = Math.round(COSTOS_VENTAS_ELIM_D);
        COSTOS_VENTAS_ELIM_C = (safeValue(storedDataComb?.elim?.costoVentasI) / 1000) + (safeValue(storedDataComb?.elim?.costoVentasR) / 1000);
        COSTOS_VENTAS_ELIM_C = Math.round(COSTOS_VENTAS_ELIM_C);
        COSTOS_VENTAS_COMB = COSTOS_VENTAS_MASP + COSTOS_VENTAS_PST + COSTOS_VENTAS_ELIM_D - COSTOS_VENTAS_ELIM_C;

        UTILIDAD_BRUTA_MASP = VENTAS_TOTALES_MASP - COSTOS_VENTAS_MASP;
        UTILIDAD_BRUTA_PST = VENTAS_TOTALES_PST - COSTOS_VENTAS_PST;
        UTILIDAD_BRUTA_COMB = VENTAS_TOTALES_COMB - COSTOS_VENTAS_COMB;

        GASTOS_ADMON_VTA_MASP = (safeValue(storedDataComb?.masER?.gastosAdmonVTA) / 1000);
        GASTOS_ADMON_VTA_MASP = Math.round(GASTOS_ADMON_VTA_MASP);
        GASTOS_ADMON_VTA_PST = (safeValue(storedDataComb?.pstER?.gastosAdmonVTA) / 1000);
        GASTOS_ADMON_VTA_PST = Math.round(GASTOS_ADMON_VTA_PST);
        GASTOS_ADMON_VTA_ELIM_D = (safeValue(storedDataComb?.elim?.gastosAdmonVtaN) / 1000);
        GASTOS_ADMON_VTA_ELIM_D = Math.round(GASTOS_ADMON_VTA_ELIM_D);
        GASTOS_ADMON_VTA_ELIM_C = (safeValue(storedDataComb?.elim?.gastosAdmonVtaI) / 1000) + (safeValue(storedDataComb?.elim?.serviciosAdmin) / 1000);
        GASTOS_ADMON_VTA_ELIM_C = Math.round(GASTOS_ADMON_VTA_ELIM_C);
        GASTOS_ADMON_VTA_COMB = GASTOS_ADMON_VTA_MASP + GASTOS_ADMON_VTA_PST + GASTOS_ADMON_VTA_ELIM_D - GASTOS_ADMON_VTA_ELIM_C;

        AGREGAR_POR_MESD = VENTAS_TOTALES_ELIM + COSTOS_VENTAS_ELIM_D + GASTOS_ADMON_VTA_ELIM_D;
        AGREGAR_POR_MESC = COSTOS_VENTAS_ELIM_C + GASTOS_ADMON_VTA_ELIM_C;


        DEPRECIACION_AMORTIZACION_MASP = (safeValue(storedDataComb?.masER?.depreContable) / 1000);
        DEPRECIACION_AMORTIZACION_MASP = Math.round(DEPRECIACION_AMORTIZACION_MASP);
        DEPRECIACION_AMORTIZACION_PST = (safeValue(storedDataComb?.pstER?.depreContable) / 1000);
        DEPRECIACION_AMORTIZACION_PST = Math.round(DEPRECIACION_AMORTIZACION_PST);
        DEPRECIACION_AMORTIZACION_COMB = DEPRECIACION_AMORTIZACION_MASP + DEPRECIACION_AMORTIZACION_PST;

        
        UTILIDAD_OPERACIONAL_MASP = UTILIDAD_BRUTA_MASP - GASTOS_ADMON_VTA_MASP - DEPRECIACION_AMORTIZACION_MASP;
        UTILIDAD_OPERACIONAL_PST = UTILIDAD_BRUTA_PST - GASTOS_ADMON_VTA_PST - DEPRECIACION_AMORTIZACION_PST;
        UTILIDAD_OPERACIONAL_COMB = UTILIDAD_BRUTA_COMB - GASTOS_ADMON_VTA_COMB - DEPRECIACION_AMORTIZACION_COMB;


        GASTOS_FINANCIEROS_MASP = (safeValue(storedDataComb?.masER?.gastosFinancieros) / 1000);
        GASTOS_FINANCIEROS_MASP = Math.round(GASTOS_FINANCIEROS_MASP);
        GASTOS_FINANCIEROS_PST = (safeValue(storedDataComb?.pstER?.gastosFinancieros) / 1000);
        GASTOS_FINANCIEROS_PST = Math.floor(GASTOS_FINANCIEROS_PST);
        GASTOS_FINANCIEROS_COMB = GASTOS_FINANCIEROS_MASP + GASTOS_FINANCIEROS_PST;

        PRODUCTOS_FINANCIEROS_COMB = PRODUCTOS_FINANCIEROS_MASP! + PRODUCTOS_FINANCIEROS_PST!;
        PERDIDA_POSICION_MON_COMB = PERDIDA_POSICION_MON_MASP! + PERDIDA_POSICION_MON_PST!;
        PERDIDA_CAMBIARA_MASP = (safeValue(storedDataComb?.masER?.perdidaFinanciera) /1000);
        PERDIDA_CAMBIARA_MASP = Math.round(PERDIDA_CAMBIARA_MASP);
        PERDIDA_CAMBIARA_PST = (safeValue(storedDataComb?.pstER?.perdidaFinanciera) /1000);
        PERDIDA_CAMBIARA_PST = Math.round(PERDIDA_CAMBIARA_PST);
        PERDIDA_CAMBIARA_COMB = PERDIDA_CAMBIARA_MASP + PERDIDA_CAMBIARA_PST;

        COSTO_INTEGRAL_FINANCIERO_MASP = GASTOS_FINANCIEROS_MASP + PRODUCTOS_FINANCIEROS_MASP! + PERDIDA_POSICION_MON_MASP + PERDIDA_CAMBIARA_MASP;
        COSTO_INTEGRAL_FINANCIERO_PST = GASTOS_FINANCIEROS_PST + PRODUCTOS_FINANCIEROS_PST! + PERDIDA_POSICION_MON_PST + PERDIDA_CAMBIARA_PST;
        COSTO_INTEGRAL_FINANCIERO_COMB = GASTOS_FINANCIEROS_COMB + PRODUCTOS_FINANCIEROS_COMB + PERDIDA_POSICION_MON_COMB + PERDIDA_CAMBIARA_COMB;

        OTROS_GASTOS_MASP = (safeValue(storedDataComb?.masER?.otrosIngresos) / 1000);
        OTROS_GASTOS_MASP = - (Math.round(OTROS_GASTOS_MASP));
        OTROS_GASTOS_PST = (safeValue(storedDataComb?.pstER?.otrosIngresos) / 1000);
        OTROS_GASTOS_PST = - (Math.round(OTROS_GASTOS_PST));
        OTROS_GASTOS_COMB = (OTROS_GASTOS_MASP) + (OTROS_GASTOS_PST);

        UT_ANTES_ISR_PTU_MASP = UTILIDAD_OPERACIONAL_MASP - COSTO_INTEGRAL_FINANCIERO_MASP - OTROS_GASTOS_MASP;
        UT_ANTES_ISR_PTU_PST = UTILIDAD_OPERACIONAL_PST - COSTO_INTEGRAL_FINANCIERO_PST - OTROS_GASTOS_PST;
        UT_ANTES_ISR_PTU_COMB = UTILIDAD_OPERACIONAL_COMB - COSTO_INTEGRAL_FINANCIERO_COMB - (OTROS_GASTOS_COMB);

        UT_ANTES_PART_EXTAORD_MASP = UT_ANTES_ISR_PTU_MASP + IMP_SOBRE_RENTA_MASP! + IMP_DIFERIDO_MASP + PTU_MASP + IMP_ACTIVO_MASP;
        UT_ANTES_PART_EXTAORD_PST = UT_ANTES_ISR_PTU_PST + IMP_SOBRE_RENTA_PST! + IMP_DIFERIDO_PST + PTU_PST + IMP_ACTIVO_PST;
        UT_ANTES_PART_EXTAORD_COMB = UT_ANTES_ISR_PTU_COMB + IMP_SOBRE_RENTA_COMB + IMP_DIFERIDO_COMB + PTU_COMB + IMP_ACTIVO_COMB;

        UTILIDAD_NETA_MASP = UT_ANTES_PART_EXTAORD_MASP - PERIDIDA_EXT_MASP! - PERDIDA_SUBSIDIARIAS_MASP!;
        UTILIDAD_NETA_PST = UT_ANTES_PART_EXTAORD_PST - PERIDIDA_EXT_PST! - PERDIDA_SUBSIDIARIAS_PST!;
        UTILIDAD_NETA_COMB = UT_ANTES_PART_EXTAORD_COMB - PERIDIDA_EXT_COMB - PERDIDA_SUBSIDIARIAS_COMB;


        // BALANCE GENERAL PARTE ACTIVO
        CAJA_MASP = safeValue(storedDataComb.masBG?.caja) + safeValue(storedDataComb.masBG?.bancos)
        CAJA_MASP = CAJA_MASP / 1000;
        CAJA_MASP = Math.round(CAJA_MASP);
        CAJA_PST = safeValue(storedDataComb.pstBG?.caja) + safeValue(storedDataComb.pstBG?.bancos)
        CAJA_PST = CAJA_PST / 1000;
        CAJA_PST = Math.round(CAJA_PST);
        CAJA_COMB = CAJA_MASP + CAJA_PST;

        CLIENTES_MASP = safeValue(storedDataComb.masBG?.clientes);
        CLIENTES_MASP = CLIENTES_MASP / 1000;
        CLIENTES_MASP = Math.round(CLIENTES_MASP);
        CLIENTES_PST = safeValue(storedDataComb?.pstBG.clientes);
        CLIENTES_PST = CLIENTES_PST / 1000;
        CLIENTES_PST = Math.floor(CLIENTES_PST);
        CLIENTES_COMB = CLIENTES_MASP + CLIENTES_PST;

        CTAS_COBRAR_FILIALESOP_MASP = safeValue(storedDataComb.masBG?.ctasCobrarFilOp);
        CTAS_COBRAR_FILIALESOP_MASP = CTAS_COBRAR_FILIALESOP_MASP / 1000;
        CTAS_COBRAR_FILIALESOP_MASP = Math.round(CTAS_COBRAR_FILIALESOP_MASP);
        CTAS_COBRAR_FILIALESOP_PST = safeValue(storedDataComb.pstBG?.ctasCobrarFilOp);
        CTAS_COBRAR_FILIALESOP_PST = CTAS_COBRAR_FILIALESOP_PST / 1000;
        CTAS_COBRAR_FILIALESOP_PST = Math.round(CTAS_COBRAR_FILIALESOP_PST);
        CTAS_COBRAR_FILIALESOP_ELIM = CTAS_COBRAR_FILIALESOP_MASP + CTAS_COBRAR_FILIALESOP_PST;
        CTAS_COBRAR_FILIALESOP_COMB = CTAS_COBRAR_FILIALESOP_MASP + CTAS_COBRAR_FILIALESOP_PST - CTAS_COBRAR_FILIALESOP_ELIM; 

        INVENTARIO_MASP = safeValue(storedDataComb.masBG?.almacenGeneral);
        INVENTARIO_MASP = INVENTARIO_MASP / 1000;
        INVENTARIO_MASP = Math.round(INVENTARIO_MASP);
        INVENTARIOS_PST = safeValue(storedDataComb.pstBG?.almacenBondeado);
        INVENTARIOS_PST = INVENTARIOS_PST / 1000;
        INVENTARIOS_PST = Math.round(INVENTARIOS_PST);
        INVENTARIOS_COMB = INVENTARIO_MASP + INVENTARIOS_PST;

        PAGOS_ANTICIPADOS_MASP = safeValue(storedDataComb.masBG?.pagosAnti);
        PAGOS_ANTICIPADOS_MASP = PAGOS_ANTICIPADOS_MASP / 1000;
        PAGOS_ANTICIPADOS_MASP = Math.round(PAGOS_ANTICIPADOS_MASP);
        PAGOS_ANTICIPADOS_PST = safeValue(storedDataComb.pstBG?.pagosAnticipados);
        PAGOS_ANTICIPADOS_PST = PAGOS_ANTICIPADOS_PST / 1000;
        PAGOS_ANTICIPADOS_PST = Math.round(PAGOS_ANTICIPADOS_PST);
        PAGOS_ANTICIPADOS_COMB = PAGOS_ANTICIPADOS_MASP + PAGOS_ANTICIPADOS_PST;

        PROV_CUENTAS_INCOBRABLES_MASP = safeValue(storedDataComb.masBG?.provCuenInc);
        PROV_CUENTAS_INCOBRABLES_MASP = PROV_CUENTAS_INCOBRABLES_MASP / 1000;
        PROV_CUENTAS_INCOBRABLES_MASP = Math.round(PROV_CUENTAS_INCOBRABLES_MASP);
        PROV_CUENTAS_INCOBRABLES_PST = safeValue(storedDataComb.pstBG?.provisionCuentasIncobrables);
        PROV_CUENTAS_INCOBRABLES_PST = PROV_CUENTAS_INCOBRABLES_PST / 1000;
        PROV_CUENTAS_INCOBRABLES_PST = Math.round(PROV_CUENTAS_INCOBRABLES_PST);
        PROV_CUENTAS_INCOBRABLES_COMB = PROV_CUENTAS_INCOBRABLES_MASP + PROV_CUENTAS_INCOBRABLES_PST;

        DEUDORES_DIVERSOS_MASP = safeValue(storedDataComb.masBG?.docCobrar) + safeValue(storedDataComb.masBG?.deudoresDiversos);
        DEUDORES_DIVERSOS_MASP = DEUDORES_DIVERSOS_MASP / 1000;
        DEUDORES_DIVERSOS_MASP = Math.round(DEUDORES_DIVERSOS_MASP);
        DEUDORES_DIVERSOS_PST = safeValue(storedDataComb.pstBG?.documentosPorCobrar) + safeValue(storedDataComb.pstBG?.deudoresDiversos);
        DEUDORES_DIVERSOS_PST = DEUDORES_DIVERSOS_PST / 1000;
        DEUDORES_DIVERSOS_PST = Math.round(DEUDORES_DIVERSOS_PST);
        DEUDORES_DIVERSOS_COMB = DEUDORES_DIVERSOS_MASP + DEUDORES_DIVERSOS_PST;

        IVA_IMP_PAG_ANTI_MASP = safeValue(storedDataComb.masBG?.ivAcred) + safeValue(storedDataComb.masBG?.ivaPAcred) + safeValue(storedDataComb.masBG?.subEmpleo) + safeValue(storedDataComb.masBG?.impPagAnt);
        IVA_IMP_PAG_ANTI_MASP = IVA_IMP_PAG_ANTI_MASP / 1000;
        IVA_IMP_PAG_ANTI_MASP = Math.round(IVA_IMP_PAG_ANTI_MASP);
        IVA_IMP_PAG_ANTI_PST = safeValue(storedDataComb.pstBG?.ivaAcreditable) + safeValue(storedDataComb.pstBG?.ivaPAcreditar) + safeValue(storedDataComb.pstBG?.subEmpleo) + safeValue(storedDataComb.pstBG?.impuestosPagadosPorAnticipado);
        IVA_IMP_PAG_ANTI_PST = IVA_IMP_PAG_ANTI_PST / 1000;
        IVA_IMP_PAG_ANTI_PST = Math.round(IVA_IMP_PAG_ANTI_PST);
        IVA_IMP_PAG_ANTI_COMB = IVA_IMP_PAG_ANTI_MASP + IVA_IMP_PAG_ANTI_PST;

        TOTAL_ACTIVO_CIRCULANTE_MASP = CAJA_MASP + CLIENTES_MASP + CTAS_COBRAR_FILIALESOP_MASP + INVENTARIO_MASP + PAGOS_ANTICIPADOS_MASP + PROV_CUENTAS_INCOBRABLES_MASP + DEUDORES_DIVERSOS_MASP + IVA_IMP_PAG_ANTI_MASP;
        TOTAL_ACTIVO_CIRCULANTE_PST = CAJA_PST + CLIENTES_PST + CTAS_COBRAR_FILIALESOP_PST + INVENTARIOS_PST + PAGOS_ANTICIPADOS_PST + PROV_CUENTAS_INCOBRABLES_PST + DEUDORES_DIVERSOS_PST + IVA_IMP_PAG_ANTI_PST;
        TOTAL_ACTIVO_CIRCULANTE_COMB = CAJA_COMB + CLIENTES_COMB + CTAS_COBRAR_FILIALESOP_COMB + INVENTARIOS_COMB + PAGOS_ANTICIPADOS_COMB + PROV_CUENTAS_INCOBRABLES_COMB + DEUDORES_DIVERSOS_COMB + IVA_IMP_PAG_ANTI_COMB;

        MAQUINARIA_Y_EQUIPO_MASP = safeValue(storedDataComb.masBG?.mobYEQOficina) + safeValue(storedDataComb.masBG?.equipoDeComputo) + safeValue(storedDataComb.masBG?.mobYEQAlmacen) + safeValue(storedDataComb.masBG?.alarmaYEqSeguridad) + safeValue(storedDataComb.masBG?.maquinariaArrendamiento);
        MAQUINARIA_Y_EQUIPO_MASP = MAQUINARIA_Y_EQUIPO_MASP / 1000;
        MAQUINARIA_Y_EQUIPO_MASP = Math.round(MAQUINARIA_Y_EQUIPO_MASP);
        MAQUINARIA_Y_EQUIPO_PST = safeValue(storedDataComb.pstBG?.mobiliarioYEquipo) + safeValue(storedDataComb.pstBG?.equipoDeComputo) + safeValue(storedDataComb.pstBG?.mobiliarioYEquipoAlmacen) + safeValue(storedDataComb.pstBG?.alarmaYEqSeguridad) + safeValue(storedDataComb.pstBG?.maquinariaEqPST) + safeValue(storedDataComb.pstBG?.moldesSuajadoPST);
        MAQUINARIA_Y_EQUIPO_PST = MAQUINARIA_Y_EQUIPO_PST / 1000;
        MAQUINARIA_Y_EQUIPO_PST = Math.round(MAQUINARIA_Y_EQUIPO_PST);
        MAQUINARIA_Y_EQUIPO_COMB = MAQUINARIA_Y_EQUIPO_MASP + MAQUINARIA_Y_EQUIPO_PST;

        EQUIPO_TRANSPORTE_MASP = safeValue(storedDataComb.masBG?.equipoDeReparto);
        EQUIPO_TRANSPORTE_MASP = EQUIPO_TRANSPORTE_MASP / 1000;
        EQUIPO_TRANSPORTE_MASP = Math.round(EQUIPO_TRANSPORTE_MASP);
        EQUIPO_TRANSPORTE_PST = safeValue(storedDataComb.pstBG?.equipoDeReparto);
        EQUIPO_TRANSPORTE_PST = EQUIPO_TRANSPORTE_PST / 1000;
        EQUIPO_TRANSPORTE_PST = Math.round(EQUIPO_TRANSPORTE_PST);
        EQUIPO_TRANSPORTE_COMB = EQUIPO_TRANSPORTE_MASP + EQUIPO_TRANSPORTE_PST;

        DEPRECIACION_ACUMULADA_MASP = safeValue(storedDataComb.masBG?.acumDepMob) + safeValue(storedDataComb.masBG?.depAcumEqComputo) + safeValue(storedDataComb.masBG?.depAcumEqReparto) + safeValue(storedDataComb.masBG?.depAcumEQAlmacen) + safeValue(storedDataComb.masBG?.depAcumAlarmaYEqSeguridad) + safeValue(storedDataComb.masBG?.acumMaquinariaArrendamiento) + safeValue(storedDataComb.masBG?.depAcumMaquinariaYEquipo);
        DEPRECIACION_ACUMULADA_MASP = DEPRECIACION_ACUMULADA_MASP / 1000;
        DEPRECIACION_ACUMULADA_MASP = Math.round(DEPRECIACION_ACUMULADA_MASP);
        DEPRECIACION_ACUMULADA_MASP = - (DEPRECIACION_ACUMULADA_MASP);
        DEPRECIACION_ACUMULADA_PST = safeValue(storedDataComb.pstBG?.acumDepMob) + safeValue(storedDataComb.pstBG?.depAcumEqComputo) + safeValue(storedDataComb.pstBG?.depAcumEqReparto) + safeValue(storedDataComb.pstBG?.depAcumEqAlmacen) + safeValue(storedDataComb.pstBG?.depAcumAlarmaYEqSeguridad) + safeValue(storedDataComb.pstBG?.depAcumMaquinariaEq) + safeValue(storedDataComb.pstBG?.depAcumMoldesSuajado);
        DEPRECIACION_ACUMULADA_PST = DEPRECIACION_ACUMULADA_PST / 1000;
        DEPRECIACION_ACUMULADA_PST = Math.round(DEPRECIACION_ACUMULADA_PST);
        DEPRECIACION_ACUMULADA_PST = - (DEPRECIACION_ACUMULADA_PST);
        DEPRECIACION_ACUMULADA_COMB = DEPRECIACION_ACUMULADA_MASP + DEPRECIACION_ACUMULADA_PST;

        ACTIVOS_FIJOS_MASP = TERRENOS_Y_EDIFICIOS_MASP! + MAQUINARIA_Y_EQUIPO_MASP + EQUIPO_TRANSPORTE_MASP + ACTUALIZACION_ACTIVO_FIJO_MASP - DEPRECIACION_ACUMULADA_MASP;
        ACTIVOS_FIJOS_PST = TERRENOS_Y_EDIFICIOS_PST! + MAQUINARIA_Y_EQUIPO_PST + EQUIPO_TRANSPORTE_PST + ACTUALIZACION_ACTIVO_FIJO_PST - DEPRECIACION_ACUMULADA_PST;
        ACTIVOS_FIJOS_COMB = TERRENOS_Y_EDIFICIOS_COMB! + MAQUINARIA_Y_EQUIPO_COMB + EQUIPO_TRANSPORTE_COMB + ACTUALIZACION_ACTIVO_FIJO_COMB - DEPRECIACION_ACUMULADA_COMB;

        ACTIVOS_DIFERIDOS_MASP = safeValue(storedDataComb.masBG?.sumaActivoDiferido);
        ACTIVOS_DIFERIDOS_MASP = ACTIVOS_DIFERIDOS_MASP / 1000;
        ACTIVOS_DIFERIDOS_MASP = Math.round(ACTIVOS_DIFERIDOS_MASP);
        ACTIVOS_DIFERIDOS_PST = safeValue(storedDataComb.pstBG?.sumaActivoDiferido);
        ACTIVOS_DIFERIDOS_PST = ACTIVOS_DIFERIDOS_PST / 1000;
        ACTIVOS_DIFERIDOS_PST = Math.round(ACTIVOS_DIFERIDOS_PST);
        ACTIVOS_DIFERIDOS_COMB = ACTIVOS_DIFERIDOS_MASP + ACTIVOS_DIFERIDOS_PST;

        TOTAL_ACTIVO_MASP = TOTAL_ACTIVO_CIRCULANTE_MASP + ACTIVOS_FIJOS_MASP + INVERSION_SUBSIDIARIAS_MASP! + ACTIVOS_DIFERIDOS_MASP + OTROS_ACTIVOS_MASP;
        TOTAL_ACTIVO_PST = TOTAL_ACTIVO_CIRCULANTE_PST + ACTIVOS_FIJOS_PST + INVERSION_SUBSIDIARIAS_PST! + ACTIVOS_DIFERIDOS_PST + OTROS_ACTIVOS_PST;
        TOTAL_ACTIVO_COMB = TOTAL_ACTIVO_CIRCULANTE_COMB + ACTIVOS_FIJOS_COMB + INVERSION_SUBSIDIARIAS_COMB + ACTIVOS_DIFERIDOS_COMB + OTROS_ACTIVOS_COMB;

        // BALANCE GENERAL PARTE PASIVO
        PROVEEDORES_MASP = safeValue(storedDataComb.masBG?.proveedores);
        PROVEEDORES_MASP = PROVEEDORES_MASP / 1000;
        PROVEEDORES_MASP = Math.round(PROVEEDORES_MASP);
        PROVEEDORES_PST = safeValue(storedDataComb.pstBG?.proveedores);
        PROVEEDORES_PST = PROVEEDORES_PST / 1000;
        PROVEEDORES_PST = Math.round(PROVEEDORES_PST);
        PROVEEDORES_COMB = PROVEEDORES_MASP + PROVEEDORES_PST;

        CTAS_PAG_FILIALES_OP_MASP = safeValue(storedDataComb.masBG?.ctasPagFilOP);
        CTAS_PAG_FILIALES_OP_MASP = CTAS_PAG_FILIALES_OP_MASP / 1000;
        CTAS_PAG_FILIALES_OP_MASP = Math.round(CTAS_PAG_FILIALES_OP_MASP);
        CTAS_PAG_FILIALES_OP_PST = safeValue(storedDataComb.pstBG?.ctasPagarFilOp);
        CTAS_PAG_FILIALES_OP_PST = CTAS_PAG_FILIALES_OP_PST / 1000;
        CTAS_PAG_FILIALES_OP_PST = Math.round(CTAS_PAG_FILIALES_OP_PST);
        CTAS_PAG_FILIALES_OP_ELIM = CTAS_PAG_FILIALES_OP_MASP + CTAS_PAG_FILIALES_OP_PST;
        CTAS_PAG_FILIALES_OP_COMB = CTAS_PAG_FILIALES_OP_MASP + CTAS_PAG_FILIALES_OP_PST - CTAS_PAG_FILIALES_OP_ELIM;

        NETO_FILIAL = CTAS_COBRAR_FILIALESOP_ELIM - CTAS_PAG_FILIALES_OP_ELIM;

        IMP_PAGAR_PTU_MASP = safeValue(storedDataComb.masBG?.ivaTrasladado) + safeValue(storedDataComb.masBG?.ivaPTrasladar) + safeValue(storedDataComb.masBG?.impRetenidos) + safeValue(storedDataComb.masBG?.impPropios);
        IMP_PAGAR_PTU_MASP = IMP_PAGAR_PTU_MASP / 1000;
        IMP_PAGAR_PTU_MASP = Math.round(IMP_PAGAR_PTU_MASP);
        IMP_PAGAR_PTU_PST = safeValue(storedDataComb.pstBG?.ivaTrasladado) + safeValue(storedDataComb.pstBG?.ivaPTrasladar) + safeValue(storedDataComb.pstBG?.impRetenidos) + safeValue(storedDataComb.pstBG?.impuestosPropios);
        IMP_PAGAR_PTU_PST = IMP_PAGAR_PTU_PST / 1000;
        IMP_PAGAR_PTU_PST = Math.round(IMP_PAGAR_PTU_PST);
        IMP_PAGAR_PTU_COMB = IMP_PAGAR_PTU_MASP + IMP_PAGAR_PTU_PST;

        if(NETO_FILIAL < 0){
            APALANCAMIENTO_ELIMC = - (NETO_FILIAL);
        }

        if(NETO_FILIAL > 0){
            APALANCAMIENTO_ELIMD = - (NETO_FILIAL);
        }

        APALANCAMIENTO_COMB = APALANCAMIENTO_ELIMC - APALANCAMIENTO_ELIMD;

        ACREEDORES_DIVERSOS_MASP = safeValue(storedDataComb.masBG?.acreedoresDiversos);
        ACREEDORES_DIVERSOS_MASP = ACREEDORES_DIVERSOS_MASP / 1000;
        ACREEDORES_DIVERSOS_MASP = Math.round(ACREEDORES_DIVERSOS_MASP);
        ACREEDORES_DIVERSOS_PST = safeValue(storedDataComb.pstBG?.acreedoresDiversos);
        ACREEDORES_DIVERSOS_PST = ACREEDORES_DIVERSOS_PST / 1000;
        ACREEDORES_DIVERSOS_PST = Math.round(ACREEDORES_DIVERSOS_PST);
        ACREEDORES_DIVERSOS_COMB = ACREEDORES_DIVERSOS_MASP + ACREEDORES_DIVERSOS_PST;

        TOTAL_PASIVO_CIRCULANTE_MASP = PROVEEDORES_MASP! + CTAS_PAG_FILIALES_OP_MASP + INTERESES_PAGAR_MASP + IMP_PAGAR_PTU_MASP + GASTOS_ACUM_MASP + APALANCAMIENTO_MASP + BANCOS_CORTO_PLAZO_MASP + OTROS_PASIVOS_MASP + LP_BANCOS_MASP + LP_OTROS_BANCOS_MASP + ACREEDORES_DIVERSOS_MASP + OTROS_PAS_CIR_NO_OPERAT_MASP;
        TOTAL_PASIVO_CIRCULANTE_PST = PROVEEDORES_PST! + CTAS_PAG_FILIALES_OP_PST + INTERESES_PAGAR_PST + IMP_PAGAR_PTU_PST + GASTOS_ACUM_PST + APALANCAMIENTO_PST + BANCOS_CORTO_PLAZO_PST + OTROS_PASIVOS_PST + LP_BANCOS_PST + LP_OTROS_BANCOS_PST + ACREEDORES_DIVERSOS_PST + OTROS_PAS_CIR_NO_OPERAT_PST;
        TOTAL_PASIVO_CIRCULANTE_COMB = PROVEEDORES_COMB + CTAS_PAG_FILIALES_OP_COMB + INTERESES_PAGAR_COMB + IMP_PAGAR_PTU_COMB + GASTOS_ACUM_COMB + APALANCAMIENTO_COMB + BANCOS_CORTO_PLAZO_COMB + OTROS_PASIVOS_COMB + LP_BANCOS_COMB + LP_OTROS_BANCOS_COMB + ACREEDORES_DIVERSOS_COMB + OTROS_PAS_CIR_NO_OPERAT_COMB;

        BANCOS_LARGO_PLAZO_MASP = safeValue(storedDataComb.masBG?.creditosBancarios);
        BANCOS_LARGO_PLAZO_MASP = BANCOS_LARGO_PLAZO_MASP / 1000;
        BANCOS_LARGO_PLAZO_MASP = Math.round(BANCOS_LARGO_PLAZO_MASP);
        BANCOS_LARGO_PLAZO_PST = safeValue(storedDataComb.pstBG?.creditosBancarios);
        BANCOS_LARGO_PLAZO_PST = BANCOS_LARGO_PLAZO_PST / 1000;
        BANCOS_LARGO_PLAZO_PST = Math.round(BANCOS_LARGO_PLAZO_PST);
        BANCOS_LARGO_PLAZO_COMB = BANCOS_LARGO_PLAZO_MASP + BANCOS_LARGO_PLAZO_PST;

        TOTAL_PASIVO_LP_MASP = BANCOS_LARGO_PLAZO_MASP + OTROS_BANCOS_LP_MASP! + OTROS_PASIVOS_FINANC_MASP + PRIMAS_ANTIGUEDAD_MASP + PASIVO_DIFEREIDO_MASP + IMP_DIFERIDOS_MASP;
        TOTAL_PASIVO_LP_PST = BANCOS_LARGO_PLAZO_PST + OTROS_BANCOS_LP_PST! + OTROS_PASIVOS_FINANC_PST + PRIMAS_ANTIGUEDAD_PST + PASIVO_DIFEREIDO_PST + IMP_DIFERIDOS_PST;
        TOTAL_PASIVO_LP_COMB = BANCOS_LARGO_PLAZO_COMB + OTROS_BANCOS_LP_COMB + OTROS_PASIVOS_FINANC_COMB + PRIMAS_ANTIGUEDAD_COMB + PASIVO_DIFEREIDO_COMB + IMP_DIFERIDOS_COMB;

        TOTAL_PASIVO_MASP = TOTAL_PASIVO_CIRCULANTE_MASP + TOTAL_PASIVO_LP_MASP;
        TOTAL_PASIVO_PST = TOTAL_PASIVO_CIRCULANTE_PST + TOTAL_PASIVO_LP_PST;
        TOTAL_PASIVO_COMB = TOTAL_PASIVO_CIRCULANTE_COMB + TOTAL_PASIVO_LP_COMB;

        CAPITAL_SOCIAL_MASP = safeValue(storedDataComb.masBG?.capitalSocialFijo) + safeValue(storedDataComb.masBG?.capitalSocialVariable) + safeValue(storedDataComb.masBG?.reservaLegal);
        CAPITAL_SOCIAL_MASP = CAPITAL_SOCIAL_MASP / 1000;
        CAPITAL_SOCIAL_MASP = Math.round(CAPITAL_SOCIAL_MASP);
        CAPITAL_SOCIAL_PST = safeValue(storedDataComb.pstBG?.capitalSocialFijo) + safeValue(storedDataComb.pstBG?.capitalSocialVariable) + safeValue(storedDataComb.pstBG?.reservaLegal);
        CAPITAL_SOCIAL_PST = CAPITAL_SOCIAL_PST / 1000;
        CAPITAL_SOCIAL_PST = Math.round(CAPITAL_SOCIAL_PST);
        CAPITAL_SOCIAL_COMB = CAPITAL_SOCIAL_MASP + CAPITAL_SOCIAL_PST;

        SUPERAVIT_DEFICIT_ACT_MASP1 = safeValue(storedDataComb.masBG?.resultadoDelEjercicio);
        SUPERAVIT_DEFICIT_ACT_MASP1 = SUPERAVIT_DEFICIT_ACT_MASP1 / 1000;
        SUPERAVIT_DEFICIT_ACT_MASP1 = Math.round(SUPERAVIT_DEFICIT_ACT_MASP1);
        SUPERAVIT_DEFICIT_ACT_MASP2 = safeValue(storedDataComb.masER?.utlAntesIsrYPtuE);
        SUPERAVIT_DEFICIT_ACT_MASP2 = SUPERAVIT_DEFICIT_ACT_MASP2 / 1000;
        SUPERAVIT_DEFICIT_ACT_MASP2 = Math.round(SUPERAVIT_DEFICIT_ACT_MASP2);
        SUPERAVIT_DEFICIT_ACT_MASP3 = safeValue(storedDataComb.masER?.utlAntesIsrYPtuP);
        SUPERAVIT_DEFICIT_ACT_MASP3 = SUPERAVIT_DEFICIT_ACT_MASP3 / 1000;
        SUPERAVIT_DEFICIT_ACT_MASP3 = Math.round(SUPERAVIT_DEFICIT_ACT_MASP3);

        SUPERAVIT_DEFICIT_ACT_PST1 = safeValue(storedDataComb.pstBG?.resultadoDelEjercicio);
        SUPERAVIT_DEFICIT_ACT_PST1 = SUPERAVIT_DEFICIT_ACT_PST1 / 1000;
        SUPERAVIT_DEFICIT_ACT_PST1 = Math.round(SUPERAVIT_DEFICIT_ACT_PST1);
        SUPERAVIT_DEFICIT_ACT_PST2 = safeValue(storedDataComb.pstER?.utlAntesIsrYPtuE);
        SUPERAVIT_DEFICIT_ACT_PST2 = SUPERAVIT_DEFICIT_ACT_PST2 / 1000;
        SUPERAVIT_DEFICIT_ACT_PST2 = Math.round(SUPERAVIT_DEFICIT_ACT_PST2);
        SUPERAVIT_DEFICIT_ACT_PST3 = safeValue(storedDataComb.pstER?.utlAntesIsrYPtuP);
        SUPERAVIT_DEFICIT_ACT_PST3 = SUPERAVIT_DEFICIT_ACT_PST3 / 1000;
        SUPERAVIT_DEFICIT_ACT_PST3 = Math.round(SUPERAVIT_DEFICIT_ACT_PST3);

        SUPERAVIT_DEFICIT_ACT_ELIM_D1 = safeValue(storedDataComb.elim?.costoVentasR);
        SUPERAVIT_DEFICIT_ACT_ELIM_D1 = SUPERAVIT_DEFICIT_ACT_ELIM_D1 / 1000;
        SUPERAVIT_DEFICIT_ACT_ELIM_D1 = Math.round(SUPERAVIT_DEFICIT_ACT_ELIM_D1);
        SUPERAVIT_DEFICIT_ACT_ELIM_D2 = safeValue(storedDataComb.elim?.serviciosAdmin);
        SUPERAVIT_DEFICIT_ACT_ELIM_D2 = SUPERAVIT_DEFICIT_ACT_ELIM_D2 / 1000;
        SUPERAVIT_DEFICIT_ACT_ELIM_D2 = Math.round(SUPERAVIT_DEFICIT_ACT_ELIM_D2);
        SUPERAVIT_DEFICIT_ACT_ELIM_DF = SUPERAVIT_DEFICIT_ACT_ELIM_D1 + SUPERAVIT_DEFICIT_ACT_ELIM_D2;

        SUPERAVIT_DEFICIT_ACT_ELIM_C1 = safeValue(storedDataComb.elim?.superavitDefiActuI);
        SUPERAVIT_DEFICIT_ACT_ELIM_C1 = SUPERAVIT_DEFICIT_ACT_ELIM_C1 / 1000;
        SUPERAVIT_DEFICIT_ACT_ELIM_C1 = Math.round(SUPERAVIT_DEFICIT_ACT_ELIM_C1);
        SUPERAVIT_DEFICIT_ACT_ELIM_C2 = safeValue(storedDataComb.elim?.superavitDefiActuN);
        SUPERAVIT_DEFICIT_ACT_ELIM_C2 = SUPERAVIT_DEFICIT_ACT_ELIM_C2 / 1000;
        SUPERAVIT_DEFICIT_ACT_ELIM_C2 = Math.round(SUPERAVIT_DEFICIT_ACT_ELIM_C2);
        SUPERAVIT_DEFICIT_ACT_ELIM_CF = SUPERAVIT_DEFICIT_ACT_ELIM_C1 + SUPERAVIT_DEFICIT_ACT_ELIM_C2;

        UTILIDADES_RETENIDAS_MASP = UTILIDADES_RETENIDAS_MASP_BG;
        UTILIDADES_RETENIDAS_PST = UTILIDADES_RETENIDAS_PST_BG;
        SUPERAVIT_DEFICIT_ACT_MASPF = SUPERAVIT_DEFICIT_ACT_MASP1 - UTILIDADES_RETENIDAS_MASP + SUPERAVIT_DEFICIT_ACT_MASP2 - SUPERAVIT_DEFICIT_ACT_MASP3;
        SUPERAVIT_DEFICIT_ACT_PSTF = SUPERAVIT_DEFICIT_ACT_PST1 - UTILIDADES_RETENIDAS_PST + SUPERAVIT_DEFICIT_ACT_PST2 - SUPERAVIT_DEFICIT_ACT_PST3;
        SUPERAVIT_DEFICIT_ACT_COMB = SUPERAVIT_DEFICIT_ACT_MASPF + SUPERAVIT_DEFICIT_ACT_PSTF - SUPERAVIT_DEFICIT_ACT_ELIM_DF + SUPERAVIT_DEFICIT_ACT_ELIM_CF;
        UTILIDADES_RETENIDAS_COMB = UTILIDADES_RETENIDAS_MASP + UTILIDADES_RETENIDAS_PST;

        UTILIDAD_DEL_EJERCICIO_MASP = UTILIDAD_NETA_MASP
        UTILIDAD_DEL_EJERCICIO_PST = UTILIDAD_NETA_PST
        UTILIDAD_DEL_EJERCICIO_COMB = UTILIDAD_NETA_COMB
        
        INSUFICIENCIA_INVENTARIO_MASP = safeValue(storedDataComb.masBG?.superavitDefictCapital);
        INSUFICIENCIA_INVENTARIO_MASP = INSUFICIENCIA_INVENTARIO_MASP / 1000;
        INSUFICIENCIA_INVENTARIO_MASP = Math.round(INSUFICIENCIA_INVENTARIO_MASP);
        INSUFICIENCIA_INVENTARIO_PST = safeValue(storedDataComb.pstBG?.superavitDefiCapital);
        INSUFICIENCIA_INVENTARIO_PST = INSUFICIENCIA_INVENTARIO_PST / 1000;
        INSUFICIENCIA_INVENTARIO_PST = Math.round(INSUFICIENCIA_INVENTARIO_PST);
        INSUFICIENCIA_INVENTARIO_COMB = INSUFICIENCIA_INVENTARIO_MASP + INSUFICIENCIA_INVENTARIO_PST;

        TOTAL_CAP_CONTABLE_MASP = CAPITAL_SOCIAL_MASP + APORTACIONES_FUTUROS_MASP! + IMP_DIFERIDOSC_MASP + SUPERAVIT_DEFICIT_ACT_MASPF + UTILIDADES_RETENIDAS_MASP + UTILIDAD_DEL_EJERCICIO_MASP + INSUFICIENCIA_INVENTARIO_MASP;
        TOTAL_CAP_CONTABLE_PST = CAPITAL_SOCIAL_PST + APORTACIONES_FUTUROS_PST! + IMP_DIFERIDOSC_PST + SUPERAVIT_DEFICIT_ACT_PSTF + UTILIDADES_RETENIDAS_PST + UTILIDAD_DEL_EJERCICIO_PST + INSUFICIENCIA_INVENTARIO_PST;
        TOTAL_CAP_CONTABLE_COMB = CAPITAL_SOCIAL_COMB + APORTACIONES_FUTUROS_COMB + IMP_DIFERIDOSC_COMB + SUPERAVIT_DEFICIT_ACT_COMB + UTILIDADES_RETENIDAS_COMB + UTILIDAD_DEL_EJERCICIO_COMB + INSUFICIENCIA_INVENTARIO_COMB;

        TOTAL_PASIVO_CAP_CONT_MASP = TOTAL_PASIVO_MASP + TOTAL_CAP_CONTABLE_MASP;
        TOTAL_PASIVO_CAP_CONT_PST = TOTAL_PASIVO_PST + TOTAL_CAP_CONTABLE_PST;
        TOTAL_PASIVO_CAP_CONT_COMB = TOTAL_PASIVO_COMB + TOTAL_CAP_CONTABLE_COMB;

        // VARIABLES PARA EL ESTADO DE RESULTADOS
        let VENTAS_MON_NAC_ER = 0;
        let VENTAS_DLS_ER = 0;
        let VENTAS_NETAS_TOTALES_ER = 0;
        let COSTO_VENTAS_ER = 0;
        let UTILIDAD_BRUTA_ER = 0;
        let GASTOS_ADMON_VTA_ER = 0;
        let DEPRECIACION_AMORTIZACION_ER = 0;
        let UTILIDAD_OPERACION_ER = 0;
        let GASTOS_FINANCIEROS_ER = 0;
        let PRODUCTOS_FINANCIEROS_ER = 0;
        let PERDIDA_POSICION_MON_ER = 0;
        let PERDIDA_CAMBIARA_ER = 0;
        let COSTO_INTEGRAL_FINANCIAM_ER = 0;
        let OTROS_GASTOS_ER = 0;
        let UT_ANTES_ISR_PTU_ER = 0;
        let IMP_SOBRE_RENTA_ER = 0;
        let IMP_DIFERIDO_ER = 0;
        let PTU_ER = 0;
        let IMP_ACTIVO_ER = 0;
        let UT_ANTES_PART_EXTAORD_ER = 0;
        let PERDIDA_EXT_ER = 0;
        let PERDIDA_SUBSIDIARIAS_ER = 0;
        let UTILIDAD_NETA_ER = 0;    
        
        
        let VENTAS_MON_NAC_ER_POR = 0;
        let VENTAS_DLS_ER_POR = 0;
        let VENTAS_NETAS_TOTALES_ER_POR = 0;
        let COSTO_VENTAS_ER_POR = 0;
        let UTILIDAD_BRUTA_ER_POR = 0;
        let GASTOS_ADMON_VTA_ER_POR = 0;
        let DEPRECIACION_AMORTIZACION_ER_POR = 0;
        let UTILIDAD_OPERACION_ER_POR = 0;
        let GASTOS_FINANCIEROS_ER_POR = 0;
        let PRODUCTOS_FINANCIEROS_ER_POR = 0;
        let PERDIDA_POSICION_MON_ER_POR = 0;
        let PERDIDA_CAMBIARA_ER_POR = 0;
        let COSTO_INTEGRAL_FINANCIAM_ER_POR = 0;
        let OTROS_GASTOS_ER_POR = 0;
        let UT_ANTES_ISR_PTU_ER_POR = 0;
        let IMP_SOBRE_RENTA_ER_POR = 0;
        let IMP_DIFERIDO_ER_POR = 0;
        let PTU_ER_POR = 0;
        let IMP_ACTIVO_ER_POR = 0;
        let UT_ANTES_PART_EXTAORD_ER_POR = 0;
        let PERDIDA_EXT_ER_POR = 0;
        let PERDIDA_SUBSIDIARIAS_ER_POR = 0;
        let UTILIDAD_NETA_ER_POR = 0;        

        VENTAS_MON_NAC_ER = VENTAS_TOTALES_COMB;
        VENTAS_NETAS_TOTALES_ER = VENTAS_MON_NAC_ER + VENTAS_DLS_ER!;
        COSTO_VENTAS_ER = COSTOS_VENTAS_COMB;
        UTILIDAD_BRUTA_ER = VENTAS_NETAS_TOTALES_ER - COSTO_VENTAS_ER;
        GASTOS_ADMON_VTA_ER = GASTOS_ADMON_VTA_COMB;
        DEPRECIACION_AMORTIZACION_ER = DEPRECIACION_AMORTIZACION_COMB;
        UTILIDAD_OPERACION_ER = UTILIDAD_BRUTA_ER - (GASTOS_ADMON_VTA_ER + DEPRECIACION_AMORTIZACION_ER);
        GASTOS_FINANCIEROS_ER = GASTOS_FINANCIEROS_COMB;
        PRODUCTOS_FINANCIEROS_ER = PRODUCTOS_FINANCIEROS_COMB;
        PERDIDA_POSICION_MON_ER = PERDIDA_POSICION_MON_COMB;
        PERDIDA_CAMBIARA_ER = PERDIDA_CAMBIARA_COMB;
        COSTO_INTEGRAL_FINANCIAM_ER = GASTOS_FINANCIEROS_ER + PRODUCTOS_FINANCIEROS_ER + PERDIDA_POSICION_MON_ER + PERDIDA_CAMBIARA_ER;
        OTROS_GASTOS_ER = OTROS_GASTOS_COMB;
        UT_ANTES_ISR_PTU_ER = UTILIDAD_OPERACION_ER - COSTO_INTEGRAL_FINANCIAM_ER - OTROS_GASTOS_ER;
        IMP_SOBRE_RENTA_ER = IMP_SOBRE_RENTA_COMB;
        IMP_DIFERIDO_ER = IMP_DIFERIDO_COMB;
        PTU_ER = PTU_COMB;
        IMP_ACTIVO_ER = IMP_ACTIVO_COMB;
        UT_ANTES_PART_EXTAORD_ER = UT_ANTES_ISR_PTU_ER - IMP_SOBRE_RENTA_ER - IMP_DIFERIDO_ER - PTU_ER - IMP_ACTIVO_ER;
        PERDIDA_EXT_ER = PERIDIDA_EXT_COMB;
        PERDIDA_SUBSIDIARIAS_ER = PERDIDA_SUBSIDIARIAS_COMB;
        UTILIDAD_NETA_ER = UT_ANTES_PART_EXTAORD_ER - PERDIDA_EXT_ER - PERDIDA_SUBSIDIARIAS_ER;

        if(VENTAS_NETAS_TOTALES_ER == 0){

        } else {
            VENTAS_MON_NAC_ER_POR = Math.round((VENTAS_NETAS_TOTALES_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            VENTAS_DLS_ER_POR = Math.round((VENTAS_DLS_ER! / VENTAS_NETAS_TOTALES_ER) * 100);
            VENTAS_NETAS_TOTALES_ER_POR = Math.round((VENTAS_NETAS_TOTALES_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            COSTO_VENTAS_ER_POR = Math.round((COSTO_VENTAS_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            UTILIDAD_BRUTA_ER_POR = Math.round((UTILIDAD_BRUTA_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            GASTOS_ADMON_VTA_ER_POR = Math.round((GASTOS_ADMON_VTA_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            DEPRECIACION_AMORTIZACION_ER_POR = Math.round((DEPRECIACION_AMORTIZACION_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            UTILIDAD_OPERACION_ER_POR = Math.round((UTILIDAD_OPERACION_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            GASTOS_FINANCIEROS_ER_POR = Math.round((GASTOS_FINANCIEROS_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            PRODUCTOS_FINANCIEROS_ER_POR = Math.round((PRODUCTOS_FINANCIEROS_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            PERDIDA_POSICION_MON_ER_POR = Math.round((PERDIDA_POSICION_MON_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            PERDIDA_CAMBIARA_ER_POR = Math.round((PERDIDA_CAMBIARA_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            COSTO_INTEGRAL_FINANCIAM_ER_POR = Math.round((COSTO_INTEGRAL_FINANCIAM_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            OTROS_GASTOS_ER_POR = Math.round((OTROS_GASTOS_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            UT_ANTES_ISR_PTU_ER_POR = Math.round((UT_ANTES_ISR_PTU_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            IMP_SOBRE_RENTA_ER_POR = Math.round((IMP_SOBRE_RENTA_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            IMP_DIFERIDO_ER_POR = Math.round((IMP_DIFERIDO_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            PTU_ER_POR = Math.round((PTU_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            IMP_ACTIVO_ER_POR = Math.round((IMP_ACTIVO_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            UT_ANTES_PART_EXTAORD_ER_POR = Math.round((UT_ANTES_PART_EXTAORD_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            PERDIDA_EXT_ER_POR = Math.round((PERDIDA_EXT_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            PERDIDA_SUBSIDIARIAS_ER_POR = Math.round((PERDIDA_SUBSIDIARIAS_ER / VENTAS_NETAS_TOTALES_ER) * 100);
            UTILIDAD_NETA_ER_POR = Math.round((UTILIDAD_NETA_ER / VENTAS_NETAS_TOTALES_ER) * 100);
        }


        // VARIABLES PARA EL BALANCE GENERAL PARTE FIJO
        let CAJA_BG = 0;
        let CLIENTES_BG = 0;
        let CTAS_COBRAR_FILIALES_OP_BG = 0;
        let INVENTARIOS_BG = 0;
        let PAGOS_ANTICIPADOS_BG = 0;
        let RESERVA_CUENTAS_INCOBRABLES_BG = 0;
        let DEUDORES_DIVERSOS_BG = 0;
        let IVA_IMP_PAG_ANTI_BG = 0;
        let TOTAL_ACTIVO_CIRCULANTE_BG = 0;
        let TERRENO_EDIFICIOS_BG = 0;
        let MAQUINARIA_EQUIPO_BG = 0;
        let EQUIPO_TRANSPORTE_BG = 0;
        let ACTUALIZACION_ACTIVO_FIJO_BG = 0;
        let DEPRECIACION_ACUMULADA_BG = 0;
        let ACTIVOS_FIJOS_BG = 0;
        let INVERSION_SUB_BG = 0;
        let ACTIVOS_DIFERIDOS_BG = 0;
        let OTROS_ACTIVOS_BG = 0;
        let TOTAL_ACTIVO_BG = 0;   

        let CAJA_BG_POR = 0;
        let CLIENTES_BG_POR = 0;
        let CTAS_COBRAR_FILIALES_OP_BG_POR = 0;
        let INVENTARIOS_BG_POR = 0;
        let PAGOS_ANTICIPADOS_BG_POR = 0;
        let RESERVA_CUENTAS_INCOBRABLES_BG_POR = 0;
        let DEUDORES_DIVERSOS_BG_POR = 0;
        let IVA_IMP_PAG_ANTI_BG_POR = 0;
        let TOTAL_ACTIVO_CIRCULANTE_BG_POR = 0;
        let TERRENO_EDIFICIOS_BG_POR = 0;
        let MAQUINARIA_EQUIPO_BG_POR = 0;
        let EQUIPO_TRANSPORTE_BG_POR = 0;
        let ACTUALIZACION_ACTIVO_FIJO_BG_POR = 0;
        let DEPRECIACION_ACUMULADA_BG_POR = 0;
        let ACTIVOS_FIJOS_BG_POR = 0;
        let INVERSION_SUB_BG_POR = 0;
        let ACTIVOS_DIFERIDOS_BG_POR = 0;
        let OTROS_ACTIVOS_BG_POR = 0;
        let TOTAL_ACTIVO_BG_POR = 0;        

        CAJA_BG = CAJA_COMB;
        CLIENTES_BG = CLIENTES_COMB;
        CTAS_COBRAR_FILIALES_OP_BG = CTAS_COBRAR_FILIALESOP_COMB;
        INVENTARIOS_BG = INVENTARIOS_COMB;
        PAGOS_ANTICIPADOS_BG = PAGOS_ANTICIPADOS_COMB;
        RESERVA_CUENTAS_INCOBRABLES_BG = PROV_CUENTAS_INCOBRABLES_COMB;
        DEUDORES_DIVERSOS_BG = DEUDORES_DIVERSOS_COMB;
        IVA_IMP_PAG_ANTI_BG = IVA_IMP_PAG_ANTI_COMB;
        TOTAL_ACTIVO_CIRCULANTE_BG = CAJA_BG + CLIENTES_BG + CTAS_COBRAR_FILIALES_OP_BG + INVENTARIOS_BG + PAGOS_ANTICIPADOS_BG + RESERVA_CUENTAS_INCOBRABLES_BG + DEUDORES_DIVERSOS_BG + IVA_IMP_PAG_ANTI_BG;

        TERRENO_EDIFICIOS_BG = TERRENOS_Y_EDIFICIOS_COMB;
        MAQUINARIA_EQUIPO_BG = MAQUINARIA_Y_EQUIPO_COMB;
        EQUIPO_TRANSPORTE_BG = EQUIPO_TRANSPORTE_COMB;
        ACTUALIZACION_ACTIVO_FIJO_BG = ACTUALIZACION_ACTIVO_FIJO_COMB;
        DEPRECIACION_ACUMULADA_BG = DEPRECIACION_ACUMULADA_COMB;
        ACTIVOS_FIJOS_BG = TERRENO_EDIFICIOS_BG + MAQUINARIA_EQUIPO_BG + EQUIPO_TRANSPORTE_BG + ACTUALIZACION_ACTIVO_FIJO_BG - DEPRECIACION_ACUMULADA_BG;

        INVERSION_SUB_BG = INVERSION_SUBSIDIARIAS_COMB;
        ACTIVOS_DIFERIDOS_BG = ACTIVOS_DIFERIDOS_COMB;
        OTROS_ACTIVOS_BG = OTROS_ACTIVOS_COMB;
        TOTAL_ACTIVO_BG = TOTAL_ACTIVO_CIRCULANTE_BG + ACTIVOS_FIJOS_BG + INVERSION_SUB_BG + ACTIVOS_DIFERIDOS_BG + OTROS_ACTIVOS_BG;

        if(TOTAL_ACTIVO_BG == 0){
            
        } else {
            CAJA_BG_POR = Math.round((CAJA_BG / TOTAL_ACTIVO_BG) * 100);
            CLIENTES_BG_POR = Math.round((CLIENTES_BG / TOTAL_ACTIVO_BG) * 100);
            CTAS_COBRAR_FILIALES_OP_BG_POR = Math.round((CTAS_COBRAR_FILIALES_OP_BG / TOTAL_ACTIVO_BG) * 100);
            INVENTARIOS_BG_POR = Math.round((INVENTARIOS_BG / TOTAL_ACTIVO_BG) * 100);
            PAGOS_ANTICIPADOS_BG_POR = Math.round((PAGOS_ANTICIPADOS_BG / TOTAL_ACTIVO_BG) * 100);
            RESERVA_CUENTAS_INCOBRABLES_BG_POR = Math.round((RESERVA_CUENTAS_INCOBRABLES_BG / TOTAL_ACTIVO_BG) * 100);
            DEUDORES_DIVERSOS_BG_POR = Math.round((DEUDORES_DIVERSOS_BG / TOTAL_ACTIVO_BG) * 100);
            IVA_IMP_PAG_ANTI_BG_POR = Math.round((IVA_IMP_PAG_ANTI_BG / TOTAL_ACTIVO_BG) * 100);
            TOTAL_ACTIVO_CIRCULANTE_BG_POR = Math.round((TOTAL_ACTIVO_CIRCULANTE_BG / TOTAL_ACTIVO_BG) * 100);

            TERRENO_EDIFICIOS_BG_POR = Math.round((TERRENO_EDIFICIOS_BG / TOTAL_ACTIVO_BG) * 100);
            MAQUINARIA_EQUIPO_BG_POR = Math.round((MAQUINARIA_EQUIPO_BG / TOTAL_ACTIVO_BG) * 100);
            EQUIPO_TRANSPORTE_BG_POR = Math.round((EQUIPO_TRANSPORTE_BG / TOTAL_ACTIVO_BG) * 100);
            ACTUALIZACION_ACTIVO_FIJO_BG_POR = Math.round((ACTUALIZACION_ACTIVO_FIJO_BG / TOTAL_ACTIVO_BG) * 100);
            DEPRECIACION_ACUMULADA_BG_POR = Math.round((DEPRECIACION_ACUMULADA_BG / TOTAL_ACTIVO_BG) * 100);
            ACTIVOS_FIJOS_BG_POR = Math.round((ACTIVOS_FIJOS_BG / TOTAL_ACTIVO_BG) * 100);

            INVERSION_SUB_BG_POR = Math.round((INVERSION_SUB_BG / TOTAL_ACTIVO_BG) * 100);
            ACTIVOS_DIFERIDOS_BG_POR = Math.round((ACTIVOS_DIFERIDOS_BG / TOTAL_ACTIVO_BG) * 100);
            OTROS_ACTIVOS_BG_POR = Math.round((OTROS_ACTIVOS_BG / TOTAL_ACTIVO_BG) * 100);
            TOTAL_ACTIVO_BG_POR = Math.round((TOTAL_ACTIVO_BG_POR / TOTAL_ACTIVO_BG) * 100);
        }

        // VARIABLES PARA EL BALANCE GENERAL PARTE PASIVO
        let PROVEEDORES_BG = 0;
        let COMPROBACION_BG;
        let CTAS_PAG_FILIALES_OP_BG = 0;
        let NETO_FILIAL_BG = 0;
        let INTERESES_PAGAR_BG = 0;
        let IMP_PAGAR_PTU_BG = 0;
        let GASTOS_ACUM_BG = 0;
        let APALANCAMIENTO_BG = 0;
        let ACREEDORES_DIVERSOS_BG = 0;
        let OTROS_PAS_CIR_NO_OPERAT_BG = 0;
        let TOTAL_PASIVO_CIRCULANTE_BG = 0;
        let BANCOS_CORTO_PLAZO_BG = 0;
        let OTROS_PASIVOS_BG = 0;
        let LP_BANCOS_BG = 0;
        let LP_OTROS_BANCOS_BG = 0;
        let BANCOS_LARGO_PLAZO_BG = 0;
        let OTROS_BANCOS_LP_BG = 0;
        let OTROS_PASIVOS_FINANC_BG = 0;
        let PRIMAS_ANTIGUEDAD_BG = 0;
        let PASIVO_DIFEREIDO_BG = 0;
        let IMP_DIFERIDO_BG = 0;
        let TOTAL_PASIVO_LP_BG = 0;
        let TOTAL_PASIVO_BG = 0;
        let CAPITAL_SOCIAL_BG = 0;
        let APORTACIONES_FUTUROS_BG = 0;
        let IMP_DIFERIDOSC_BG = 0;
        let SUPERAVIT_ACTUALIZACION_BG = 0;
        let UTILIDADES_RETENIDAS_BG = 0;
        let UTILIDAD_DEL_EJERCICIO_BG = 0;
        let ACTUALIZACION_INVENTARIO_BG = 0;
        let TOTAL_CAP_CONTABLE_BG = 0;
        let TOTAL_PASIVO_CAP_CONT_BG = 0; 

        let PROVEEDORES_BG_POR= 0;
        let CTAS_PAG_FILIALES_OP_BG_POR = 0;
        let NETO_FILIAL_BG_POR = 0;
        let INTERESES_PAGAR_BG_POR = 0;
        let IMP_PAGAR_PTU_BG_POR = 0;
        let GASTOS_ACUM_BG_POR = 0;
        let APALANCAMIENTO_BG_POR = 0;
        let ACREEDORES_DIVERSOS_BG_POR = 0;
        let OTROS_PAS_CIR_NO_OPERAT_BG_POR = 0;
        let TOTAL_PASIVO_CIRCULANTE_BG_POR = 0;
        let BANCOS_CORTO_PLAZO_BG_POR = 0;
        let OTROS_PASIVOS_BG_POR = 0;
        let LP_BANCOS_BG_POR = 0;
        let LP_OTROS_BANCOS_BG_POR = 0;
        let BANCOS_LARGO_PLAZO_BG_POR = 0;
        let OTROS_BANCOS_LP_BG_POR = 0;
        let OTROS_PASIVOS_FINANC_BG_POR = 0;
        let PRIMAS_ANTIGUEDAD_BG_POR = 0;
        let PASIVO_DIFEREIDO_BG_POR = 0;
        let IMP_DIFERIDO_BG_POR = 0;
        let TOTAL_PASIVO_LP_BG_POR = 0;
        let TOTAL_PASIVO_BG_POR = 0;
        let CAPITAL_SOCIAL_BG_POR = 0;
        let APORTACIONES_FUTUROS_BG_POR = 0;
        let IMP_DIFERIDOSC_BG_POR = 0;
        let SUPERAVIT_ACTUALIZACION_BG_POR = 0;
        let UTILIDADES_RETENIDAS_BG_POR = 0;
        let UTILIDAD_DEL_EJERCICIO_BG_POR = 0;
        let ACTUALIZACION_INVENTARIO_BG_POR = 0;
        let TOTAL_CAP_CONTABLE_BG_POR = 0;
        let TOTAL_PASIVO_CAP_CONT_BG_POR = 0;

        PROVEEDORES_BG = PROVEEDORES_COMB;
        CTAS_PAG_FILIALES_OP_BG = CTAS_PAG_FILIALES_OP_COMB;
        INTERESES_PAGAR_BG = INTERESES_PAGAR_COMB
        IMP_PAGAR_PTU_BG = IMP_PAGAR_PTU_COMB;
        GASTOS_ACUM_BG = GASTOS_ACUM_COMB;
        APALANCAMIENTO_BG = APALANCAMIENTO_COMB;
        BANCOS_CORTO_PLAZO_BG = BANCOS_CORTO_PLAZO_COMB;
        OTROS_PASIVOS_BG = OTROS_PASIVOS_COMB;
        LP_BANCOS_BG = LP_BANCOS_COMB;
        LP_OTROS_BANCOS_BG = LP_OTROS_BANCOS_COMB;
        ACREEDORES_DIVERSOS_BG = ACREEDORES_DIVERSOS_COMB;
        OTROS_PAS_CIR_NO_OPERAT_BG = OTROS_PAS_CIR_NO_OPERAT_COMB;
        TOTAL_PASIVO_CIRCULANTE_BG = PROVEEDORES_BG + CTAS_PAG_FILIALES_OP_BG + INTERESES_PAGAR_BG + IMP_PAGAR_PTU_BG + GASTOS_ACUM_BG + APALANCAMIENTO_BG + BANCOS_CORTO_PLAZO_BG + OTROS_PASIVOS_BG + LP_BANCOS_BG + LP_OTROS_BANCOS_BG + ACREEDORES_DIVERSOS_BG + OTROS_PAS_CIR_NO_OPERAT_BG;

        BANCOS_LARGO_PLAZO_BG = BANCOS_LARGO_PLAZO_COMB;
        OTROS_BANCOS_LP_BG = OTROS_BANCOS_LP_COMB;
        OTROS_PASIVOS_FINANC_BG = OTROS_PASIVOS_FINANC_COMB;
        PRIMAS_ANTIGUEDAD_BG = PRIMAS_ANTIGUEDAD_COMB;
        PASIVO_DIFEREIDO_BG = PASIVO_DIFEREIDO_COMB;
        IMP_DIFERIDO_BG = IMP_DIFERIDOS_COMB;
        TOTAL_PASIVO_LP_BG = BANCOS_LARGO_PLAZO_BG + OTROS_BANCOS_LP_BG + OTROS_PASIVOS_FINANC_BG + PRIMAS_ANTIGUEDAD_BG + PASIVO_DIFEREIDO_BG + IMP_DIFERIDO_BG;
        TOTAL_PASIVO_BG = TOTAL_PASIVO_CIRCULANTE_BG + TOTAL_PASIVO_LP_BG;

        CAPITAL_SOCIAL_BG = CAPITAL_SOCIAL_COMB;
        APORTACIONES_FUTUROS_BG = APORTACIONES_FUTUROS_COMB;
        IMP_DIFERIDOSC_BG = IMP_DIFERIDOSC_COMB;
        SUPERAVIT_ACTUALIZACION_BG = SUPERAVIT_DEFICIT_ACT_COMB - (SUPERAVIT_ACTUALIZACION_ANTERIOR);
        UTILIDADES_RETENIDAS_BG = UTILIDADES_RETENIDAS_ANTERIOR + UTILIDADES_EJERCICIO_ANTERIOR;
        UTILIDAD_DEL_EJERCICIO_BG = UTILIDAD_NETA_ER;
        ACTUALIZACION_INVENTARIO_BG = INSUFICIENCIA_INVENTARIO_COMB;
        TOTAL_CAP_CONTABLE_BG = CAPITAL_SOCIAL_BG + APORTACIONES_FUTUROS_BG + IMP_DIFERIDOSC_BG + SUPERAVIT_ACTUALIZACION_BG + UTILIDADES_RETENIDAS_BG + UTILIDAD_DEL_EJERCICIO_BG + ACTUALIZACION_INVENTARIO_BG;

        TOTAL_PASIVO_CAP_CONT_BG = TOTAL_PASIVO_BG + TOTAL_CAP_CONTABLE_BG;

        if(TOTAL_ACTIVO_BG - TOTAL_PASIVO_CAP_CONT_BG == 0){
            COMPROBACION_BG = "OK";
        } else {
            COMPROBACION_BG = TOTAL_ACTIVO_BG - TOTAL_PASIVO_CAP_CONT_BG;
        }

        if(TOTAL_PASIVO_CAP_CONT_BG == 0){

        } else {
            PROVEEDORES_BG_POR = Math.round((PROVEEDORES_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            CTAS_PAG_FILIALES_OP_BG_POR = Math.round((CTAS_PAG_FILIALES_OP_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            INTERESES_PAGAR_BG_POR = Math.round((INTERESES_PAGAR_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            IMP_PAGAR_PTU_BG_POR = Math.round((IMP_PAGAR_PTU_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            GASTOS_ACUM_BG_POR = Math.round((GASTOS_ACUM_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            APALANCAMIENTO_BG_POR = Math.round((APALANCAMIENTO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            BANCOS_CORTO_PLAZO_BG_POR = Math.round((BANCOS_CORTO_PLAZO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            OTROS_PAS_CIR_NO_OPERAT_BG_POR = Math.round((OTROS_PAS_CIR_NO_OPERAT_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            LP_BANCOS_BG_POR = Math.round((LP_BANCOS_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            LP_OTROS_BANCOS_BG_POR = Math.round((LP_OTROS_BANCOS_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            ACREEDORES_DIVERSOS_BG_POR = Math.round((ACREEDORES_DIVERSOS_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            OTROS_PASIVOS_BG_POR = Math.round((OTROS_PASIVOS_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            TOTAL_PASIVO_CIRCULANTE_BG_POR = Math.round((TOTAL_PASIVO_CIRCULANTE_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            BANCOS_LARGO_PLAZO_BG_POR = Math.round((BANCOS_LARGO_PLAZO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            OTROS_BANCOS_LP_BG_POR = Math.round((OTROS_BANCOS_LP_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            OTROS_PASIVOS_FINANC_BG_POR = Math.round((OTROS_PASIVOS_FINANC_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            PRIMAS_ANTIGUEDAD_BG_POR = Math.round((PRIMAS_ANTIGUEDAD_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            PASIVO_DIFEREIDO_BG_POR = Math.round((PASIVO_DIFEREIDO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            IMP_DIFERIDO_BG_POR = Math.round((IMP_DIFERIDO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            TOTAL_PASIVO_LP_BG_POR = Math.round((TOTAL_PASIVO_LP_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            TOTAL_PASIVO_BG_POR = Math.round((TOTAL_PASIVO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            CAPITAL_SOCIAL_BG_POR = Math.round((CAPITAL_SOCIAL_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            APORTACIONES_FUTUROS_BG_POR = Math.round((APORTACIONES_FUTUROS_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            IMP_DIFERIDOSC_BG_POR = Math.round((IMP_DIFERIDOSC_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            SUPERAVIT_ACTUALIZACION_BG_POR = Math.round((SUPERAVIT_ACTUALIZACION_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            UTILIDADES_RETENIDAS_BG_POR = Math.round((UTILIDADES_RETENIDAS_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            UTILIDAD_DEL_EJERCICIO_BG_POR = Math.round((UTILIDAD_DEL_EJERCICIO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            ACTUALIZACION_INVENTARIO_BG_POR = Math.round((ACTUALIZACION_INVENTARIO_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            TOTAL_CAP_CONTABLE_BG_POR = Math.round((TOTAL_CAP_CONTABLE_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
            TOTAL_PASIVO_CAP_CONT_BG_POR = Math.round((TOTAL_PASIVO_CAP_CONT_BG / TOTAL_PASIVO_CAP_CONT_BG) * 100);
        }

        // VARIABLES PARA EL ESTADO DE FLUJO EFECTIVO
        let UTILIDAD_OPERACION_FLUJO, DEPRECIACION_AMORTIZACION_FLUJO, CARGOS_MONETARIOS_FLUJO, FLUJO_BRUTO, VARIACION_CLIENTES_FLUJO, VARIACION_INVENTARIOS_FLUJO, VARIACION_CXC_AFILIADAS_FLUJO, VARIACION_ACTIVOS_CIRCULANTES_FLUJO, VARIACION_PROVEEDORES_FLUJO, VARIACION_CXP_AFILIADAS_FLUJO, VARIACION_OTROS_ACTIVOS_CIRC_FLUJO, TOTAL_OPERACION, FLUJO_OPERACION, IMP_PAGADOS_PTU, FLUJO_DESPUES_IMP, GASTOS_FINANCIEROS_PAG, UTILIDAD_CAMBIARIA, PRODUCTOS_FINANCIEROS_FLUJO, TOTAL_FINANCIEROS, FLUJO_NETO, OTROS_GASTOS_FLUJO, VARIACION_NETA, INVERSION_SUB_FLUJO, DIVIDIENDO_SUB_FLUJO, OTROS_ACTIVOS_FLUJO, VARIACION_OTROS_ACTIVOS1, VARIACION_OTROS_ACTIVOSF, VARIACION_OTROS_ACTIVOS2, VARIACION_OTROS_PASIVOS_FLUJO, PAGO_PRIMA, VARIACION_PASIVO_DIFERIDO, TOTAL_INVERSION_NETA, FLUJO_NECESARIO, VARIACION_PORCION, VARIACION_DEUDA_CP, VARIACION_DEUDA_LP, VARIACION_ACREEDORES, VARIACION_DEUDORES, RECONOCIMIENTO_DERECHOS, RECONOCIMIENTO_OBLIGACIONES, TOTAL_FUENTES, AUMENTO_DISMINUCION, CAMBIO_CAJA_FLUJO, VARIACION_OTROS_PASIVOS_NO_OPERAT_FLUJO = 0;
        let TOTAL_ACTIVO_BGA, CARGOS_NO_MONETARIOS, PRIMAS_ANTIGUEDAD_CON, PRIMAS_ANTIGUEDAD_BGA, ACTIVOS_DIFERIDOS_CON, ACTIVOS_DIFERIDOS_BGA, ACTUALIZACION_RESULTADOS_CON, ACTUALIZACION_EN_RESULTADOS_CON, REVALUACION_CAPITAL, PERDIDA_POSICION_MON_CON, REVALUACION_INVENTARIOS, REVALUACION_SUB, REVALUACION_ACTIVO, IMP_DIFERIDOS, REVALUACION_DE_CAPITAL, CAPITAL_CONTABLE_CON, CAPITAL_CONTABLE_INICIAL, RECONOCIMIENTO_OBLIGACIONES_CON, RECONOCIMIENTO_DERECHOS_CON, UTILIDAD_EJERCICIO_CON, TOTAL_CAP_CONTABLE_BGA, CLIENTES_BGA, INVERSION_NETA_CON, CTAS_COBRAR_FILIALES_OP_BGA, PAGOS_ANTICIPADOS_BGA, RESERVA_CUENTAS_INCOBRABLES_BGA, PROVEEDORES_BGA, CTAS_PAG_FILIALES_OP_BGA, GASTOS_ACUM_BGA, APALANCAMIENTO_BGA, IMP_PAGAR_PTU_BGA, INTERESES_PAGAR_BGA, PERDIDAD_CAMBIARA_REALIZADA_CON, PERDIDA_CAMBIARA_EJERCICIO, INVERSION_NETA_ACTIVO_CON, VENTA_ACTIVO_FIJO, INVERSION_EFECTIVO_SUB, DIVIDIENDO_EFECTIVO_DEDUCCIONES, OTROS_ACTIVOS_BGA, IVA_IMP_PAG_ANTI_BGA, OTROS_PAS_CIR_NO_OPERAT_BGA, PASIVO_DIFEREIDO_BGA, LP_BANCOS_BGA, LP_OTROS_BANCOS_BGA, BANCOS_CORTO_PLAZO_BGA, OTROS_PASIVOS_BGA, PERDIDA_CAMBIARA_NO_REALIZADA, BANCOS_LARGO_PLAZO_BGA, OTROS_BANCOS_LP_BGA, OTROS_PASIVOS_FINANC_BGA, PERDIDA_CAMBIARA_NO_REALIZADA_LP, ACREEDORES_DIVERSOS_BGA, DEUDORES_DIVERSOS_BGA, CAJA_BGA = 0;

        ACTIVOS_DIFERIDOS_BGA = 1627;
        TOTAL_CAP_CONTABLE_BGA = 1065;
        TOTAL_ACTIVO_BGA = 32147
        RECONOCIMIENTO_DERECHOS_CON = 1111;
        UTILIDAD_EJERCICIO_CON = UTILIDAD_DEL_EJERCICIO_BG;
        CLIENTES_BGA = 9176;
        INVERSION_NETA_CON = -852;
        PAGOS_ANTICIPADOS_BGA = 291;
        RESERVA_CUENTAS_INCOBRABLES_BGA = -136;
        PROVEEDORES_BGA = 10433;
        APALANCAMIENTO_BGA = 1122;
        IMP_PAGAR_PTU_BGA = 4198;
        INVERSION_NETA_ACTIVO_CON = 135;
        IVA_IMP_PAG_ANTI_BGA = 3876;
        BANCOS_LARGO_PLAZO_BGA = 12209;
        ACREEDORES_DIVERSOS_BGA = 3120;
        DEUDORES_DIVERSOS_BGA = 61;
        RECONOCIMIENTO_DERECHOS_CON = 1111;
        CAJA_BGA = 411;

        if(PRIMAS_ANTIGUEDAD_BG > PRIMAS_ANTIGUEDAD_BGA! && TOTAL_ACTIVO_BG != 0){
            PRIMAS_ANTIGUEDAD_CON = PRIMAS_ANTIGUEDAD_BG - PRIMAS_ANTIGUEDAD_BGA!;
        }

        if(ACTIVOS_DIFERIDOS_BGA > ACTIVOS_DIFERIDOS_BG && TOTAL_ACTIVO_BG != 0){
            ACTIVOS_DIFERIDOS_CON = ACTIVOS_DIFERIDOS_BGA - ACTIVOS_DIFERIDOS_BG;
        }

        if(TOTAL_CAP_CONTABLE_BG != 0){
            CAPITAL_CONTABLE_CON = TOTAL_CAP_CONTABLE_BG;
            CAPITAL_CONTABLE_INICIAL = TOTAL_CAP_CONTABLE_BGA;
        }

        REVALUACION_DE_CAPITAL = CAPITAL_CONTABLE_CON! - CAPITAL_CONTABLE_INICIAL! - RECONOCIMIENTO_OBLIGACIONES_CON! + RECONOCIMIENTO_DERECHOS_CON - UTILIDAD_EJERCICIO_CON;
        REVALUACION_CAPITAL = REVALUACION_DE_CAPITAL;

        ACTUALIZACION_EN_RESULTADOS_CON = REVALUACION_CAPITAL - PERDIDA_POSICION_MON_CON! - REVALUACION_INVENTARIOS! - REVALUACION_SUB! - REVALUACION_ACTIVO! - IMP_DIFERIDOS!;
        ACTUALIZACION_RESULTADOS_CON = ACTUALIZACION_EN_RESULTADOS_CON;

        CARGOS_NO_MONETARIOS = ACTUALIZACION_RESULTADOS_CON - ACTIVOS_DIFERIDOS_CON!;

        if(PERDIDA_CAMBIARA_ER != 0){
            PERDIDA_CAMBIARA_EJERCICIO = PERDIDA_CAMBIARA_ER;
        }

        PERDIDAD_CAMBIARA_REALIZADA_CON = PERDIDA_CAMBIARA_EJERCICIO

        if(TOTAL_ACTIVO_BGA != 0 && TOTAL_ACTIVO_BG != 0){
            UTILIDAD_OPERACION_FLUJO = UTILIDAD_OPERACION_ER;
            DEPRECIACION_AMORTIZACION_FLUJO = DEPRECIACION_AMORTIZACION_ER;
            CARGOS_MONETARIOS_FLUJO = CARGOS_NO_MONETARIOS;
            VARIACION_CLIENTES_FLUJO =  (- (CLIENTES_BG - CLIENTES_BGA) + 0);
            VARIACION_INVENTARIOS_FLUJO =  (- (INVERSION_NETA_CON)) + 0;
            VARIACION_CXC_AFILIADAS_FLUJO = (CTAS_COBRAR_FILIALES_OP_BGA! + PAGOS_ANTICIPADOS_BGA) - (CTAS_COBRAR_FILIALES_OP_BG + PAGOS_ANTICIPADOS_BG);
            VARIACION_OTROS_ACTIVOS_CIRC_FLUJO = -(RESERVA_CUENTAS_INCOBRABLES_BG - RESERVA_CUENTAS_INCOBRABLES_BGA);
            VARIACION_PROVEEDORES_FLUJO = PROVEEDORES_BG - PROVEEDORES_BGA - 0;
            VARIACION_CXP_AFILIADAS_FLUJO = (CTAS_PAG_FILIALES_OP_BG + GASTOS_ACUM_BG) - (CTAS_COBRAR_FILIALES_OP_BGA! + GASTOS_ACUM_BGA);
            VARIACION_OTROS_PASIVOS_FLUJO = APALANCAMIENTO_BG - APALANCAMIENTO_BGA;
            IMP_PAGADOS_PTU = - ((IMP_SOBRE_RENTA_ER + PTU_ER + IMP_ACTIVO_ER) - (IMP_PAGAR_PTU_BG - IMP_PAGAR_PTU_BGA));
            GASTOS_FINANCIEROS_PAG = - (GASTOS_FINANCIEROS_ER - (INTERESES_PAGAR_BG - INTERESES_PAGAR_BGA!));
            UTILIDAD_CAMBIARIA = - (PERDIDAD_CAMBIARA_REALIZADA_CON!);
            PRODUCTOS_FINANCIEROS_FLUJO = - (PRODUCTOS_FINANCIEROS_ER);
            TOTAL_FINANCIEROS = GASTOS_FINANCIEROS_PAG + UTILIDAD_CAMBIARIA + PRODUCTOS_FINANCIEROS_FLUJO;
            OTROS_GASTOS_FLUJO = - (OTROS_GASTOS_ER + PERDIDA_EXT_ER);
            VARIACION_NETA = -INVERSION_NETA_ACTIVO_CON + VENTA_ACTIVO_FIJO!;
            OTROS_ACTIVOS_FLUJO = - (OTROS_ACTIVOS_BG - OTROS_ACTIVOS_BGA!);
            VARIACION_OTROS_ACTIVOS1 = - (IVA_IMP_PAG_ANTI_BG) + (IVA_IMP_PAG_ANTI_BGA);
            if(ACTIVOS_DIFERIDOS_BG > ACTIVOS_DIFERIDOS_BGA) {
                VARIACION_OTROS_ACTIVOS2 = ACTIVOS_DIFERIDOS_BG - ACTIVOS_DIFERIDOS_BGA;
            }
            VARIACION_OTROS_ACTIVOSF = VARIACION_OTROS_ACTIVOS1 - VARIACION_OTROS_ACTIVOS2!;
            VARIACION_OTROS_PASIVOS_NO_OPERAT_FLUJO = OTROS_PAS_CIR_NO_OPERAT_BG - OTROS_PAS_CIR_NO_OPERAT_BGA!;
            VARIACION_PASIVO_DIFERIDO = PASIVO_DIFEREIDO_BG - PASIVO_DIFEREIDO_BGA!;
            VARIACION_PORCION = - (LP_BANCOS_BGA! + LP_OTROS_BANCOS_BGA);
            VARIACION_DEUDA_CP = (BANCOS_CORTO_PLAZO_BG + OTROS_PASIVOS_BG) - (BANCOS_CORTO_PLAZO_BGA! + OTROS_PASIVOS_BGA) - PERDIDA_CAMBIARA_NO_REALIZADA!;
            VARIACION_DEUDA_LP = (BANCOS_LARGO_PLAZO_BG + OTROS_BANCOS_LP_BG + OTROS_PASIVOS_FINANC_BG) - (BANCOS_CORTO_PLAZO_BGA! + OTROS_BANCOS_LP_BGA! + OTROS_PASIVOS_FINANC_BGA) + LP_OTROS_BANCOS_BG + LP_OTROS_BANCOS_BG - PERDIDA_CAMBIARA_NO_REALIZADA_LP!; 
            VARIACION_ACREEDORES = ACREEDORES_DIVERSOS_BG - ACREEDORES_DIVERSOS_BGA;
            VARIACION_DEUDORES  = - (DEUDORES_DIVERSOS_BG - DEUDORES_DIVERSOS_BGA);
            RECONOCIMIENTO_DERECHOS = - RECONOCIMIENTO_DERECHOS_CON;
            RECONOCIMIENTO_OBLIGACIONES = RECONOCIMIENTO_OBLIGACIONES_CON;
        }

        if(PRIMAS_ANTIGUEDAD_BG < PRIMAS_ANTIGUEDAD_BGA! && TOTAL_ACTIVO_BG){
            PAGO_PRIMA = PRIMAS_ANTIGUEDAD_BG - PRIMAS_ANTIGUEDAD_BGA!;
        }

        if(TOTAL_ACTIVO_BG != 0){
            INVERSION_SUB_FLUJO = - INVERSION_EFECTIVO_SUB!;
            DIVIDIENDO_SUB_FLUJO = DIVIDIENDO_EFECTIVO_DEDUCCIONES;
        }

        FLUJO_BRUTO = UTILIDAD_OPERACION_FLUJO! + DEPRECIACION_AMORTIZACION_FLUJO! - CARGOS_MONETARIOS_FLUJO!;
        TOTAL_OPERACION = VARIACION_CLIENTES_FLUJO! + VARIACION_INVENTARIOS_FLUJO! + VARIACION_CXC_AFILIADAS_FLUJO! + VARIACION_OTROS_PASIVOS_FLUJO! + VARIACION_PROVEEDORES_FLUJO! + VARIACION_CXP_AFILIADAS_FLUJO! + VARIACION_OTROS_PASIVOS_FLUJO!;
        FLUJO_OPERACION = FLUJO_BRUTO - TOTAL_OPERACION;
        FLUJO_DESPUES_IMP = FLUJO_OPERACION + IMP_PAGADOS_PTU!;
        FLUJO_NETO = FLUJO_DESPUES_IMP + TOTAL_FINANCIEROS!;
        TOTAL_INVERSION_NETA = OTROS_GASTOS_FLUJO + VARIACION_NETA + INVERSION_SUB_FLUJO + DIVIDIENDO_SUB_FLUJO + OTROS_ACTIVOS_FLUJO + VARIACION_OTROS_ACTIVOSF + VARIACION_OTROS_PASIVOS_NO_OPERAT_FLUJO + PAGO_PRIMA + VARIACION_PASIVO_DIFERIDO;
        FLUJO_NECESARIO = FLUJO_NETO + TOTAL_INVERSION_NETA;
        TOTAL_FUENTES = VARIACION_PORCION! + VARIACION_DEUDA_CP! + VARIACION_DEUDA_LP! + VARIACION_ACREEDORES! + VARIACION_DEUDORES! + RECONOCIMIENTO_DERECHOS! + RECONOCIMIENTO_OBLIGACIONES!;
        AUMENTO_DISMINUCION = FLUJO_NECESARIO + TOTAL_FUENTES;

        if(TOTAL_ACTIVO_BGA != 0 && TOTAL_ACTIVO_BG != 0) {
            CAMBIO_CAJA_FLUJO = AUMENTO_DISMINUCION! - (CAJA_BG - CAJA_BGA);
        }

        let combinadoF;

        combinadoF = {
            ventasNetasMASP: VENTAS_TOTALES_MASP,
            ventasNetasPST: VENTAS_TOTALES_PST,
            ventasNetasElim: VENTAS_TOTALES_ELIM,
            ventasNetasComb: VENTAS_TOTALES_COMB,
            costoVentasMASP: COSTOS_VENTAS_MASP,
            costoVentasPST: COSTOS_VENTAS_PST,
            costoVentasElimD: COSTOS_VENTAS_ELIM_D,
            costoVentansElimC: COSTOS_VENTAS_ELIM_C,
            costoVentasComb: COSTOS_VENTAS_COMB,
            utilidadBrutaMASP: UTILIDAD_BRUTA_MASP,
            utilidadBrutaPST: UTILIDAD_BRUTA_PST,
            utilidadBrutaComb: UTILIDAD_BRUTA_COMB,
            gastosAdmonVtaMASP: GASTOS_ADMON_VTA_MASP,
            gastosAdmonVtaPST: GASTOS_ADMON_VTA_PST,
            gastosAdmonVTAElimD: GASTOS_ADMON_VTA_ELIM_D,
            gastosAdmonVTAElimC: GASTOS_ADMON_VTA_ELIM_C,
            gastosAdmonVtaComb: GASTOS_ADMON_VTA_COMB,
            agregarPorMesD: AGREGAR_POR_MESD,
            agregarPorMesC: AGREGAR_POR_MESC,
            depreYAmortMASP: DEPRECIACION_AMORTIZACION_MASP,
            depreYAmortPST: DEPRECIACION_AMORTIZACION_PST,
            depreYAmortComb: DEPRECIACION_AMORTIZACION_COMB,
            utilidadOperacionMASP: UTILIDAD_OPERACIONAL_MASP,
            utilidadOperacionPST: UTILIDAD_OPERACIONAL_PST,
            utilidadOperacionComb: UTILIDAD_OPERACIONAL_COMB,
            gastosFinancMASP: GASTOS_FINANCIEROS_MASP,
            gastosFinancPST: GASTOS_FINANCIEROS_PST,
            gastosFinancComb: GASTOS_FINANCIEROS_COMB,
            prodFinancMASP: PRODUCTOS_FINANCIEROS_MASP,
            prodFinancPST: PRODUCTOS_FINANCIEROS_PST,
            prodFinancComb: PRODUCTOS_FINANCIEROS_COMB,
            perdPosMonMASP: PERDIDA_POSICION_MON_MASP,
            perdPosMonPST: PERDIDA_POSICION_MON_PST,
            perdPosMonComb: PERDIDA_POSICION_MON_COMB,
            perdidaCambMASP: PERDIDA_CAMBIARA_MASP,
            perdidaCambPST: PERDIDA_CAMBIARA_PST,
            perdidaCambComb: PERDIDA_CAMBIARA_COMB,
            costoIntFinancMASP: COSTO_INTEGRAL_FINANCIERO_MASP,
            costoIntFinancPST: COSTO_INTEGRAL_FINANCIERO_PST,
            costoIntFinancComb: COSTO_INTEGRAL_FINANCIERO_COMB,
            otrosGastosMASP: OTROS_GASTOS_MASP,
            otrosGastosPST: OTROS_GASTOS_PST,
            otrosGastosComb: OTROS_GASTOS_COMB,
            utAntIsrYPtuMASP: UT_ANTES_ISR_PTU_MASP,
            utAntIsrYPtuPST: UT_ANTES_ISR_PTU_PST,
            utAntIsrYPtuComb: UT_ANTES_ISR_PTU_COMB,
            impSobreRentaMASP: IMP_SOBRE_RENTA_MASP,
            impSobreRentaPST: IMP_SOBRE_RENTA_PST,
            impSobreRentaComb: IMP_SOBRE_RENTA_COMB,
            impDiferidoMASP: IMP_DIFERIDO_MASP,
            impDiferidoPST: IMP_DIFERIDO_PST,
            impDiferidoComb: IMP_DIFERIDO_COMB,
            ptuMASP: PTU_MASP,
            ptuPST: PTU_PST,
            ptuComb: PTU_COMB,
            impActivoMASP: IMP_ACTIVO_MASP,
            impActivoPST: IMP_ACTIVO_PST,
            impActivoComb: IMP_ACTIVO_COMB,
            utAntesPartExtMASP: UT_ANTES_PART_EXTAORD_MASP,
            utAntesPartExtPST: UT_ANTES_PART_EXTAORD_PST,
            utAntesPartExtComb: UT_ANTES_PART_EXTAORD_COMB,
            perdExtMASP: PERIDIDA_EXT_MASP,
            perdExtPST: PERIDIDA_EXT_PST,
            perdExtComb: PERIDIDA_EXT_COMB,
            perdSubMASP: PERDIDA_SUBSIDIARIAS_MASP,
            perdSubPST: PERDIDA_SUBSIDIARIAS_PST,
            perdSubComb: PERDIDA_SUBSIDIARIAS_COMB,
            utNetaMASP: UTILIDAD_NETA_MASP,
            utNetaPST: UTILIDAD_NETA_PST,
            utNetaComb: UTILIDAD_NETA_COMB,
            cajaMASP: CAJA_MASP,
            cajaPST: CAJA_PST,
            cajaComb: CAJA_COMB,
            clientesMASP: CLIENTES_MASP,
            clientesPST: CLIENTES_PST,
            clientesComb: CLIENTES_COMB,
            ctasCobrarFilOPMASP: CTAS_COBRAR_FILIALESOP_MASP,
            ctasCobrarFilOPPST: CTAS_COBRAR_FILIALESOP_PST,
            ctasCobrarFilOPElim: CTAS_COBRAR_FILIALESOP_ELIM,
            ctasCobrarFilOPComb: CTAS_COBRAR_FILIALESOP_COMB,
            inventariosMASP: INVENTARIO_MASP,
            inventariosPST: INVENTARIOS_PST,
            inventariosComb: INVENTARIOS_COMB,
            pagosAnticipadosMASP: PAGOS_ANTICIPADOS_MASP,
            pagosAnticipadosPST: PAGOS_ANTICIPADOS_PST,
            pagosAnticipadosComb: PAGOS_ANTICIPADOS_COMB,
            provCuentasIncoMASP: PROV_CUENTAS_INCOBRABLES_MASP,
            provCuentasIncoPST: PROV_CUENTAS_INCOBRABLES_PST,
            provCuentasIncoComb: PROV_CUENTAS_INCOBRABLES_COMB,
            deudoresDivMASP: DEUDORES_DIVERSOS_MASP,
            deudoresDivPST: DEUDORES_DIVERSOS_PST,
            deudoresDivComb: DEUDORES_DIVERSOS_COMB,
            ivaImpPagAntiMASP: IVA_IMP_PAG_ANTI_MASP,
            ivaImpPagAntiPST: IVA_IMP_PAG_ANTI_PST,
            ivaImpPagAntiComb: IVA_IMP_PAG_ANTI_COMB,
            totalActCircMASP: TOTAL_ACTIVO_CIRCULANTE_MASP,
            totalActCircPST: TOTAL_ACTIVO_CIRCULANTE_PST,
            totalActCircComb: TOTAL_ACTIVO_CIRCULANTE_COMB,
            terrenoYEdifMASP: TERRENOS_Y_EDIFICIOS_MASP,
            terrenoYEdifPST: TERRENOS_Y_EDIFICIOS_PST,
            terrenoYEdifComb: TERRENOS_Y_EDIFICIOS_COMB,
            maqYEqMASP: MAQUINARIA_Y_EQUIPO_MASP,
            maqYEqPST: MAQUINARIA_Y_EQUIPO_PST,
            maqYEqComb: MAQUINARIA_Y_EQUIPO_COMB,
            eqTransMASP: EQUIPO_TRANSPORTE_MASP,
            eqTransPST: EQUIPO_TRANSPORTE_PST,
            eqTransComb: EQUIPO_TRANSPORTE_COMB,
            actActFijoMASP: ACTUALIZACION_ACTIVO_FIJO_MASP,
            actActFijoPST: ACTUALIZACION_ACTIVO_FIJO_PST,
            actActFijoComb: ACTUALIZACION_ACTIVO_FIJO_COMB,
            depAcumMASP: DEPRECIACION_ACUMULADA_MASP,
            depAcumPST: DEPRECIACION_ACUMULADA_PST,
            depAcumComb: DEPRECIACION_ACUMULADA_COMB,
            actFijosMASP: ACTIVOS_FIJOS_MASP,
            actFijosPST: ACTIVOS_FIJOS_PST,
            actFijosComb: ACTIVOS_FIJOS_COMB,
            invSubMASP: INVERSION_SUBSIDIARIAS_MASP,
            invSubPST: INVERSION_SUBSIDIARIAS_PST,
            invSubComb: INVERSION_SUBSIDIARIAS_COMB,
            actDifMASP: ACTIVOS_DIFERIDOS_MASP,
            actDifPST: ACTIVOS_DIFERIDOS_PST,
            actDifComb: ACTIVOS_DIFERIDOS_COMB,
            otrActiMASP: OTROS_ACTIVOS_MASP,
            otrActiPST: OTROS_ACTIVOS_PST,
            otrActiComb: OTROS_ACTIVOS_COMB,
            totalActMASP: TOTAL_ACTIVO_MASP,
            totalActPST: TOTAL_ACTIVO_PST,
            totalActComb: TOTAL_ACTIVO_COMB,
            proveedoresMASP: PROVEEDORES_MASP,
            proveedoresPST: PROVEEDORES_PST,
            proveedoresComb: PROVEEDORES_COMB,
            ctasPagarFilOPMASP: CTAS_PAG_FILIALES_OP_MASP,
            ctasPagarFilOPPST: CTAS_PAG_FILIALES_OP_PST,
            ctasPagarFilOPElim: CTAS_PAG_FILIALES_OP_ELIM,
            ctasPagarFilOPComb: CTAS_PAG_FILIALES_OP_COMB,
            netoFilial: NETO_FILIAL,
            intPorPagarMASP: INTERESES_PAGAR_MASP,
            intPorPagarPST: INTERESES_PAGAR_PST,
            intPorPagarComb: INTERESES_PAGAR_COMB,
            impPagarPtuMASP: IMP_PAGAR_PTU_MASP,
            impPagarPtuPST: IMP_PAGAR_PTU_PST,
            impPagarPtuComb: IMP_PAGAR_PTU_COMB,
            gastAcumMASP: GASTOS_ACUM_MASP,
            gastAcumPST: GASTOS_ACUM_PST,
            gastAcumComb: GASTOS_ACUM_COMB,
            apalancamientoMASP: APALANCAMIENTO_MASP,
            apalancamientoPST: APALANCAMIENTO_PST,
            apalancamientoElimD: APALANCAMIENTO_ELIMD,
            apalancamientoElimC: APALANCAMIENTO_ELIMC,
            apalancamientoComb: APALANCAMIENTO_COMB,
            bancosCorPlMASP: BANCOS_CORTO_PLAZO_MASP,
            bancosCorPlPST: BANCOS_CORTO_PLAZO_PST,
            bancosCorPlComb: BANCOS_CORTO_PLAZO_COMB,
            otrosPasFinMASP: OTROS_PASIVOS_FINANC_MASP,
            otrosPasFinPST: OTROS_PASIVOS_FINANC_PST,
            otrosPasFinComb: OTROS_PASIVOS_FINANC_COMB,
            lpBancosMASP: LP_BANCOS_MASP,
            lpBancosPST: LP_BANCOS_PST,
            lpBancosComb: LP_BANCOS_COMB,
            lpOtrosBancosMASP: LP_OTROS_BANCOS_MASP,
            lpOtrosBancosPST: LP_OTROS_BANCOS_PST,
            lpOtrosBancosComb: LP_OTROS_BANCOS_COMB,
            acreeDiversosMASP: ACREEDORES_DIVERSOS_MASP,
            acreeDiversosPST: ACREEDORES_DIVERSOS_PST,
            acreeDiversosComb: ACREEDORES_DIVERSOS_COMB,
            otrosPasCirNoOperatMASP: OTROS_PAS_CIR_NO_OPERAT_MASP,
            otrosPasCirNoOperatPST: OTROS_PAS_CIR_NO_OPERAT_PST,
            otrosPasCirNoOperatComb: OTROS_PAS_CIR_NO_OPERAT_COMB,
            totalPasCirMASP: TOTAL_PASIVO_CIRCULANTE_MASP,
            totalPasCirPST: TOTAL_PASIVO_CIRCULANTE_PST,
            totalPasCirComb: TOTAL_PASIVO_CIRCULANTE_COMB,
            bancosLargPlazoMASP: BANCOS_LARGO_PLAZO_MASP,
            bancosLargPlazoPST: BANCOS_LARGO_PLAZO_PST,
            bancosLargPlazoComb: BANCOS_LARGO_PLAZO_COMB,
            otrosBancosLPMASP: OTROS_BANCOS_LP_MASP,
            otrosBancosLPPST: OTROS_BANCOS_LP_PST,
            otrosBancosLPComb: OTROS_BANCOS_LP_COMB,
            otrosPasFinancMASP: OTROS_PASIVOS_FINANC_MASP,
            otrosPasFinancPST: OTROS_PASIVOS_FINANC_PST,
            otrosPasFinancComb: OTROS_PASIVOS_FINANC_COMB,
            primasAntiMASP: PRIMAS_ANTIGUEDAD_MASP,
            primasAntiPST: PRIMAS_ANTIGUEDAD_PST,
            primasAntiComb: PRIMAS_ANTIGUEDAD_COMB,
            pasivoDiferidoMASP: PASIVO_DIFEREIDO_MASP,
            pasivoDiferidoPST: PASIVO_DIFEREIDO_PST,
            pasivoDiferidoComb: PASIVO_DIFEREIDO_COMB,
            impDiferidosMASP: IMP_DIFERIDOS_MASP,
            impDiferidosPST: IMP_DIFERIDOS_PST,
            impDiferidosComb: IMP_DIFERIDOS_COMB,
            totalPasivoLPMASP: TOTAL_PASIVO_LP_MASP,
            totalPasivoLPPST: TOTAL_PASIVO_LP_PST,
            totalPasivoLPComb: TOTAL_PASIVO_LP_COMB,
            totalPasivoMASP: TOTAL_PASIVO_MASP,
            totalPasivoPST: TOTAL_PASIVO_PST,
            totalPasivoComb: TOTAL_PASIVO_COMB,
            capitalSocialMASP: CAPITAL_SOCIAL_MASP,
            capitalSocialPST: CAPITAL_SOCIAL_PST,
            capitalSocialComb: CAPITAL_SOCIAL_COMB,
            aportFuturasMASP: APORTACIONES_FUTUROS_MASP,
            aportFuturasPST: APORTACIONES_FUTUROS_PST,
            aportFuturasComb: APORTACIONES_FUTUROS_COMB,
            impDiferidosCMASP: IMP_DIFERIDOSC_MASP,
            impDiferidosCPST: IMP_DIFERIDOSC_PST,
            impDiferidosCComb: IMP_DIFERIDOSC_COMB,
            superavitActuMASP: SUPERAVIT_DEFICIT_ACT_MASPF,
            superavitActuPST: SUPERAVIT_DEFICIT_ACT_PSTF,
            superavitActuElimD: SUPERAVIT_DEFICIT_ACT_ELIM_DF,
            superavitActuElimC: SUPERAVIT_DEFICIT_ACT_ELIM_CF,
            superavitActuComb: SUPERAVIT_DEFICIT_ACT_COMB,
            utlRetenidasMASP: UTILIDADES_RETENIDAS_MASP,
            utlRetenidasPST: UTILIDADES_RETENIDAS_PST,
            utlRetenidasComb: UTILIDADES_RETENIDAS_COMB,
            utlEjercicioMASP: UTILIDAD_DEL_EJERCICIO_MASP,
            utlEjercicioPST: UTILIDAD_DEL_EJERCICIO_PST,
            utlEjercicioComb: UTILIDAD_DEL_EJERCICIO_COMB,
            actInventarioMASP: INSUFICIENCIA_INVENTARIO_MASP,
            actInventarioPST: INSUFICIENCIA_INVENTARIO_PST,
            actInventarioComb: INSUFICIENCIA_INVENTARIO_COMB,
            totalCapContMASP: TOTAL_CAP_CONTABLE_MASP,
            totalCapContPST: TOTAL_CAP_CONTABLE_PST,
            totalCapContComb: TOTAL_CAP_CONTABLE_COMB,
            totalPasCapContMASP: TOTAL_PASIVO_CAP_CONT_MASP,
            totalPasCapContPST: TOTAL_PASIVO_CAP_CONT_PST,
            totalPasCapContComb: TOTAL_PASIVO_CAP_CONT_COMB,
        }

        let bgF;

        bgF = {
            cajaBG: CAJA_BG,
            cajaBGPOR: CAJA_BG_POR,
            clientesBG: CLIENTES_BG,
            clientesBGPOR: CLIENTES_BG_POR,
            ctasCobrarFilOPBG: CTAS_COBRAR_FILIALES_OP_BG,
            ctasCobrarFilOPBGPOR: CTAS_COBRAR_FILIALES_OP_BG_POR,
            inventariosBG: INVENTARIOS_BG,
            inventariosBGPOR: INVENTARIOS_BG_POR,
            pagosAnticipadosBG: PAGOS_ANTICIPADOS_BG,
            pagosAnticipadosBGPOR: PAGOS_ANTICIPADOS_BG_POR,
            reservaCuentasIncoBG: RESERVA_CUENTAS_INCOBRABLES_BG,
            reservaCuentasIncoBGPOR: RESERVA_CUENTAS_INCOBRABLES_BG_POR,
            deudoresDiversosBG: DEUDORES_DIVERSOS_BG,
            deudoresDiversosBGPOR: DEUDORES_DIVERSOS_BG_POR,
            ivaImpPagAntiBG: IVA_IMP_PAG_ANTI_BG,
            ivaImpPagAntiBGPOR: IVA_IMP_PAG_ANTI_BG_POR,
            totalActivoCircBG: TOTAL_ACTIVO_CIRCULANTE_BG,
            totalActivoCircBGPOR: TOTAL_ACTIVO_CIRCULANTE_BG_POR,
            terrenoYEdifBG: TERRENO_EDIFICIOS_BG,
            terrenoYEdifBGPOR: TERRENO_EDIFICIOS_BG_POR,
            maqYEqBG: MAQUINARIA_EQUIPO_BG,
            maqYEqBGPOR: MAQUINARIA_EQUIPO_BG_POR,
            eqTransBG: EQUIPO_TRANSPORTE_BG,
            eqTransBGPOR: EQUIPO_TRANSPORTE_BG_POR,
            actActFijoBG: ACTUALIZACION_ACTIVO_FIJO_BG,
            actActFijoBGPOR: ACTUALIZACION_ACTIVO_FIJO_BG_POR,
            depAcumBG: DEPRECIACION_ACUMULADA_BG,
            depAcumBGPOR: DEPRECIACION_ACUMULADA_BG_POR,
            actFijosBG: ACTIVOS_FIJOS_BG,
            actFijosBGPOR: ACTIVOS_FIJOS_BG_POR,
            invSubBG: INVERSION_SUB_BG,
            invSubBGPOR: INVERSION_SUB_BG_POR,
            actDifBG: ACTIVOS_DIFERIDOS_BG,
            actDifBGPOR: ACTIVOS_DIFERIDOS_BG_POR,
            otrActiBG: OTROS_ACTIVOS_BG,
            otrActiBGPOR: OTROS_ACTIVOS_BG_POR,
            totalActBG: TOTAL_ACTIVO_BG,
            totalActBGPOR: TOTAL_ACTIVO_BG_POR,
            proveedoresBG: PROVEEDORES_BG,
            proveedoresBGPOR: PROVEEDORES_BG_POR,
            ctasPagarFilOPBG: CTAS_PAG_FILIALES_OP_BG,
            ctasPagarFilOPBGPOR: CTAS_PAG_FILIALES_OP_BG_POR,
            intPorPagarBG: INTERESES_PAGAR_BG,
            intPorPagarBGPOR: INTERESES_PAGAR_BG_POR,
            impPagarPtuBG: IMP_PAGAR_PTU_BG,
            impPagarPtuBGPOR: IMP_PAGAR_PTU_BG_POR,
            gastAcumBG: GASTOS_ACUM_BG,
            gastAcumBGPOR: GASTOS_ACUM_BG_POR,
            apalancamientoBG: APALANCAMIENTO_BG,
            apalancamientoBGPOR: APALANCAMIENTO_BG_POR,
            bancosCorPlBG: BANCOS_CORTO_PLAZO_BG,
            bancosCorPlBGPOR: BANCOS_CORTO_PLAZO_BG_POR,
            otrosPasFinBG: OTROS_PASIVOS_BG,
            otrosPasFinBGPOR: OTROS_PASIVOS_BG_POR,
            lpBancosBG: LP_BANCOS_BG,
            lpBancosBGPOR: LP_BANCOS_BG_POR,
            lpOtrosBancosBG: LP_OTROS_BANCOS_BG,
            lpOtrosBancosBGPOR: LP_OTROS_BANCOS_BG_POR,
            acreeDiversosBG: ACREEDORES_DIVERSOS_BG,
            acreeDiversosBGPOR: ACREEDORES_DIVERSOS_BG_POR,
            otrosPasCirNoOperatBG: OTROS_PAS_CIR_NO_OPERAT_BG,
            otrosPasCirNoOperatBGPOR: OTROS_PAS_CIR_NO_OPERAT_BG_POR,
            totalPasCirBG: TOTAL_PASIVO_CIRCULANTE_BG,
            totalPasCirBGPOR: TOTAL_PASIVO_CIRCULANTE_BG_POR,
            bancosLargPlazoBG: BANCOS_LARGO_PLAZO_BG,
            bancosLargPlazoBGPOR: BANCOS_LARGO_PLAZO_BG_POR,
            otrosBancosLPBG: OTROS_BANCOS_LP_BG,
            otrosBancosLPBGPOR: OTROS_BANCOS_LP_BG_POR,
            otrosPasFinancBG: OTROS_PASIVOS_FINANC_BG,
            otrosPasFinancBGPOR: OTROS_PASIVOS_FINANC_BG_POR,
            primasAntiBG: PRIMAS_ANTIGUEDAD_BG,
            primasAntiBGPOR: PRIMAS_ANTIGUEDAD_BG_POR,
            pasivoDiferidoBG: PASIVO_DIFEREIDO_BG,
            pasivoDiferidoBGPOR: PASIVO_DIFEREIDO_BG_POR,
            impDiferidosBG: IMP_DIFERIDO_BG,
            impDiferidosBGPOR: IMP_DIFERIDO_BG_POR,
            totalPasivoLPBG: TOTAL_PASIVO_LP_BG,
            totalPasivoLPBGPOR: TOTAL_PASIVO_LP_BG_POR,
            totalPasivoBG: TOTAL_PASIVO_BG,
            totalPasivoBGPOR: TOTAL_PASIVO_BG_POR,
            capitalSocialBG: CAPITAL_SOCIAL_BG,
            capitalSocialBGPOR: CAPITAL_SOCIAL_BG_POR,
            aportFuturasBG: APORTACIONES_FUTUROS_BG,
            aportFuturasBGPOR: APORTACIONES_FUTUROS_BG_POR,
            impDiferidosCBG: IMP_DIFERIDOSC_BG,
            impDiferidosCBGPOR: IMP_DIFERIDOSC_BG_POR,
            superavitActuBG: SUPERAVIT_ACTUALIZACION_BG,
            superavitActuBGPOR: SUPERAVIT_ACTUALIZACION_BG_POR,
            utlRetenidasBG: UTILIDADES_RETENIDAS_BG,
            utlRetenidasBGPOR: UTILIDADES_RETENIDAS_BG_POR,
            utlEjercicioBG: UTILIDAD_DEL_EJERCICIO_BG,
            utlEjercicioBGPOR: UTILIDAD_DEL_EJERCICIO_BG_POR,
            actInventarioBG: ACTUALIZACION_INVENTARIO_BG,
            actInventarioBGPOR: ACTUALIZACION_INVENTARIO_BG_POR,
            totalCapContBG: TOTAL_CAP_CONTABLE_BG,
            totalCapContBGPOR: TOTAL_CAP_CONTABLE_BG_POR,
            totalPasCapContBG: TOTAL_PASIVO_CAP_CONT_BG,
            totalPasCapContBGPOR: TOTAL_PASIVO_CAP_CONT_BG_POR
        }

        let erF;

        erF = {
            ventasMon: VENTAS_MON_NAC_ER,
            ventasMonPor: VENTAS_MON_NAC_ER_POR,
            ventasDLS: VENTAS_DLS_ER,
            ventasDLSPor: VENTAS_DLS_ER_POR,
            ventasNetasTotales: VENTAS_NETAS_TOTALES_ER,
            ventasNetasTotalesPor: VENTAS_NETAS_TOTALES_ER_POR,
            costoVentas: COSTO_VENTAS_ER,
            costoVentasPor: COSTO_VENTAS_ER_POR,
            utilidadBruta: UTILIDAD_BRUTA_ER,
            utilidadBrutaPor: UTILIDAD_BRUTA_ER_POR,
            gastosAdmonVTA: GASTOS_ADMON_VTA_ER,
            gastosAdmonVTAPor: GASTOS_ADMON_VTA_ER_POR,
            depreYAmort: DEPRECIACION_AMORTIZACION_ER,
            depreYAmortPor: DEPRECIACION_AMORTIZACION_ER_POR,
            utilidadOperacion: UTILIDAD_OPERACION_ER,
            utilidadOperacionPor: UTILIDAD_OPERACION_ER_POR,
            gastosFinanc: GASTOS_FINANCIEROS_ER,
            gastosFinancPor: GASTOS_FINANCIEROS_ER_POR,
            prodFinanc: PRODUCTOS_FINANCIEROS_ER,
            prodFinancPor: PRODUCTOS_FINANCIEROS_ER_POR,
            perdPosMon: PERDIDA_POSICION_MON_ER,
            perdPosMonPor: PERDIDA_POSICION_MON_ER_POR,
            perdidaCamb: PERDIDA_CAMBIARA_ER,
            perdidaCambPor: PERDIDA_CAMBIARA_ER_POR,
            costoIntFinanc: COSTO_INTEGRAL_FINANCIAM_ER,
            costoIntFinancPor: COSTO_INTEGRAL_FINANCIAM_ER_POR,
            otrosGastos: OTROS_GASTOS_ER,
            otrosGastosPor: OTROS_GASTOS_ER_POR,
            utAntIsrYPtu: UT_ANTES_ISR_PTU_ER,
            utAntIsrYPtuPor: UT_ANTES_ISR_PTU_ER_POR,
            impSobreRenta: IMP_SOBRE_RENTA_ER,
            impSobreRentaPor: IMP_SOBRE_RENTA_ER_POR,
            impDiferido: IMP_DIFERIDO_ER,
            impDiferidoPor: IMP_DIFERIDO_ER_POR,
            ptu: PTU_ER,
            ptuPor: PTU_ER_POR,
            impActivo: IMP_ACTIVO_ER,
            impActivoPor: IMP_ACTIVO_ER_POR,
            utAntesPartExt: UT_ANTES_PART_EXTAORD_ER,
            utAntesPartExtPor: UT_ANTES_PART_EXTAORD_ER_POR,
            perdExt: PERDIDA_EXT_ER,
            perdExtPor: PERDIDA_EXT_ER_POR,
            perdSub: PERDIDA_SUBSIDIARIAS_ER,
            perdSubPor: PERDIDA_SUBSIDIARIAS_ER_POR,
            utilidadNeta: UTILIDAD_NETA_ER,
            utilidadNetaPor: UTILIDAD_NETA_ER_POR
        }

        datosAgrupadosReporte(null, null, null, null, null, combinadoF, bgF, erF);

        receivedDataComb = {
            masER: false,
            pstER: false,
            elim: false,
            masBG: false,
            pstBG: false,
            dataBG: false
        }

        dataCountComb = 0;
        
    }
}

let receivedDataAgrup = {
    isApi: false,
    masERF: false,
    pstERF: false,
    masBGF: false,
    pstBGF: false,
    combinadoF: false,
    bgF: false,
    erF: false
};

let storedDataAgrup: {
    isApi: any | null,
    masERF: any | null,
    pstERF: any | null,
    masBGF: any | null,
    pstBGF: any | null,
    combinadoF: any | null,
    bgF: any | null,
    erF: any | null
} = {
    isApi: null,
    masERF: null,
    pstERF: null,
    masBGF: null,
    pstBGF: null,
    combinadoF: null,
    bgF: null,
    erF: null
};

let dataCountAgrup = 0;

export function datosAgrupadosReporte (isApi: any, masERF: any, pstERF: any, masBGF: any, pstBGF: any, combinadoF: any, bgF: any, erF: any){
    
    let dataAgrup : any;

    if (isApi) {
        receivedDataAgrup.isApi = true;
        storedDataAgrup.isApi = isApi;
        dataCountAgrup++;
    }

    if (masERF) {
        receivedDataAgrup.masERF = true;
        storedDataAgrup.masERF = masERF;
        dataCountAgrup++;
    }

    if (pstERF) {
        receivedDataAgrup.pstERF = true;
        storedDataAgrup.pstERF = pstERF;
        dataCountAgrup++;
    }

    if (masBGF) {
        receivedDataAgrup.masBGF = true;
        storedDataAgrup.masBGF = masBGF;
        dataCountAgrup++;
    }

    if (pstBGF) {
        receivedDataAgrup.pstBGF = true;
        storedDataAgrup.pstBGF = pstBGF;
        dataCountAgrup++;
    }

    if (combinadoF) {
        receivedDataAgrup.combinadoF = true;
        storedDataAgrup.combinadoF = combinadoF;
        dataCountAgrup++;
    }

    if (bgF) {
        receivedDataAgrup.bgF = true;
        storedDataAgrup.bgF = bgF;
        dataCountAgrup++;
    }

    if (erF) {
        receivedDataAgrup.erF = true;
        storedDataAgrup.erF = erF;
        dataCountAgrup++;
    }


    if (dataCountAgrup === 8) {
        dataAgrup = {
            masERF: storedDataAgrup.masERF,
            pstERF: storedDataAgrup.pstERF,
            masBGF: storedDataAgrup.masBGF,
            pstBGF: storedDataAgrup.pstBGF,
            combinadoF: storedDataAgrup.combinadoF,
            bgF: storedDataAgrup.bgF,
            erF: storedDataAgrup.erF
        };

        receivedDataAgrup = {
            isApi: false,
            masERF: false,
            pstERF: false,
            masBGF: false,
            pstBGF: false,
            combinadoF: false,
            bgF: false,
            erF: false
        }

        dataCountAgrup = 0;
    
        return dataAgrup
    }
}