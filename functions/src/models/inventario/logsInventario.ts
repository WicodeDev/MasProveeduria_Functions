import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";


/**
 * @class Logs inventario
 * @description Logs inventario model
 */


@Collection('logsInventario')
class LogsInventario{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    cantidadAnterior!: number;
    @IsNotEmpty()
    @IsNumber()
    cantidadNueva!: number;
    @IsNotEmpty()
    @IsNumber()
    cantidadMovimiento!: number;
    @IsNotEmpty()
    @IsString()
    fecha!: string;
    @IsNotEmpty()
    @IsString()
    movimiento!: string;
    @IsOptional()
    @IsString()
    nombre!: string;
    @IsNotEmpty()
    @IsString()
    tipo!: string;
    @IsNotEmpty()
    @IsString()
    usuario!: string;
}

export default LogsInventario;