import {Response} from "express";
import { StatusCodes } from "http-status-codes";
import { validateHttpCode } from "./http";

/**
 * @class ResponseHTTP
 * @description Class to handle the response of the API
 * @param {number} status - Status code of the response
 * @param {string} message - Message of the response
 * @param {T} payload - Payload of the response
 */
export default class ResponseHTTP<T> {
  public status: number;
  public message: string;
  public payload: T | unknown;

  /**
   * @constructor
   * @description Constructor of the class
   */
  constructor() {
    this.status = StatusCodes.OK;
    this.message = "";
    this.payload = {};
  }

  /**
   * @method setStatus
   * @description Method to set the status of the response
   * @param {number} status - Status code of the response
   * @return {ResponseHTTP<T>} - Return the instance of the class
   * @memberof ResponseHTTP
   * @example
   * const response = new ResponseHTTP();
   * response.setStatus(200);
   * response.send(res);
   */
  public setStatus(status: number): ResponseHTTP<T> {
    this.status = status;
    return this;
  }

  /**
   * @method setMessage
   * @description Method to set the message of the response
   * @param {string} message - Message of the response
   * @return {ResponseHTTP<T>} - Return the instance of the class
   * @memberof ResponseHTTP
   * @example
   * const response = new ResponseHTTP();
   * response.setMessage("Success");
   * response.send(res);
   */
  public setMessage(message: string): ResponseHTTP<T> {
    this.message = message;
    return this;
  }

  /**
   * @method setPayload
   * @description Method to set the payload of the response
   * @param {T} payload - Payload of the response
   * @return {ResponseHTTP<T>} - Return the instance of the class
   * @memberof ResponseHTTP
   * @example
   * const response = new ResponseHTTP();
   * response.setPayload({name: "John Doe"});
   * response.send(res);
   */
  public setPayload(payload: T): ResponseHTTP<T> {
    this.payload = payload;
    return this;
  }

  /**
   * @method send
   * @description Method to send the response
   * @param {Response} res - Response of the API
   * @return {void}
   * @memberof ResponseHTTP
   * @example
   * const response = new ResponseHTTP();
   * response.setStatus(200);
   * response.setMessage("Success");
   * response.setPayload({name: "John Doe"});
   * response.send(res);
   */
  public send(res: Response): void {
    res.status(this.status).send({
      status: this.status,
      message: this.message,
      payload: this.payload
    });
  }

  /**
   * @method setSend
   * @description Method to send the response
   * @param {Response} res - Response of the API
   * @return {void}
   * @memberof ResponseHTTP
   * @example
   * const response = new ResponseHTTP();
   * response.setSend(res, 200, "Success", {name: "John Doe"}, null);
   * response.send(res);
   */
  public setSend<T>(
    status: number,
    message: string,
    payload: T,
  ): void {
    this.status = validateHttpCode(status) ? status : StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = message;
    this.payload = payload;
  }
}
