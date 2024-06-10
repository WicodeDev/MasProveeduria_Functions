

/**
 * @class Cliente
 * @description Cliente model
 */

import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";


@Collection('clientes')
class Cliente{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    codigo!: number;
    @IsNotEmpty()
    @IsString()
    nombre!: string;
    @IsOptional()
    @IsNumber()
    codAgente!: number | null;
    @IsOptional()
    @IsNumber()
    meta!: number | null;
    @IsOptional()
    @IsString()
    etiqueta!: string;
}

export default Cliente;