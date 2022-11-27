import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from 'src/infra/config/environment-config/environment-config.service';
import { UsecasesProxyModule } from 'src/infra/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infra/usecases-proxy/usecases-proxy';
import { LoggerService } from 'src/infra/logger/logger.service';
import { ExceptionsService } from 'src/infra/exceptions/exceptions.service';
import { TokenPayload } from 'src/domain/model/auth';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    const user = this.loginUsecaseProxy.getInstance().getUserIfRefreshTokenMatches(refreshToken, payload.username);
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      this.exceptionService.UnauthorizedException({ message: 'User not found or hash not correct' });
    }
    return user;
  }
}