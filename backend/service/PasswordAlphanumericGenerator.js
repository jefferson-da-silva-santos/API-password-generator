import { PasswordGenerator } from "./PasswordGenerator.js";
import logger from "../utils/logger.js";

export class PasswordAlphanumericGenerator extends PasswordGenerator {

  constructor(length, type) {
    super(length, type);
  }

  async password(length, type) {
    try {
      const passwordGenerat = await this.returnGeneratedPassword(
        [
          'minusculas e numeros',
          'maiusculas e numeros',
          'minusculas e maiusculas',
          'minusculas maiusculas e numeros'
        ],
        [
          this.#createPasswordLowercaseAndNumbers(),
          this.#createPasswordCapitalAndNumbers(),
          this.#createPasswordLowercaseAndCapital(),
          this.#createPasswordLowercaseCapitalAndNumbers()
        ]
      );
      const objectPassword = {
        length: length,
        type: type,
        password: passwordGenerat
      }
      return objectPassword;
    } catch (error) {
      throw new Error(`Erro ao gerar senha: ${error.message}`);
    }
  }

  //  Letras minúsculas e números.

  async #createPasswordLowercaseAndNumbers() {
    try {
      const password = await this.passwordValidation(this.smallLettersAndNumbers, this.smallLetters, this.numbers);
      logger.info('Senha com letras minúsculas e números criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com letras minúsculas e números: ${error.message}`);
      throw new Error(`Erro ao criar senha com letras minúsculas e números: ${error.message}`);
    }
  }

  //Letras maiúsculas e números.

  async #createPasswordCapitalAndNumbers() {
    try {
      const password = await this.passwordValidation(this.capitalLettersAndNumbers, this.capitalLetters, this.numbers);
      logger.info('Senha com letras maiúsculas e números criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com letrasmaiúsculas e números: ${error.message}`);
      throw new Error(`Erro ao criar senha com letras maiúsculas e números: ${error.message}`);
    }
  }

  //Letras maiúsculas e minúsculas.

  async #createPasswordLowercaseAndCapital() {
    try {
      const password = await this.passwordValidation(this.smallLettersAndCapitalLetters, this.capitalLetters, this.smallLetters);
      logger.info('Senha com letras maiúsculas e minúsculas criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com letras maiúsculas e minúsculas: ${error.message}`);
      throw new Error(`Erro ao criar senha com letras maiúsculas e minúsculas: ${error.message}`);
    }
  }

  //Letras maiúsculas, minúsculas e numeros.

  async #createPasswordLowercaseCapitalAndNumbers() {
    try {
      const password = await this.passwordValidation(this.smallLettersAndCapitalLettersNumbers, this.capitalLetters, this.smallLetters, this.numbers);
      logger.info('Senha com letras maiúsculas, minúsculas e numeros criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha com letras maiúsculas minúsculas e numeros: ${error.message}`);
      throw new Error(`Erro ao criar senha com letras maiúsculas, minúsculas e números: ${error.message}`);
    }
  }

}
