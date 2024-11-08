import {onRequest} from "firebase-functions/v2/https";
const next = require("next");

const nextApp = next({
  dev: false,
  conf: {distDir: ".next"},
});

const handle = nextApp.getRequestHandler();

export const nextAppHandler = onRequest((req, res) => {
  return nextApp.prepare().then(() => handle(req, res));
});
