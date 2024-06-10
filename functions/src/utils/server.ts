import {errorHandler} from "@middlewares/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {Application} from "express";
import {logger} from "firebase-functions/v2";
import morgan from "morgan";
import {StatusCodes} from "http-status-codes";

import ErrorResponse from "./errorResponse";
import { initialize, firestore } from "@config/firebase.config";

/**
 * @class Server
 * @description Class to handle the server
 */
export class Server {
  public app: Application;

  /**
   * @constructor
   * @description Constructor of the class
   * @param {express.Router} router - Router of the API
   */
  constructor(router: express.Router) {
    this.app = express();
    this.config();
    this.routes(router);
  }

  /**
   * @method start
   * @description Method to start the server configuration
   * @memberof Server
   */
  private config(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors(
      {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }
    ));

    morgan.token("body", (req: express.Request) => {
      logger.info(`[${req.method}] ${req.url} ${req.statusCode}`);
      return JSON.stringify(req.body);
    });

    this.app.use(morgan("dev"));

    // initializa orm connection
    initialize(firestore);
  }

  /**
   * @method routes
   * @description Method to set the routes of the API
   * @param {express.Router} apiRouter - Router of the API
   * @memberof Server
   */
  private routes(apiRouter: express.Router): void {
    this.app.use("/", apiRouter);
    this.app.use((
      req: express.Request,
      res: express.Response,
      next: express.NextFunction) => {
      next(
        new ErrorResponse(`
          Page not found - ${req.originalUrl}`, StatusCodes.NOT_FOUND
        )
      );
    });
    this.app.use(errorHandler);
  }
}
