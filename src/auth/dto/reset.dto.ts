import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetDto {
  @IsNotEmpty({ message: 'validation.required' })
  @IsString()
  token: string;

  @MinLength(8, { message: 'validation.password.minLength' })
  password: string;
}
