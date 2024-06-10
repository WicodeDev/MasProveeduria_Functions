import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Proveedor
 * @description Proveedor model
 */


@Collection('proveedores')
class Proveedor{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    codigo!: number;
    @IsNotEmpty()
    @IsString()
    nombre!: string;
    @IsOptional()
    @IsString()
    direccion!: string;
    @IsOptional()
    @IsString()
    rfc!: string;
    @IsOptional()
    @IsString()
    pais!: string;
    @IsOptional()
    @IsString()
    email!: string;
    @IsOptional()
    @IsNumber()
    entrega!: number;
}

export default Proveedor;