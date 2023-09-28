import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth/local-auth.guard';
import { User } from '../../users/entities/user.entity';
import { AuthDto } from '../dto/auth.dto';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request & { user: User }): Promise<AuthDto> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('create-account')
  async createAccount(@Body() body: CreateAccountDto): Promise<AuthDto> {
    return this.authService.createAccount(body);
  }
}
