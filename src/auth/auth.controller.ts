import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDTO } from 'src/users/user.interface';
import { UnauthorizedResponseDto, UserLoginDto } from './auth.interface';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiTags('Пользователь')
  @ApiOperation({ summary: 'Аутентифицировать пользователя по логин/паролю' })
  @ApiBody({ type: UserLoginDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  @ApiCreatedResponse({ type: UserResponseDTO })
  async login(@Request() req) {
    return req.user;
  }
}
