import { IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Venta
 * @description Venta model
 */


@Collection('ventas')
class Venta {
    id!: string;
    @IsOptional()
    @IsString()
    factura!: string;
    @IsOptional()
    @IsString()
    producto!: string;
    @IsOptional()
    @IsString()
    codProducto!: string;
    @IsOptional()
    @IsNumber()
    cantidad!: number;
    @IsOptional()
    @IsNumber()
    precioProd!: number;
    @IsOptional()
    @IsNumber()
    subtotal!: number;
    @IsOptional()
    @IsNumber()
    total!: number;
    @IsOptional()
    @IsString()
    agente!: string;
    @IsOptional()
    @IsString()
    cliente!: string;
    @IsOptional()
    @IsString()
    empresa!: string;
    @IsOptional()
    @IsString()
    estatus!: string;
    @IsOptional()
    @IsString()
    fechAlta!: string;
    @IsOptional()
    @IsString()
    fechPago!: string;
}

export default Venta;