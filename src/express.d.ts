import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    cookies: Record<string, string>;
  }

  export interface Response {
    cookie(name: string, val: string, options?: any): this;
  }
}
