import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Collection } from "fireorm";

/**
 * @class Ordenes de compra
 * @description Ordenes de compra model
 */


@Collection('ordenesCompra')
class OrdenCompra{
    id!: string;
    @IsNotEmpty()
    @IsString()
    factura!: string;
    @IsOptional()
    @IsString()
    lote!: string;
    @IsNotEmpty()
    @IsString()
    producto!: string;
    @IsNotEmpty()
    @IsString()
    codProducto!: string;
    @IsNotEmpty()
    @IsNumber()
    cantidad!: number;
    @IsNotEmpty()
    @IsNumber()
    precioProd!: number;
    @IsNotEmpty()
    @IsNumber()
    subtotal!: number;
    @IsNotEmpty()
    @IsString()
    proveedor!: string;
    @IsNotEmpty()
    @IsNumber()
    codProveedor!: number;
    @IsOptional()
    @IsString()
    fechaAlta!: string;
    @IsOptional()
    @IsString()
    autorizacion!: string;
}

export default OrdenCompra;