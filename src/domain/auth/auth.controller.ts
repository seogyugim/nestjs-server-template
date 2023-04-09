import {
  ApiController,
  CurrentUser,
  CurrentUserType,
} from '../../common/decorators/index.js';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  GoogleLoginResponseDto,
  LoginResponseDto,
  SignUpDto,
  SignupResponseDto,
  TokenRefreshDto,
} from './auth.zod.js';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard.js';

@ApiController('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    req.session.destroy();
    return 'ok';
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: SignupResponseDto,
  })
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Get('google/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    type: LoginResponseDto,
  })
  googleRedirect(@CurrentUser() user: any) {
    return this.authService.googleLogin(user);
  }

  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    type: GoogleLoginResponseDto,
  })
  googleLogin() {
    return 'ok';
  }

  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  refreshToken(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: TokenRefreshDto,
  ) {
    return this.authService.refresh(dto.refreshToken, user.username);
  }
}
