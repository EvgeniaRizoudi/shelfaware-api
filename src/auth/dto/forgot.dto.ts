import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotDto {
  @IsEmail({}, { message: 'validation.email' })
  @IsNotEmpty({ message: 'validation.required' })
  email: string;
}
