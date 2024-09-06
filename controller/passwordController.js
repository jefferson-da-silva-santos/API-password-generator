import { PasswordSimpleGenerator } from "../service/PasswordSimpleGenerator.js";
import { PasswordAlphanumericGenerator } from "../service/PasswordAlphanumericGenerator.js";
import { PasswordComplexGenerator } from "../service/PasswordComplexGenerator.js";
import { PasswordPersonalized } from "../service/PasswordPersonalized.js";
import { PasswordDatabase } from "../repository/PasswordDatabase.js";
import { passwordShema } from "../utils/validations.js";
import logger from "../utils/logger.js";
import { stringPersonalizedShema } from "../utils/validations.js";

async function baseResponse(req, res, next, ClassPassword, typePassword) {
  const { error } = passwordShema.validate(req.params);

  if (error) {
    logger.warn(`Validação falhou: ${error.details[0].message}`);
    return res.status(400).json({error: error.details[0].message});
  }

  const type = req.params.type;
  const length = parseInt(req.params.length, 10);

  try {
    const objectClassePassword = new ClassPassword(length, type);
    const passwodData = await objectClassePassword.password(length, type);
    const save = new PasswordDatabase(length, typePassword, type, passwodData.password);
    const result = await save.saveNewPassword();

    if (!result) {
      logger.error('Falha ao salvar a senha no banco de dados.');
      throw new Error('Não foi possível salvar os dados no banco');
    }

    logger.info(`Senha gerada e salva com sucesso`);
    res.status(200).json(passwodData);
  } catch (error) {
    logger.error(`Erro ao gerar senha: ${error.message}`);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
}

export const createSimplePassword = async (req, res, next) => {
  try {
    await baseResponse(req, res, next, PasswordSimpleGenerator, 'simple');
  } catch (error) {
    logger.error(`Erro ao criar senha simples: ${error.message}`);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
}

export const createAlphanumericPassword = async (req, res, next) => {
  try {
    await baseResponse(req, res, next, PasswordAlphanumericGenerator, 'alphanumeric');
  } catch (error) {
    logger.error(`Erro ao criar senha alfanumérica: ${error.message}`);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
}


export const createComplexPassword = async (req, res, next) => {
  try {
    await baseResponse(req, res, next, PasswordComplexGenerator, 'complex');
  } catch (error) {
    logger.error(`Erro ao criar senha complexa: ${error.message}`);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
}


export const createPersonalizedPassword = async (req, res, next) => {
  const errorParams = passwordShema.validate(req.params).error;

  if (errorParams) {
    logger.warn(`Validação falhou: ${errorBody.details[0].message}`);
    return res.status(400).json({error: errorBody.details[0].message});
  }

  const errorBody = stringPersonalizedShema.validate(req.body).error;

  if (errorBody) {
    logger.warn(`Validação falhou: ${errorBody.details[0].message}`);
    return res.status(400).json({error: errorBody.details[0].message});
  }

  const { type } = req.params;
  const length = parseInt(req.params.length, 10);
  const { characters } = req.body;
  

  try {
    const objectPassword = new PasswordPersonalized(length, type);
    const passwodData = await objectPassword.password(length, type, characters);
    const save = new PasswordDatabase(length, 'personalized', type, passwodData.password);
    const result = await save.saveNewPassword();

    logger.info(`Senha gerada e salva com sucesso`);
    res.status(200).json(passwodData);
    if (!result) {
      logger.error('Falha ao salvar a senha no banco de dados.');
      throw new Error('Não foi possível salvar os dados no banco');
    }

  } catch (error) {
    logger.error(`Erro ao criar senha personalizada: ${error.message}`);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }

}

