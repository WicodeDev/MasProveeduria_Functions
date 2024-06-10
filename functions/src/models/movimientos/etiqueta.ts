import { IsNotEmpty, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Etiqueta
 * @description Etiqueta model
 */


@Collection('etiqueta')
class Etiqueta{
    id!: string;
    @IsNotEmpty()
    @IsString()
    nombre!: string;
    @IsNotEmpty()
    @IsString()
    color!: string;
}

export default Etiqueta;