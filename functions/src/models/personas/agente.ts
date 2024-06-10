import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";


/**
 * @class Agente
 * @description Agente model
 */


@Collection('agentes')
class Agente{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    codigo!: number;
    @IsNotEmpty()
    @IsString()
    nombre!: string;
    @IsOptional()
    @IsString()
    metaGlobal!: number;
}

export default Agente;