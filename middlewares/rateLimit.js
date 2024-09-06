import rateLimit from "express-rate-limit";

//Definindo o limitadir para o registro
export const limiterRegister = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos 
  max: 5, // limite de 5 requisições por IP
  handler: (req, res) => {
    res.status(429).json({
      error:
        'Você excedeu o número máximo de tentativas de registro. Tente novamente mais tarde.'
    });
  },
});


//Definindo o limitadir para o login
export const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos 
  max: 10, // limite de 10 requisições por IP
  handler: (req, res) => {
    res.status(429).json({
      error:
        'Você excedeu o número máximo de tentativas de login. Tente novamente mais tarde.'
    });
  },
});
