import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Facturas
 * @description Facturas model
 */


@Collection('facturas')
class Facturas{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    idFactura!: number;
    @IsNotEmpty()
    @IsString()
    uniqueId!: string;
    @IsNotEmpty()
    @IsString()
    cuenta!: string;
    @IsNotEmpty()
    @IsString()
    poliza!: string;
    @IsNotEmpty()
    @IsString()
    tipo!: string;
    @IsNotEmpty()
    @IsNumber()
    monto!: number;
    @IsOptional()
    @IsString()
    descripcion!: string;
    @IsNotEmpty()
    @IsString()
    fecha!: string;
    @IsNotEmpty()
    @IsString()
    empresa!: string;
    @IsOptional()
    @IsString()
    referencia!: string;
    @IsNotEmpty()
    @IsObject()
    etiqueta!: object;
}

export default Facturas;