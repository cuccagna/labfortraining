

let loginForm = document.forms['login-form'];
let loginEmail = loginForm.elements['login-email'];
let loginPassword = loginForm.elements['login-password'];
let loginButton = loginForm.elements['submit-login'];

let registerForm = document.forms['register-form'];
let registerEmail = registerForm.elements['register-email'];
let registerPassword = registerForm.elements['register-password'];
let registerPasswordAgain = registerForm.elements['register-password-again'];
let registerTerminiCondizioni = registerForm.elements['termini-condizioni'];
let registerButton = registerForm.elements['submit-register'];

const MIN_PASSWORD_LENGTH = 8;

loginEmail.addEventListener('change',isEmailValid);
loginPassword.addEventListener('change',isPasswordValid);
loginForm.addEventListener('submit',loginSubmit);

registerEmail.addEventListener('change',isEmailValid);
registerPassword.addEventListener('change',isPasswordValid);
registerPasswordAgain.addEventListener('change',isPasswordValidAgain);
registerTerminiCondizioni.addEventListener('change',isTerminiCondizioniValid);
registerForm.addEventListener('submit',registerSubmit);


function loginSubmit(ev){
   if(!isEmailValid(loginEmail) || !isPasswordValid(loginPassword))
      ev.preventDefault();
}

function registerSubmit(ev){
   if(!isEmailValid(registerEmail) || !isPasswordValid(registerPassword) || !isPasswordValidAgain(registerPasswordAgain) || !isTerminiCondizioniValid(registerTerminiCondizioni))
      ev.preventDefault();
}

function isTerminiCondizioniValid(e){
   let terminiCondizioni = e.target || e;
   let label = terminiCondizioni.parentNode.querySelector(`label[for='${terminiCondizioni.id}']`);
   if(!terminiCondizioni.checked){
      label.classList.add('form-errore');
      return false;
   }

   label.classList.remove('form-errore');
   return true;
}

function isPasswordValidAgain(e){
   let passwordAgain = e.target || e;
   let passwordAgainInserted = passwordAgain.value;
   let errorPresent = false;

   if(passwordAgainInserted === "" || passwordAgainInserted === undefined){
      setMessageErrorField(passwordAgain,"E' necessario reinserire la password per confermarla");
      errorPresent = true;
   }

   if(passwordAgainInserted !== registerPassword.value){
      setMessageErrorField(passwordAgain,"Le password inserite non coincidono");
      errorPresent = true;
   }

   if(errorPresent){
      setStateErrorField(passwordAgain,'errore');
      return false;
   }

   setStateErrorField(passwordAgain,'valido');
   return true;
}

function isEmailValid(e){
   let email = e.target || e; //perchè può essere chiamato sia dal listener che esplicitamente. Il parametro può essere l email o l evento
   const patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   const emailInserted = email.value;
   let errorPresent = false;

   if(emailInserted === "" || emailInserted === undefined){
      setMessageErrorField(email,"L'email è obbligatoria");
      errorPresent = true;
   } 
   
   else if( !patternEmail.test(emailInserted)){
      setMessageErrorField(email,"Errore nel formato dell'email");
      errorPresent = true;
   }

   if(errorPresent){
      setStateErrorField(email,'errore');
      return false;
   }

   setStateErrorField(email,'valido');
   return true;
}

function isPasswordValid(e){
   let password = e.target || e;
   const patternPassword = /(?:\d+.*[A-Z]+)|(?:[A-Z]+.*\d+)/; //Significa che ci deve essere almeno una lettera maiuscola e un numero (?: significa che non mi interessa il capturing group)
   const passwordInserted = password.value;
   let errorPresent = false;

   if(passwordInserted === "" || passwordInserted === undefined){
      setMessageErrorField(password,"La password è obbligatoria");
      errorPresent = true;
   } 
   else if (passwordInserted.length < MIN_PASSWORD_LENGTH){
      setMessageErrorField(password,"La password deve contenere almeno 8 caratteri");
      errorPresent = true;
   }
   else if(!patternPassword.test(passwordInserted)){
      setMessageErrorField(password,"La password deve contenere almeno 1 numero e 1 carattere in maiuscolo");
      errorPresent = true;
   }

   if(errorPresent){
      setStateErrorField(password,'errore');
      return false;
   }

   setStateErrorField(password,'valido');
   return true;
}

function setMessageErrorField(field,message){
   //anche se in questo modo si è dipendenti dal markup
   //let errorNode = field.nextElementSibling;   Allora uso un altro sistema
   let regError = /([\w-]+) */; //uso una regex con un capturing group
   //idErrorNode
   let ariaDescribedValue=field.getAttribute('aria-describedby');
   //ariaDescribedValue.split[0] avrebbe pure funzionato. Così dovrebbe essere più efficiente
   let idErrorNode = regError.exec(ariaDescribedValue)[1];
   let errorNode = document.getElementById(idErrorNode);
   errorNode.textContent = message;
}

function setStateErrorField(field,state){
   if(state === 'errore'){
      field.setAttribute('aria-invalid',true);
      field.classList.add('form-errore');
      field.classList.remove('form-valid');
   }
   else{
      field.removeAttribute('aria-invalid');
      field.classList.remove('form-errore');
      field.classList.add('form-valid');
   }
}