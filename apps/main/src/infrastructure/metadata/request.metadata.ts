import { IncomingHttpHeaders } from 'node:http';
import type { Request } from 'express';
import { decode } from 'jsonwebtoken';

export class RequestMetadata {
  jwtPayload;
  method: string;
  path: string;
  headers: IncomingHttpHeaders;
  body;
  params;

  constructor(req: Request) {
    this.jwtPayload = decode(req.header('authorization')?.substring(7) ?? '');
    this.method = req.method;
    this.path = req.url;
    this.headers = req.headers;
    this.body = req.body;
    this.params = req.params;
  }
}
