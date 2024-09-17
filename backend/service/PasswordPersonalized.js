import logger from "../utils/logger.js";
import { PasswordGenerator } from "./PasswordGenerator.js";

export class PasswordPersonalized extends PasswordGenerator {
  constructor(length, type) {
    super(length, type)
  }

  async password(length, type, stringCharacters) {
    try {
      const passwordGenerat = await this.returnGeneratedPassword(
        [
          'personalizada'
        ],
        [
          this.#createPersonalizedPassword(stringCharacters)
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

  async #createPersonalizedPassword(stringPassword) {
    const charactersPersonalized = stringPassword.split('');
    try {
      const password = await this.passwordValidation(charactersPersonalized, charactersPersonalized);
      logger.info('Senha personalizada criada com sucesso.');
      return password;
    } catch (error) {
      logger.error(`Erro ao criar senha personalizada: ${error.message}`);
      throw new Error(`Erro ao criar senha personalizada: ${error.message}`);
    }
  }
}
