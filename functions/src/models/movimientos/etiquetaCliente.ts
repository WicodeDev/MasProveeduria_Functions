import { IsNotEmpty, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Etiqueta Cliente
 * @description Etiqueta Cliente model
 */


@Collection('etiquetaClientes')
class EtiquetaCliente{
    id!: string;
    @IsNotEmpty()
    @IsString()
    nombre!: string;
    @IsNotEmpty()
    @IsString()
    color!: string;
}

export default EtiquetaCliente;