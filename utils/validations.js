import Joi from "joi";

// Validação para parâmetros de senhas
export const passwordShema = Joi.object({
  length: Joi.number().integer().min(4).max(128).required(),
  type: Joi.string().valid(
    'minusculas', 'maiusculas', 'numeros',
    'minusculas e numeros',
    'maiusculas e numeros',
    'minusculas e maiusculas',
    'minusculas maiusculas e numeros',
    'minusculas maiusculas numeros e caracteres especiais',
    'personalizada'
  ).required()
});


//validação para dados de usuários
export const userShema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(4).max(128).required()
});

export const stringPersonalizedShema = Joi.object({
  characters: Joi.string().trim().min(3).required()
});