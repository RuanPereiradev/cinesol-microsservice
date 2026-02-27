import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateAditoriumDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    rowsCount: number;

    @IsInt()
    @Min(1)
    seatsPerRow: number;
}