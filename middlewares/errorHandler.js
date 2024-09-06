import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(`Erro: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ error: err.message})
}

export default errorHandler;
