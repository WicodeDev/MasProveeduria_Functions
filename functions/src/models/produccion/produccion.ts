import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Collection } from "fireorm";
import Ordenes from "./ordenes";

/**
 * @class Producción
 * @description Produccion model
 */


@Collection('produccion')
class Produccion{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    numProduccion!: number;
    @IsNotEmpty()
    @IsString()
    nombreCliente!: string;
    @IsNotEmpty()
    @IsString()
    fechaCreacion!: string;
    @IsNotEmpty()
    @IsArray()
    ordenes!: Ordenes[];
}

export default Produccion;