import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from './auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Login sukses',
      user: result.user,
    };
  }

  @Post('refresh')
  refresh(@Body('refresh_token') refresh_token: string) {
    return this.authService.refresh(refresh_token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(code, newPassword);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Logout sukses',
    };
  }
}
