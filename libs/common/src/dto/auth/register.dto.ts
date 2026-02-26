import{ IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => value?.trim().toLowerCase()) // Limpa o dado antes de validar
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' }) 
    name: string;
}

