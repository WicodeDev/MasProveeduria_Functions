import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Inventario
 * @description Inventario model
 */


@Collection('inventario')
class Inventario{
    id!: string;
    @IsNotEmpty()
    @IsString()
    codigo!: string;
    @IsNotEmpty()
    @IsString()
    nombre!: string;
    @IsNotEmpty()
    @IsNumber()
    cantidad!: number;
    @IsNotEmpty()
    @IsString()
    unidad!: string;
    @IsNotEmpty()
    @IsString()
    clasificacion!: string;
    @IsOptional()
    @IsString()
    fechaLote!: string;
    @IsOptional()
    @IsNumber()
    consumo!: number;
    @IsOptional()
    @IsNumber()
    inventarioMinimo!: number;
    @IsOptional()
    @IsNumber()
    inventarioMaximo!: number;
    @IsOptional()
    @IsString()
    empresa!: string;
    @IsOptional()
    @IsString()
    proveedor!: string;
    @IsOptional()
    @IsNumber()
    codProveedor!: number;
    @IsOptional()
    @IsBoolean()
    alerta!: boolean;
}

export default Inventario;