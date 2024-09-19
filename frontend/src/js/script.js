const inputText = document.getElementById('input-value');
const inputRange = document.getElementById('input-range');
//menu variaveis
const btnMenu = document.querySelector('.menu');
const listMenu = document.querySelector('.nav__list-menu');
const divSeparator = document.querySelector('.separator');
let menuVisible = false;

document.addEventListener('DOMContentLoaded', () => {
  inputText.value = inputRange.value;

  btnMenu.addEventListener('click', () => {
    listMenu.style.display = !menuVisible ? 'flex':'none';
    toogleMenuVisible();
    document.body.style.overflow = !menuVisible ? 'auto':'hidden';
  })
});

function toogleMenuVisible() {
  menuVisible = !menuVisible;
}

function updateValueRange() {
  inputText.value = inputRange.value;
}