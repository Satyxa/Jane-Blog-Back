import { CookieOptions } from 'express';

export const cookieOptions = (domain: string): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain,
  maxAge: 60 * 60 * 1000,
  path: '/',
});
