import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Ventas Agrupadas
 * @description Ventas Agrupadas model
 */


@Collection('ventasAgrupadas')
class VentasAgrupadas {
    id!: string;
    @IsNotEmpty()
    @IsString()
    factura!: string;
    @IsNotEmpty()
    @IsObject()
    productos!: object;
    @IsNotEmpty()
    @IsNumber()
    total!: string;
    @IsNotEmpty()
    @IsString()
    agente!: string;
    @IsNotEmpty()
    @IsString()
    cliente!: string;
    @IsNotEmpty()
    @IsString()
    empresa!: string;
    @IsOptional()
    @IsString()
    fecha!: string;
}

export default VentasAgrupadas;