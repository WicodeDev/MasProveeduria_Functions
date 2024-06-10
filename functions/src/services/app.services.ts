import router from "@routes/app.routes";
import { Server } from "@utils/server";


const serve = new Server(router);
export default serve.app;