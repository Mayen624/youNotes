console.log('it works');

const btnShowPass = document.getElementById('show-pass');
btnShowPass.style.display = 'none';
const inputPass = document.getElementById("password");

inputPass.addEventListener("input", function(){
    // Check the value of the element
    if(password.value !== ""){
        btnShowPass.style.display = 'block';
    }else{
        btnShowPass.style.display = 'none';
    }
});

btnShowPass.addEventListener('click', () => {
    if(inputPass.type == 'password'){
        inputPass.type = 'text';
    }else{
        inputPass.type = 'password';
    }

})


//btnShowPass.style.display = "none";

setTimeout(() => {
    document.getElementById('alerts').style.display = 'none';
}, 15000)