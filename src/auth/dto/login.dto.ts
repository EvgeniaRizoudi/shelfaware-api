import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, {message: 'validation.email'})
    @IsNotEmpty( {message: "validation.required"})
    email: string; 
    @IsNotEmpty( {message: "validation.required"})
    @IsString({ message: 'validation.required' })
    password: string;
}