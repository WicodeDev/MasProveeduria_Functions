import { TokenPayload } from "@middlewares/auth"

declare module "express" {
    export interface Request {
        user?: TokenPayload;
    }
}
