import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { _isMatchPassword, _passwordHash } from '../../util';
import _errorResponse from '../../util/error.response';
import { transformToDto } from '../../util/transformToDto';
import { requestValidator } from '../middlewares/validator.middleware';
import { AuthService } from './auth.service';
import { Public } from './decorators/isPublic.decorator';
import { AuthDtoSchema } from './dto/auth.dto';
import { CreateAuthDto, CreateAuthSchema } from './dto/create-auth.dto';
import { LoginAuthDto, LoginAuthSchema } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('/register')
  @UsePipes(new requestValidator(CreateAuthSchema))
  async register(@Body() createAuthDto: CreateAuthDto) {
    try {
      const hashPassword = await _passwordHash(createAuthDto.password);
      const user = await this.authService.create({
        ...createAuthDto,
        password: hashPassword,
      });
      const authDto = transformToDto(AuthDtoSchema, user);
      return { data: authDto };
    } catch (error) {
      _errorResponse(error);
    }
  }

  @Public()
  @Post('/login')
  @UsePipes(new requestValidator(LoginAuthSchema))
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const user = await this.authService.findByEmailOrUsername(
      loginAuthDto.identifier,
    );

    if (!user) throw new NotFoundException({ message: 'User not found' });

    const isPasswordValid = await _isMatchPassword(
      loginAuthDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    const authDto = transformToDto(AuthDtoSchema, user);
    const jwt = await this.jwtService.signAsync(authDto);
    return { jwt, data: authDto };
  }
}
