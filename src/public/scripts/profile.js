console.log('working from profile.js');

let keyBtn = document.getElementById('keyBtn');
let keyInput = document.getElementById('key');
let copyBtn = document.getElementById('copy');
let key;
let val;

const generateKey = () => {
    return Math.random().toString(25).substring(2, 12);
}

keyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    key = generateKey(10);
    keyInput.value = key;
})

copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    val = keyInput.value.select();
    //Seguir investigando...
})



