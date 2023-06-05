const speakeasy = require('speakeasy');
 // Configura la clave secreta
 const secret = 'hFGx7&hi4EXFOJXUdQ&WBHeY59'; 
 // Tiempo de vida del codigo OTP
 const codeValidity = 600;
 // Genera un código OTP
 const otpCode = speakeasy.totp({secret, window: codeValidity});

 const isValid =  speakeasy.totp.verify({secret, encoding: 'ascii', token: '445578',});
 console.log('OPT CODE:' + otpCode);
 if(isValid){
    console.log('VALID OTP CODE:');
 }else{
    console.log('INVALID OTP CODE:');
 }

 