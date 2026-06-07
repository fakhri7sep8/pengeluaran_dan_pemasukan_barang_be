import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { RegisterPayload, LoginPayload } from './auth.interface';

export class RegisterDto implements RegisterPayload {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
    message: 'Gunakan email Gmail (@gmail.com)',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginDto implements LoginPayload {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
