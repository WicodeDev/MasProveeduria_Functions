import "module-alias/register";
import appServices from "@services/app.services";
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";


setGlobalOptions({ maxInstances: 10 });

export const app = onRequest(appServices);