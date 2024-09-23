No código fornecido, há algumas repetições que podem ser otimizadas com funções genéricas para reduzir a redundância. Vou destacar as principais áreas de repetição e propor soluções:

### 1. **Toggle Visibility**
Funções para alternar a visibilidade do login, registro e menu repetem a lógica de toggle (alternância). Isso pode ser encapsulado em uma única função genérica.

**Repetições:**
```js
function toogleOptionLoginVisible() {
  optionLoginVisible = !optionLoginVisible;
}

function toogleOptionRegisterVisible() {
  optionRegisterVisible = !optionRegisterVisible;
}

function toogleMenuVisible() {
  menuVisible = !menuVisible;
}
```

**Função Genérica:**
```js
function toggleVisibility(variable) {
  return !variable;
}
```

Você pode então reutilizar essa função para alternar a visibilidade:

```js
optionLoginVisible = toggleVisibility(optionLoginVisible);
optionRegisterVisible = toggleVisibility(optionRegisterVisible);
menuVisible = toggleVisibility(menuVisible);
```

### 2. **Status User**
A função `statusUser` é usada repetidamente para alterar o texto e a cor de um elemento. Isso já está bem encapsulado, mas pode ser ajustado para aceitar qualquer seletor e cor, como está.

**Exemplo de chamada repetida:**
```js
statusUser('Erro no login do usuário!', 'red', '.text-status-user');
statusUser('Usuário logado com sucesso!', 'green', '.text-status-user');
```

Nenhuma mudança necessária, pois já está otimizada.

### 3. **Form Submission Prevention**
A função `preventSubmitForm` é usada para prevenir o envio de formulários. Esta função é repetida para diferentes formulários.

**Repetição:**
```js
preventSubmitForm(form);
document.querySelectorAll('.option__group-primary__form').forEach(element => {
  preventSubmitForm(element);
});
```

Você já encapsulou bem essa função, mas pode estender para vários formulários de forma genérica:

**Função Genérica para Múltiplos Formulários:**
```js
function preventSubmitForms(forms) {
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
    });
  });
}
```

**Uso:**
```js
preventSubmitForms(document.querySelectorAll('.option__group-primary__form'));
```

### 4. **Exibição e Fechamento de Opções**
As funções para exibir e fechar as opções de login e cadastro têm muita lógica repetida.

**Repetições:**
```js
function showOption(text, classOption) {
  // Lógica repetida para definir o texto e a visibilidade
}

function closedOption(classOption) {
  // Lógica repetida para fechar as opções
}
```

**Função Genérica:**
```js
function toggleOption(classOption, isVisible, text = '') {
  const classText = classOption === '.groupOption-login' ? 
                    '.option__group-primary__title-login' : 
                    '.option__group-primary__title-cadastro';
  
  if (isVisible) {
    document.querySelector(classOption).style.display = 'flex';
    document.querySelector(classText).textContent = text;
    document.body.style.overflow = 'hidden';
  } else {
    document.querySelector(classOption).style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}
```

**Uso:**
```js
toggleOption('.groupOption-login', true, 'Faça login');
toggleOption('.groupOption-cadastro', false);
```

### 5. **Fetch Requests**
As funções `registerUser` e `loginUser` são bem parecidas, mudando apenas o endpoint da API.

**Repetições:**
```js
async function registerUser(username, password) {
  // Fetch para o registro de usuário
}

async function loginUser(username, password) {
  // Fetch para o login de usuário
}
```

**Função Genérica:**
```js
async function makeRequest(endpoint, body) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw new Error('Erro na requisição');
  }
}
```

**Uso:**
```js
const registerResult = await makeRequest('http://localhost:3000/auth/register', { username, password });
const loginResult = await makeRequest('http://localhost:3000/auth/login', { username, password });
```

### Conclusão

Com essas funções genéricas, seu código ficará mais organizado, com menos repetições e mais fácil de manter. As principais áreas que podem ser otimizadas são:

1. Alternância de visibilidade (`toggleVisibility`).
2. Prevenção de envio de múltiplos formulários (`preventSubmitForms`).
3. Alternância de exibição e fechamento de opções (`toggleOption`).
4. Função genérica para requisições (`makeRequest`).

Isso não só melhora a legibilidade do código, mas também facilita futuras manutenções e alterações.