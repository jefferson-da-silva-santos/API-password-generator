import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../repository/UserRepository.js';
import { userShema } from '../utils/validations.js';
import logger from '../utils/logger.js';

//Função para registrar usuário
export const registerUser = async (req, res, next) => {
  try {
    //valida o objeto json de entrada
    const { error } = userShema.validate(req.body);

    if (error) {
      logger.warn(`Validação falhou no registro do usuário: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = new User(username, password);
    const foundUser = await existingUser.searchUser();

    if (foundUser) {
      logger.warn(`Tentativa de registro de usuário já existente: ${username}`);
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newUser = new User(username, hashedPassword);
    const result = await newUser.saveNewUser();

    if (!result) {
      logger.error('Erro ao salvar usuário no banco de dados.');
      return res.status(500).json({ error: 'Erro ao salvar usuário ' });
    }
    logger.info(`Usuário registrado com sucesso: ${username}`);
    res.status(201).json({ success: 'User registered' });
  } catch (error) {
    logger.error(`Erro no registro do usuário: ${error.message}`);
    next();
  }
};

//Função para login de usuário
export const loginUser = async (req, res, next) => {
  try {
    const { error } = userShema.validate(req.body);
    if (error) {
      logger.warn(`Validação falhou no login do usuário: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;
    const user = new User(username, password);
    const foundUser = await user.searchUser();

    if (!foundUser) {
      logger.warn(`Tentativa de login com credenciais inválidas: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      logger.warn(`Senha inválida para o usuário: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: foundUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`Login bem-sucedido para o usuário: ${username}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Erro no login do usuário: ${error.message}`);
    next();
  }
};


// Função para autenticação JWT
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    logger.warn('Tentativa de acesso sem token de autenticação.');
    return res.status(401).json({ error: 'Access Denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(`Autenticação bem-sucedida para o usuário: ${decoded.username}`);
    next();
  } catch (error) {
    logger.error(`Token inválido: ${error.message}`);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

