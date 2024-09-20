const inputText = document.getElementById('input-value');
const inputRange = document.getElementById('input-range');
//menu variaveis
const btnMenu = document.querySelector('.menu');
const listMenu = document.querySelector('.nav__list-menu');
const divSeparator = document.querySelector('.separator');
let menuVisible = false;
//select
const htmlOptionsSelect = [
  "<option value='maiusculas'>Letras maiúsculas</option> <option value='minusculas'>Letras minúsculas</option> <option value='numeros'>Números</option>","<option value='maiusculas e numeros'>Letras maiúsculas e números</option> <option value='minusculas e numeros'>Letras minúsculas e números</option> <option value='minusculas e maiusculas'>Letras maiúsculas e minúsculas</option> <option value='minusculas maiusculas e numeros'>Letras maiúsculas, minusculas e números</option>","<option value='minusculas maiusculas numeros e caracteres especiais'>Letras maiúsculas, minúsculas, números e caracteres especiais</option>"
]
const selectTipoSenha = document.getElementById('tipo-senha');
const selectTipoCaracteresSenha = document.getElementById('tipo-caracteres-senha');
//Formulario
const form = document.querySelector('.main__form__group-form__form');
//Status usuario
let userResgistered = false;
let userLogado = false;
const btnGerarSenha = document.getElementById('btnGerarSenha');


document.addEventListener('DOMContentLoaded', () => {
  //chamada da função de iniciar o valor do input range
  initValueInputRange();
  //chamada da função de prevenir o envio do formulário
  preventSubmitDefault(form);
  //chamada da função de iniciar texto do select
  initTextSelect(selectTipoCaracteresSenha);
  //chamada da função de encher select
  fillSelectOptions(selectTipoCaracteresSenha);
  //Chamada da função de abrir e fechar menu
  openClosedMenu(btnMenu, listMenu);

  //Logica de gerar senha quando clicar no botao
  btnGerarSenha.addEventListener('click', async (event) => {
    event.preventDefault();

    const objectSenha = {
      type: document.getElementById('tipo-senha').value,
      length: document.getElementById('input-range').value,
      variation: document.getElementById('tipo-caracteres-senha').value
    }
    const senhaCriada = await createPassword(objectSenha);
    
    document.getElementById('input-invalid').value = senhaCriada.password;
  });
});

async function createPassword(objectSenha) {
  const { type, length, variation } = objectSenha;
  
  try {
    const response = await fetch(`http://localhost:3000/password/${type}/${length}/${variation}`, {
      method: 'GET',
      headers: {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImplZmZpbmhvIiwiaWF0IjoxNzI2ODUwODYxLCJleHAiOjE3MjY4NTQ0NjF9.QcN4vJHzI4a3vu1uiqDLJ6_esD_m_QfTeCNiQEpB3t8`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    const data = await response.json();
    return data; // Retorna o objeto JavaScript
  } catch (error) {
    throw new Error('Erro na requisição');
  }
}


/* Função responsável por abrir e fechar o menu mobile com o click do usuário*/
function openClosedMenu(btn, menu) {
  btn.addEventListener('click', () => {
    menu.style.display = !menuVisible ? 'flex':'none';
    toogleMenuVisible();
    document.body.style.overflow = !menuVisible ? 'auto':'hidden';
  });
}

//Função responsável por alternar o estao da visibilidade do menu
function toogleMenuVisible() {
  menuVisible = !menuVisible;
}

//Função responsável por prevenir o envio do formulário
function preventSubmitDefault(element) {
  element.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

//Função responsável por iniciar o texto do input range com o seu valor inicial 4
function initValueInputRange() {
  inputText.value = inputRange.value;
}

//Função responsável por iniciar o texto do select de variação da senha
function initTextSelect(element) {
  element.innerHTML = htmlOptionsSelect[0];
}

//Função usado no oninput do input range para atualizar o texto com o seu valor
function updateValueRange() {
  inputText.value = inputRange.value;
}

/*Função responsável por preencher o select com options do array 'htmlOptionsSelect'
de acordo com o tipo de senha escolhido pelo usuário */
function fillSelectOptions(element) {
  selectTipoSenha.addEventListener('change', () => {
    const textOptionSelect = selectTipoSenha.value;
    switch (textOptionSelect) {
      case 'simple':
        element.innerHTML = htmlOptionsSelect[0];
        break;
      case 'alphanumeric':
        element.innerHTML = htmlOptionsSelect[1];
        break;
      case 'complex':
        element.innerHTML = htmlOptionsSelect[2];
        break;
      case 'personalized':
        break;
    }
  });
}