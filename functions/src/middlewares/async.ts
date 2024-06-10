/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextFunction, RequestHandler, Response, Request} from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * @function default
 * @description Function to handle the async request
 * @param {AsyncRequestHandler} handler - Handler of the async request
 * @return {RequestHandler} - Request handler
 */
export default (handler: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    return handler(req, res, next).catch(next);
  };
};
