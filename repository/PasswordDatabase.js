import pool from "./db.js";
import { commonPasswordCache } from "../utils/cache.js";
import { passwordsGeneratedCache } from "../utils/cache.js";
import logger from "../utils/logger.js";

export class PasswordDatabase {
  constructor(length, type, variant, password) {
    this.length = length;
    this.type = type;
    this.variant = variant;
    this.password = password;
  }

  async saveNewPassword() {
    const client = await pool.connect();
    try {
      const queryText = 'INSERT INTO passwordsapi values (DEFAULT, $1, $2, $3, $4)';

      await client.query('BEGIN TRANSACTION');
      await client.query(queryText, [this.length, this.type, this.variant, this.password]);
      await client.query('COMMIT');

      logger.info(`Senha salva com sucesso: ${this.password}`);
      return true;

    } catch (error) {
      logger.error(`Erro na inserção da senha: ${error.message}`);
      await client.query('ROLLBACK');
      return false;
      
    } finally {
      client.release();
    }
  }

  static async searchPassword(password) {
    try {
      if (passwordsGeneratedCache.has(password)) {
        logger.info('Cache hit para senha.');
        return true;
      }

      const queryText = 'SELECT password FROM passwordsapi WHERE password = $1 LIMIT 1';
      const result = await pool.query(queryText, [password]);
      /* O rowCount armazena o número de linhas afetadas pela consulta SQL*/
      if (result.rowCount > 0) {
        passwordsGeneratedCache.set(password, true);
        logger.info('Senha encontrada no banco de dados.');
        return true;
      }
      logger.info('Senha não encontrada no banco de dados.');
      return false;
    } catch (error) {
      logger.error(`Erro na busca de senha: ${error.message}`);
      throw new Error('Erro, Dados não encontrados');
    }
  }

  static async searchCommonPassword(password) {
    try {

      if (commonPasswordCache.has(password)) {
        logger.info('Cache hit para senha.');
        return true;
      }
      logger.info('Cache miss para senha.');

      const queryText = 'SELECT password FROM commonpasswords WHERE password = $1 LIMIT 1';
      const result = await pool.query(queryText, [password]);

      if (result.rowCount > 0) {
        commonPasswordCache.set(password, true);
        logger.info('Senha comum encontrada no banco de dados.');
        return true;
      }

      logger.info('Senha comum não encontrada no banco de dados.');
      return false;
    } catch (error) {
      logger.error(`Erro na busca dos dados de senhas comuns: ${error.message}`);
      throw new Error('Erro, Dados de senhas comuns não encontrados');
    }
  }

}

