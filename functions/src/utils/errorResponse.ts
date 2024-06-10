/**
 * ErrorResponse
 * @description Class to handle the error response
 * @class ErrorResponse
 * @extends {Error}
 * @param {string} message - Message of the error
 * @param {number} code - Code of the error
 */
export default class ErrorResponse extends Error {
  public code: number;

  /**
   * @constructor
   * @description Constructor of the class
   * @param {string} message - Message of the error
   * @param {number} code - Code of the error
   */
  constructor(
    message: string,
    code: number
  ) {
    super(message);
    this.code = code;
  }
}
