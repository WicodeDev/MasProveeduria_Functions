import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Historia Reporte
 * @description Historia Reporte model
 */


@Collection('historialReporte')
class HistorialReporte{
    id!: string;
    @IsNotEmpty()
    @IsString()
    reporteMASP!: string;
    @IsNotEmpty()
    @IsString()
    reportePST!: string;
    @IsNotEmpty()
    @IsString()
    fecha!: string;
    @IsNotEmpty()
    @IsObject()
    eliminaciones!: object;
    @IsNotEmpty()
    @IsObject()
    etiquetas!: object;
    @IsNotEmpty()
    @IsObject()
    balanzaGeneral!: object;
}

export default HistorialReporte;