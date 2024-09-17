import { PasswordGenerator } from "./PasswordGenerator.js";
import logger from "../utils/logger.js";

export class PasswordComplexGenerator extends PasswordGenerator {

  constructor(length, type) {
    super(length, type);
  }

  async password(length, type) {
    try {
      const passwordGenerat = await this.returnGeneratedPassword(
        [
          'minusculas maiusculas numeros e caracteres especiais'
        ],
        [
          this.#createPasswordLowercaseCapitalNumbersAndSpecialCharacters()
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


  //Letras maiúsculas, minúsculas e numeros e caracteres especiais.

  async #createPasswordLowercaseCapitalNumbersAndSpecialCharacters() {
    try {
      const password = await this.passwordValidation(this.smallLettersAndCapitalLettersNumbersSpecialCharacters, this.capitalLetters, this.smallLetters, this.numbers, this.specialCharacters);
      logger.info('Senha complexa criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha complexa: ${error.message}`);
      throw new Error(`Erro ao criar senha complexa: ${error.message}`);
    }
  }
}


