import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @class Ordenes de produccióm
 * @description Ordenes de producción model
 */


class Ordenes{
    @IsOptional()
    @IsNumber()
    rollos!: number;
    @IsOptional()
    @IsNumber()
    metrosEntrada!: number;
    @IsOptional()
    @IsString()
    materialPrincipal!: string;
    @IsOptional()
    @IsString()
    fechaEntrega!: string;
    @IsNotEmpty()
    @IsString()
    refuerzo!: string;
    @IsNotEmpty()
    @IsString()
    adhesivo!: string;
    @IsNotEmpty()
    @IsString()
    tipo!: string;
    @IsNotEmpty()
    @IsString()
    estatus!: string;
    @IsOptional()
    @IsString()
    horaInicio!: string;
    @IsOptional()
    @IsString()
    horaTermino!: string;
    @IsNotEmpty()
    @IsString()
    uuid!: string;
}

export default Ordenes;