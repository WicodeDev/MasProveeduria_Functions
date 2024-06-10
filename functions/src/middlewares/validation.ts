import Joi from "joi";
import asyncHandler from "@middlewares/async";
import { NextFunction, Response, Request } from "express";
import ResponseHTTP from "@utils/response";

/**
 * @function validationBody
 * @description Function to handle the validation of the body
 * @param {T} schema - Object of the schema to validate
 */
export const validationBody = <T>(schema: Joi.ObjectSchema<T>) => {
  const joiValidation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseHTTP();
    const { error } = await schema.validate(req.body, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errorMessage = details.map((err) => err.message).join(", ");
      response.setSend<null>(422, errorMessage, null);
      response.send(res);
    } else {
      next();
    }
  });
  return joiValidation;
}

/**
 * @function validationParams
 * @description Function to handle the validation of the params
 * @param {T} schema - Object of the schema to validate
 */
export const validationParams = <T>(schema: Joi.ObjectSchema<T>) => {
  const joiValidation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseHTTP();
    const { error } = await schema.validate(req.params, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errorMessage = details.map((err) => err.message).join(", ");
      response.setSend<null>(422, errorMessage, null);
      response.send(res);
    } else {
      next();
    }
  });
  return joiValidation;
}
