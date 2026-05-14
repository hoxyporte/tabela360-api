import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Bu e-posta adresi zaten kayıtlı');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role || 'USER',
      },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.password) throw new UnauthorizedException('Geçersiz kimlik bilgileri');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Geçersiz kimlik bilgileri');

    return this.generateToken(user);
  }

  async googleLogin(googleUser: { email: string; name: string; googleId: string }) {
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
          role: 'USER',
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId },
      });
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}