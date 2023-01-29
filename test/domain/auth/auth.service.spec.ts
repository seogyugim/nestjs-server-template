import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/domain/auth/auth.controller.js';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../../src/domain/users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../../../src/domain/auth/auth.service.js';
import { BasicAuthStrategy } from '../../../src/domain/auth/basic-auth.strategy.js';
import { JwtAuthStrategy } from '../../../src/domain/auth/jwt-auth.strategy.js';
import { expect } from 'chai';
import { commonConfig } from '../../../src/config/index.js';
import { dbConfig } from '../../../src/config/db.config.js';
import { NODE_ENV } from '../../../src/constants/index.js';
import { UsersService } from '../../../src/domain/users/users.service.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

describe('AuthService', function () {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        UsersModule,
        ConfigModule.forRoot({
          load: [commonConfig, dbConfig],
          envFilePath: [
            `${dirname(
              fileURLToPath(import.meta.url),
            )}/../../../src/config/env/.${NODE_ENV}.env`,
          ],
          isGlobal: true,
          cache: true,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.getOrThrow('JWT_EXPIRE_TIME'),
            },
          }),
        }),
      ],
      providers: [AuthService, BasicAuthStrategy, JwtAuthStrategy],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('유저 검사 (BasicAuth) 유저이름이 다른 경우', async () => {
    try {
      await service.validateUser('hello', '1234');
    } catch (e: any) {
      expect(e.message).eq(`INVALID USERNAME, username=hello`);
    }
  });

  it('유저검사 (BasicAuth) 비밀번호가 다른 경우', async () => {
    const dto = { username: 'hello', password: '1234' };
    await usersService.create(dto);
    try {
      await service.validateUser(dto.username, '1235');
    } catch (e: any) {
      expect(e.message).eq('PASSWORD DOES NOT MATCHED');
    }
  });

  it('유저검사 (BasicAuth) 통과 케이스', async () => {
    const dto = { username: 'hello', password: '1234' };
    await usersService.create(dto);
    const userEntity = await service.validateUser(dto.username, dto.password);
    expect(userEntity.username).eq(dto.username);
  });
});
