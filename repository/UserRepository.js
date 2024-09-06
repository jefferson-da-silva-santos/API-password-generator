import pool from "./db.js";
import logger from "../utils/logger.js";

export class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async saveNewUser() {
    const client = await pool.connect();
    try {
      const queryText = 'INSERT INTO users VALUES (DEFAULT, $1, $2)';

      await client.query('BEGIN TRANSACTION');
      await client.query(queryText, [this.username, this.password]);
      await client.query('COMMIT');

      logger.info(`Usuário salvo com sucesso: ${this.username}`);
      return true;
    } catch (error) {
      logger.error(`Erro na inserção do usuário: ${error.message}`);
      return false;
    } finally {
      client.release();
    }
  }

  async searchUser() {
    try {
      const queryText = 'SELECT username, password FROM users WHERE username = $1 LIMIT 1';
      const result = await pool.query(queryText, [this.username]);

      if (result.rowCount > 0) {
        logger.info(`Usuário encontrado: ${this.username}`);
        return result.rows[0];
      } 
      logger.info(`Usuário não encontrado: ${this.username}`);
      return null;

    } catch (error) {
      logger.error(`Erro na busca do usuário: ${error.message}`);
      throw new Error('Erro na busca do usuário');
    }
  }
}
