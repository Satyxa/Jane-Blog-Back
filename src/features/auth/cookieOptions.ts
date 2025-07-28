import { CookieOptions } from 'express';

export const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain: '.inctagram.fun',
  maxAge: 60 * 60 * 1000,
  path: '/',
});
