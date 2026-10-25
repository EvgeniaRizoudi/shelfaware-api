import { Type } from 'class-transformer';
import { IsEmail, MinLength, IsString, IsNotEmpty, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';

export class DepartmentDto {
    @IsNotEmpty({message: 'validation.required'})
    @IsNumber({}, {message: "validation.invalid_selection"})
    departmentId: number;
    @IsNotEmpty({message: 'validation.required'})
    @IsNumber({}, {message: "validation.invalid_selection"})
    roleId: number;

}

export class RegisterDto {
    @IsEmail({}, {message: 'validation.email'})
    email: string;
    @MinLength( 8, {message: "validation.password.minLength"})
    password: string;
    @IsNotEmpty( {message: "validation.required"})
    @IsString()
    name: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DepartmentDto)
    departmentRoles: DepartmentDto[];
    @IsArray()
    @IsNumber({}, { each: true })
    positionIds: number[];
}