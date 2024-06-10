import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Seguimiento pedidos
 * @description Seguimiento pedidos model
 */


@Collection('segPedido')
class SegPedido{
    id!: string;
    @IsNotEmpty()
    @IsNumber()
    nPedido!: number;
    @IsNotEmpty()
    @IsString()
    estatus!: string;
    @IsOptional()
    @IsString()
    estatusOrden!: string;  
    @IsNotEmpty()
    @IsString()
    proveedor!: string;
    @IsOptional()
    @IsString()
    codigo!: string;
    @IsNotEmpty()
    @IsString()
    descripcion!: string;
    @IsNotEmpty()
    @IsString()
    clasificacion!: string;
    @IsNotEmpty()
    @IsString()
    unidad!: string;
    @IsNotEmpty()
    @IsNumber()
    cantitad!: number;
    @IsNotEmpty()
    @IsNumber()
    costoUnitario!: number;
    @IsOptional()
    @IsNumber()
    cantidadEntregada!: number;
    @IsOptional()
    @IsString()
    documento!: string;
    @IsOptional()
    @IsString()
    fechaSolicitud!: string;
    @IsOptional()
    @IsString()
    fechaEntrega!: string;
    @IsNotEmpty()
    @IsNumber()
    saldo!: number;
    @IsOptional()
    @IsString()
    factura!: string;
    @IsOptional()
    @IsString()
    folioControl!: string;
    @IsOptional()
    @IsString()
    validation!: string;
}
export default SegPedido;