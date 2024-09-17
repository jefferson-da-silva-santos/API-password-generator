import logger from "../utils/logger.js";
import { PasswordGenerator } from "./PasswordGenerator.js";

export class PasswordSimpleGenerator extends PasswordGenerator {

  constructor(length, type) {
    super(length, type);
  }

  async password(length, type) {
    try {
      const passwordGenerat = await this.returnGeneratedPassword(
        [
          'minusculas', 'maiusculas', 'numeros'
        ],
        [
          this.#createPasswordLowercase(),
          this.#createPasswordCapital(),
          this.#createPasswordNumbers()
        ]
      );

      const objctPassword = {
        length: length,
        type: type,
        password: passwordGenerat
      }
      return objctPassword
    } catch (error) {
      throw new Error(`Erro ao gerar senha: ${error.message}`);
    }
  }

  // Apenas letras minúsculas.

  async #createPasswordLowercase() {
    try {
      const password = await this.passwordValidation(this.smallLetters, this.smallLetters);
      logger.info('Senha com letras minúsculas criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com letras minúsculas: ${error.message}`);
      throw new Error(`Erro ao criar senha com letras minúsculas: ${error.message}`);
    }
  }

  //Apenas letras maiúsculas.

  async #createPasswordCapital() {
    try {
      const password = await this.passwordValidation(this.smallLetters, this.smallLetters);
      logger.info('Senha com letras maiúsculas criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com letras maiúsculas: ${error.message}`);
      throw new Error(`Erro ao criar senha com letras maiúsculas: ${error.message}`);
    }
  }

  //Apenas números.

  async #createPasswordNumbers() {
    try {
      const password = await this.passwordValidation(this.numbers, this.numbers);
      logger.info('Senha com numeros criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com numeros: ${error.message}`);
      throw new Error(`Erro ao criar senha com numeros: ${error.message}`);
    }
  }

}


