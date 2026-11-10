import { MinLength, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @MinLength(8, { message: 'validation.password.minLength' })
  @IsOptional()
  password?: string;
  @IsNotEmpty({ message: 'validation.required' })
  @IsString()
  @IsOptional()
  name?: string;
}
