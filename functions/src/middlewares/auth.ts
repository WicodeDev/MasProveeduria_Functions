import asyncHandler from "@middlewares/async";
import ErrorResponse from "@utils/errorResponse";
import {Request, Response, NextFunction} from "express";
import { StatusCodes } from "http-status-codes";
import jwt, {JwtPayload} from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    id: string
}

/**
 * @function auth
 * @description Function to handle the auth middleware
 * @param {Request} req - Request of the API
 * @param {Response} res - Response of the API
 * @param {NextFunction} next - Next function of the API
 * @return {Promise<void>} - Promise<void>
 */
export const auth = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new ErrorResponse("No se encontro token", StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_PASSWORD!);
  } catch (err) {
    throw new ErrorResponse("Token invalido", StatusCodes.UNAUTHORIZED);
  }

  if (!decodedToken) {
    throw new ErrorResponse("Token invalido", StatusCodes.UNAUTHORIZED);
  }

  const {id} = decodedToken as TokenPayload;

  req.user = {id};

  next();
});
