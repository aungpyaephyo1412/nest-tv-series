import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { _concatStr } from '../util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly _logger: Logger;
  constructor() {
    this._logger = new Logger();
  }
  use(req: Request, res: Response, next: NextFunction) {
    this._logger.log(_concatStr([req.method, req.originalUrl]));
    next();
  }
}
