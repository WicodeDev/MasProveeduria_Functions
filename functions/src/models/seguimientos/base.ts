import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Base
 * @description Base model
 */


@Collection('base')
class Base{
    id!: string;
    @IsNotEmpty()
    @IsString()
    folio!: string;
    @IsNotEmpty()
    @IsNumber()
    rollos!: number;
    @IsNotEmpty()
    @IsNumber()
    cantS!: number;
    @IsNotEmpty()
    @IsNumber()
    cantPR!: number;
    @IsNotEmpty()
    @IsString()
    unidad!: string;
    @IsNotEmpty()
    @IsString()
    proveedor!: string;
    @IsNotEmpty()
    @IsString()
    codigo!: string;
    @IsNotEmpty()
    @IsString()
    meterial!: string;
    @IsNotEmpty()
    @IsString()
    clasificacion!: string;
    @IsOptional()
    @IsString()
    fechaRecepcion!: string;
    @IsOptional()
    @IsString()
    validacionEntrada!: string;
}

export default Base;