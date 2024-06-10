import ErrorResponse from "@utils/errorResponse";
import { validateHttpCode } from "@utils/http";
import ResponseHttp from "@utils/response";
import { Request, Response } from "express";
import { logger } from "firebase-functions/v2";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err: ErrorResponse, req: Request, res: Response) => {

  const response = new ResponseHttp();
  const { code, message } = err;

  logger.error(message);

  let newCode = 0;

  if (code) {
    newCode = validateHttpCode(code) ? code : StatusCodes.INTERNAL_SERVER_ERROR;
  } else {
    newCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  response.setSend<null>(
    newCode,
    message, 
    null
  );

  response.send(res);

};
