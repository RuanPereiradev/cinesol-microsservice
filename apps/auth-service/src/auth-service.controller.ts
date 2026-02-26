import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { LoginDto, RegisterDto } from 'y/common/dto/auth';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('register')
   register(@Body() dto: RegisterDto){
    return this.authServiceService.register(dto)
  }

  @Post('login')
   login(@Body() dto: LoginDto){
    return this.authServiceService.login(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: { user: { userId: string } }){
    return this.authServiceService.getProfile(req.user.userId);
  }


}
