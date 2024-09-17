import { PasswordDatabase } from "../repository/PasswordDatabase.js";
import logger from "../utils/logger.js";

export class PasswordGenerator {
  //simples
  smallLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  numbers = '0123456789'.split('');
  specialCharacters = "!@#$%^&*()-_=+[]{}|\\;:'\",./<>?~`".split('');
  //alfanumericas
  smallLettersAndNumbers = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  capitalLettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  smallLettersAndCapitalLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  smallLettersAndCapitalLettersNumbers = '0123456789abcdefghijklmn0123456789opqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  //complexas
  smallLettersAndCapitalLettersNumbersSpecialCharacters = "0123456789abcdefghijklmn0123456789opqrstuvwxyz0123456789ABCDEFGH!@#$%^&*()-_=+[]{}|\\;:'\",./<>?~`IJKLMNOPQRSTUVWXYZ".split('');

  //construtor
  constructor(length, type) {
    // Valida os dados de entrada e define o comprimento e o tipo da senha
    this.validateInputData(length, type);
    this.length = length;
    this.type = type
  }

  /*
  Função para validar se a senha gerada contém caracteres repetidos 3 vezes consecutivas.
  Retorna false se encontrar repetições, caso contrário, retorna true.
  */
  validatePasswordRepetitions(password) {
    const arrayPassword = password.split('');
    for (let i = 0; i <= arrayPassword.length - 1; i++) {
      const value = arrayPassword[i];
      if (arrayPassword[i + 1] === value && arrayPassword[i + 2] === value) {
        return false;
      }
    }
    return true;
  }

  /*
  Função que gera um número aleatório positivo entre 0 e o valor definido em 'lengthArray'.
  */
  generateRandomPositiveNumber(lengthArray) {
    return Math.floor(Math.random() * lengthArray);
  }

  /*
  Função que valida se a senha gerada contém pelo menos um caractere de cada tipo
  definido em 'arrays'. Retorna true se todos os tipos estiverem presentes, caso contrário, retorna false.
  */
  validatePasswordCharacters(password, ...arrays) {
    const arrayPassword = password.split('');
    const acc = arrays.map(() => 0);
    for (const char of password) {
      arrays.forEach((array, index) => {
        if (array.includes(char)) acc[index]++;
      })
    }
    return acc.every(accumaltor => accumaltor > 0);
  }

  /*
  Função que cria uma senha com caracteres aleatórios do array fornecido.
  O comprimento da senha é definido pelo atributo 'this.length'.
  Retorna a senha gerada.
  */
  createPassword(arrayCharacter) {
    const arrayPassword = new Array(this.length);
    for (let i = 0; i <= arrayPassword.length - 1; i++) {
      arrayPassword[i] = arrayCharacter[this.generateRandomPositiveNumber(arrayCharacter.length - 1)];
    }
    const password = arrayPassword.join('');
    logger.info(`Senha criada: ${password}`);
    return password;
  }

  /*
  Função assíncrona que valida a senha gerada conforme critérios específicos.
  A senha é considerada válida se passar na validação de repetições, conter caracteres de todos os tipos exigidos,
  e não estiver presente no banco de dados ou na lista de senhas comuns.
  Retorna a senha válida gerada.
  */
  async passwordValidation(arrayCharacter, arraysValidate) {
    let passwordValid = false;

    while (!passwordValid) {
      const password = this.createPassword(arrayCharacter);
      logger.info(`Validando senha gerada: ${password}`)
      if (
        this.validatePasswordRepetitions(password) &&
        this.validatePasswordCharacters(password, arraysValidate) &&
        !await PasswordDatabase.searchPassword(password) &&
        !await PasswordDatabase.searchCommonPassword(password)
      ) {
        passwordValid = !passwordValid;
        this.password = password;
        logger.info(`Senha válida gerada com sucesso: ${password}`);
        return password;
      } else {
        logger.warn(`Senha inválida gerada: ${password}`);
      }
    }
  }

  /*
  Função que valida os dados de entrada para o comprimento e o tipo da senha.
  Lança um erro se o comprimento não estiver entre 4 e 128 ou se o tipo for uma string vazia.
  */
  validateInputData(length, type) {
    if (typeof length !== 'number' || length < 4 || length > 128) {
      logger.error(`Erro de validação: O comprimento da senha deve ser um número entre 4 e 128.`);
      throw new Error('A senha deve ser um número entre 4 e 128');
    }

    if (typeof type !== 'string' || type.trim() === '') {
      logger.error(`Erro de validação: O tipo de senha deve ser uma string não vazia.`);
      throw new Error('O tipo de senha deve ser uma string não vazia');
    }
  }

  /*
  Função que retorna a função responsável por gerar a senha com base no tipo fornecido.
  Se o tipo não for encontrado na lista de tipos válidos, lança um erro.
  */
  async returnGeneratedPassword(arrayTypes, arrayFunctions) {
    const type = this.type;
    logger.info(`Gerando senha do tipo: ${type}`);
    for (let n in arrayTypes) {
      if (arrayTypes[n] === type) {
        return arrayFunctions[n];
      }
    }
    logger.error(`Tipo de senha inválido: ${type}`);
    throw new Error('Tipo de senha inválido');
  }

}
