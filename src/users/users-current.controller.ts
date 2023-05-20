import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UsersService } from './users.service';
import { ForbiddenResponseDto, UserLoginDto } from 'src/auth/auth.interface';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserResponse,
  UserResponseDTO,
  UserUpdateRequestDTO
} from './user.interface';
import { OperationTags } from 'src/utils/swagger';

@ApiTags(OperationTags.User)
@Controller('api/users/current')
export class UsersCurrentController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Зарегистрировать нового пользователя' })
  @ApiCreatedResponse({ type: UserResponseDTO })
  async createUser(@Body() newUser: UserLoginDto, @Req() req) {
    const { password, ...user } = await this.usersService.createUser(newUser);
    await new Promise<void>((resolve, reject) => {
      req.login({ ...user, password }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiForbiddenResponse({ type: ForbiddenResponseDto })
  @ApiOkResponse({ type: UserResponseDTO })
  async getCurrentUser(@Req() req) {
    const userId = req.user._id;
    const { password, ...user } = await this.usersService.getUserById(userId);
    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Put()
  @ApiOperation({
    summary: 'Обновить настройки текущего пользователя',
    description:
      'Метод позволяет обновить от одной до нескольких настроек пользователя за раз.\n\nМетод вернёт информацию о пользователе с обновлённыии данными.',
  })
  @ApiOkResponse({ type: UserResponseDTO })
  async updateCurrentUser(
    @Body() user: UserUpdateRequestDTO,
    @Req() req,
  ): Promise<UserResponse> {
    const userId = req.user._id;
    const newUserData = {
      ...(await this.usersService.getUserById(userId)),
      ...user,
    };
    const { password, ...newUser } = await this.usersService.updateUser(
      userId,
      newUserData,
    );
    req.logIn(newUser, () => null);
    return newUser;
  }
}
