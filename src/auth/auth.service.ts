import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './auth.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthResponse } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    return {
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Email atau password salah');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      message: 'Login berhasil',
      access_token,
      refresh_token,
      expires_in: '1h',
      user: { id: user.id, email: user.email },
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; expires_in: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '1h' },
      );

      return { access_token: newAccessToken, expires_in: '1h' };
    } catch (err) {
      throw new BadRequestException('Refresh token tidak valid atau sudah kadaluwarsa');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return { message: 'Jika email terdaftar, kode reset akan dikirim' };

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    user.resetCode = code;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
    await this.userRepo.save(user);

    await this.mailService.sendResetCode(user.email, code);

    return { message: 'Kode reset password sudah dikirim ke email' };
  }

  async resetPassword(code: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { resetCode: code } });

    if (!user || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      throw new BadRequestException('Kode tidak valid atau sudah kadaluwarsa');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;

    await this.userRepo.save(user);

    return { message: 'Password berhasil diubah' };
  }
}
