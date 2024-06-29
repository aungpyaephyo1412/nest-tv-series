import { DocumentBuilder } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const _createJwt = (payload: object) => {
  return jwt.sign(payload, process.env['TOKEN_SECRET'] as string, {
    expiresIn: '30 days',
  });
};
export const _passwordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
export const _isMatchPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const _isEmptyObj = (obj: object) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const _swaggerConfig = new DocumentBuilder()
  .setTitle('Nest Test')
  .setDescription('')
  .setVersion('1.0')
  .addTag('nest-test')
  .build();

export const _concatStr = (
  strings: (number | string)[],
  divider?: string,
): string => strings.join(divider ?? ' ');
