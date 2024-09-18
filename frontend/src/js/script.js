const inputText = document.getElementById('input-value');
const inputRange = document.getElementById('input-range')

document.addEventListener('DOMContentLoaded', () => {
  inputText.value = inputRange.value;
});

function updateValueRange() {
  inputText.value = inputRange.value;
}