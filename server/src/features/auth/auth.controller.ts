import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { getRandomInt } from '../../util';
import { DtoTransformerService } from '../../util/dto-transformer.service';
import { ErrorResponseService } from '../../util/error-response.service';
import { PasswordService } from '../../util/password.service';
import { userDtoSchema } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  ForgotPasswordDto,
  forgotPasswordDtoSchema,
} from './dto/forgot-password.dto';
import { LoginAuthSchema, LoginDto } from './dto/login.dto';
import { CreateAuthSchema, RegisterDto } from './dto/register.dto';
import {
  ResetPasswordDto,
  resetPasswordDtoSchema,
} from './dto/reset-password.dto';
import { VerifyAuthDto, verifyAuthDtoSchema } from './dto/verify-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
    private readonly dtoTransformer: DtoTransformerService,
    private readonly errorResponse: ErrorResponseService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(CreateAuthSchema)) createAuthDto: RegisterDto,
  ) {
    try {
      const hashPassword = await this.passwordService.hash(
        createAuthDto.password,
      );
      const rememberToken = getRandomInt(1000, 9999).toString();

      const user = await this.authService.create({
        ...createAuthDto,
        rememberToken,
        password: hashPassword,
      });

      const authDto = this.dtoTransformer.transform(userDtoSchema, user);
      await this.mailService.sendVerificationEmail(
        [authDto.email],
        rememberToken,
      );

      return {
        data: authDto,
        message: 'Register successful, Check your email',
      };
    } catch (error) {
      this.errorResponse.handle(error);
    }
  }

  @Public()
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginAuthSchema)) loginAuthDto: LoginDto,
  ) {
    const user = await this.authService.findByEmailOrUsername(
      loginAuthDto.identifier,
    );
    const isPasswordValid = await this.passwordService.validate(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    const authDto = this.dtoTransformer.transform(userDtoSchema, user);
    const jwt = await this.jwtService.signAsync(authDto);

    return { jwt, data: authDto };
  }

  @Put('verify')
  async verify(
    @Body(new ZodValidationPipe(verifyAuthDtoSchema))
    verifyAuthDto: VerifyAuthDto,
  ) {
    const user = await this.authService.findByEmailOrUsername(
      verifyAuthDto.email,
    );
    if (user.isVerified)
      throw new BadRequestException({ message: 'Already verified' });
    if (user.rememberToken !== verifyAuthDto.token)
      throw new BadRequestException({ message: 'Invalid token!' });

    await this.authService.update({
      where: { email: user.email },
      data: { isVerified: true, rememberToken: null },
    });

    return { message: 'Email verified successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordDtoSchema))
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    const user = await this.authService.findByEmailOrUsername(
      forgotPasswordDto.identifier,
    );
    const resetToken = crypto.randomUUID().toString();
    await this.authService.update({
      where: { email: user.email },
      data: {
        resetToken,
        resetTokenExpired: new Date(Date.now() + 60 * 60 * 10),
      },
    });

    await this.mailService.sendPasswordResetEmail([user.email], resetToken);

    return { message: 'Reset password link sent successfully' };
  }

  @Post('reset-password')
  async resetPasswordConfirm(
    @Body(new ZodValidationPipe(resetPasswordDtoSchema))
    resetPasswordDto: ResetPasswordDto,
  ) {
    const user = await this.authService.find({
      AND: [
        { resetToken: { equals: resetPasswordDto.resetToken } },
        { resetTokenExpired: { gt: new Date() } },
      ],
    });
    const hashPassword = await this.passwordService.hash(
      resetPasswordDto.password,
    );

    await this.authService.update({
      where: { email: user.email },
      data: {
        password: hashPassword,
        resetToken: null,
        resetTokenExpired: null,
      },
    });

    return { message: 'Password reset successfully' };
  }
}
