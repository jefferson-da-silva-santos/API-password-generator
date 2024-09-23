No geral, manter variáveis como `userLogado` e `tokenUser` para validar o estado de autenticação e armazenar o token no frontend pode ser funcional, mas pode não ser a abordagem mais segura ou robusta. Existem práticas mais seguras e recomendadas para gerenciar autenticação no frontend.

### Problemas com a abordagem sugerida:
- **Segurança do Token**: Se você armazenar o token em variáveis JavaScript, ele pode ser exposto a ataques, como XSS (Cross-Site Scripting).
- **Persistência inadequada**: Ao usar variáveis, você pode perder o estado de autenticação ao recarregar a página ou fechar o navegador, a menos que o token seja armazenado em um lugar mais persistente (como localStorage ou cookies).

### Melhor abordagem:
1. **Armazenamento Seguro do Token**:
   - **Cookies** (com atributos `HttpOnly` e `Secure`): Armazenar o token de autenticação em um cookie com as flags `HttpOnly` e `Secure` ajuda a evitar que o JavaScript tenha acesso ao token diretamente, reduzindo o risco de ataques XSS. Esses cookies podem ser enviados automaticamente pelo navegador com cada requisição, facilitando o controle do token sem a necessidade de enviar manualmente.
   - **localStorage/sessionStorage**: Se for necessário acessar o token diretamente via JavaScript (por exemplo, para APIs que não aceitam cookies), você pode armazená-lo no `localStorage` ou `sessionStorage`. No entanto, esses métodos são vulneráveis a ataques XSS, por isso devem ser usados com cautela.

2. **Gerenciamento de Estado**:
   - Use **bibliotecas de gerenciamento de estado**, como Redux, para centralizar o controle do estado de autenticação no frontend. Por exemplo, você pode armazenar a informação de `userLogado` e o `tokenUser` no estado global do aplicativo.
   - Em uma abordagem mais robusta, você poderia:
     - Armazenar o token em um estado centralizado.
     - Verificar se o token ainda é válido antes de cada requisição (via middleware, como em Redux Thunk ou Redux Saga).
     - Invalidar o token (e deslogar o usuário) quando ele expirar.

3. **Verificação do Estado de Autenticação**:
   - Em vez de depender de variáveis manuais como `userLogado`, você pode validar o estado de login com base na existência e validade do token. Por exemplo:
     - Se o token estiver presente e válido (não expirado), o usuário está logado.
     - Se o token estiver ausente ou inválido, o usuário não está logado.

### Exemplo de uma abordagem usando `localStorage` e gerenciamento de estado com Redux:

```js
// actions/auth.js
export const login = (token) => {
  localStorage.setItem('token', token);
  return {
    type: 'LOGIN',
    payload: token
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  return {
    type: 'LOGOUT'
  };
};

// reducers/authReducer.js
const initialState = {
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload,
        isLoggedIn: true
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        isLoggedIn: false
      };
    default:
      return state;
  }
};

// Verificação do estado de autenticação ao fazer requests:
const token = store.getState().auth.token;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  delete axios.defaults.headers.common['Authorization'];
}
```

### Conclusão:
- A sua abordagem pode funcionar, mas existem formas mais seguras e escaláveis de lidar com autenticação no frontend.
- Prefira usar cookies seguros para armazenar tokens, ou utilize o `localStorage` com cautela.
- Combine isso com um bom gerenciamento de estado para validar dinamicamente se o usuário está logado, evitando variáveis globais inseguras no frontend.