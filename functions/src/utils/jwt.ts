import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "./dotenv";

export const generateJWT = (id: String) => {
  return sign({id: id, }, JWT_SECRET!);
}