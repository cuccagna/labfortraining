//IIFE per non rendere globali le variabili e funzioni
(() => {

   let registrationForm = document.forms['registrazione'];
   let fileList = document.getElementById('foto');
   const fotoMessageErrorElement = document.querySelector('div.registrati span small');
   const inputFile = document.getElementsByClassName('custom-file-upload')[0];
   let fotoField = document.querySelector("div.registrati.foto figure");
   let fotoFieldImg = fotoField.getElementsByTagName('img')[0];
   
   registrationForm.addEventListener("submit", (event) => {
      //Permetti il sumbit solo se il tipo e la dimensione del file sono corretti
      event.preventDefault();
      //I tre metodi sotto lanciano un'eccezione in caso di validazione non superata
      //Quindi l'esecuzione si interrompe in caso di problemi.
      handleNotSelectedFile();
      handleMimeType(fileList.files[0]);
      handleSize(fileList.files[0]);

      //Se sei qui il campo file è valido lato client
      //Disabilito il pulsante di submit. 
      let buttonSubmit = registrationForm.elements['btnSubmit'];
      buttonSubmit.disabled = true;
      //parte comunque il submit automaticamente

      registrationForm.submit();
   });

   
   fileList.addEventListener('change', (event) => {
      //L'utente potrebbe avere selezionato più file, Prendo il primo
      let file = event.target.files[0];
      handleMimeType(file);
      handleSize(file);
      console.log('CIao');
      readImage(file); //Se sono qui sono sicuro sia un'immagine
   });


   function readImage(immagine) {

      reader = new FileReader();
      reader.onerror = function () {
         fotoMessageErrorElement.textContent = "Errore nella lettura del file";
         inputFile.classList.add('error');
         throw new Error("Errore nella lettura del file.\nCodice errore: " + reader.error.code);
      }

      reader.onload = function () {
         fotoField.className = 'visible';
         fotoFieldImg.src = reader.result;
         
      }
      //lettura asincrona dell'iimagine
      reader.readAsDataURL(immagine);
   }

   function handleNotSelectedFile() {
      const numFiles = fileList.files.length;
      if (numFiles === 0) {
         fotoMessageErrorElement.textContent = "Il campo IMMAGINE è vuoto";
         inputFile.classList.add('error');
         throw new Error("Nessun file selezionato");
      }
   }

   function handleSize(file) {
      const fileSize = file.size;
      if (fileSize > 512000) {
         setCleanSizeError(file.size);
         throw new Error("File troppo grande. Max 500Kbyte");
      }
      else
         setCleanSizeError();
   }

   function handleMimeType(file) {
      let fileType = checkMimeType(file.type);
      if (!fileType) {
         setCleanMimeTypeError(file.type);
         throw new Error("File caricato non consentito");
      }
      else {
         setCleanMimeTypeError();
      }
      
      //console.log(fileType);
   }

   //Ritorna undefined se non è un'immagine nel formato corretto
   //Altrimenti ritorna il mime type
   function checkMimeType(fileType) {
      let typeAllowed = ['image/png', 'image/jpeg', 'image/gif', 'image/svg'];
      let found = typeAllowed.find(element => element === fileType);
      return found;
   }

   function setCleanMimeTypeError(fileType="no-error") {
      if (fileType === "no-error") {
         fotoMessageErrorElement.textContent = "";
         inputFile.classList.remove('error');
         return;
      }

      if (/image/.test(fileType))
         fotoMessageErrorElement.textContent = "Consentite solo immagini jpeg,gif,png,svg";
      else
         fotoMessageErrorElement.textContent = "Non hai selezionato un'immagine";
      
      inputFile.classList.add('error');
      fotoFieldImg.src = "";
      fotoField.classList.remove('visible');
   }



   function setCleanSizeError(fileSize="no-error") {
      if (fileSize === "no-error") {
         fotoMessageErrorElement.textContent = "";
         inputFile.classList.remove('error');
         return;
      }
      fotoMessageErrorElement.textContent = `File di ${Math.round((fileSize/1024)*10000)/10000} Kbyte: troppo grande`;
      inputFile.classList.add('error');
      fotoFieldImg.src = "";
      fotoField.classList.remove('visible');
   }
})();