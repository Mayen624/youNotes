let keyBtn = document.getElementById('keyBtn');
let keyInput = document.getElementById('key');
let copyBtn = document.getElementById('copy');
let btnsKey = document.getElementById('btn-sKey');
let key;
let val;
let sKey;

const generateKey = () => {
    return Math.random().toString(25).substring(2, 12);
}

keyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    key = generateKey(10);
    keyInput.value = key;
})

setTimeout(() => {
    document.getElementById('alerts').style.display = 'none';
}, 15000)



