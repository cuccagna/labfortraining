document.addEventListener('DOMContentLoaded',cambia);

  
  function cambia()
  {
  //alert(window.orientation);
      
  var dim=document.documentElement.clientWidth
  
  if ((dim<= 480)&&(window.orientation!=undefined)) {
    caricaFoto('small.jpg');
    }
    else if((dim > 480)&&(dim<= 768)&&(window.orientation!=undefined)){
    caricaFoto('medium.jpg');
    }
    else{
    caricaFoto('big.jpg');
    }
  }

  function caricaFoto (photoSize) {

      let domNodeImageContainer = document.querySelector("#hero");  
      asyncRequestDOM(photoSize,domNodeImageContainer);
  }
  
   
   function asyncRequestDOM(photoSize , domNodeImageContainer){
      
      const xhr = new XMLHttpRequest(); //anche questo può lanciare un eccezione
      const url = './immaginiCode.html';

      
         xhr.onreadystatechange = getInfo;
         xhr.open('GET',url);
         xhr.send(null);
      
      
      function getInfo(){
    
         if( xhr.readyState === 4){
            if( xhr.status >=200 && xhr.status<299 || xhr.status === 304 ) //304, file in cache
            {
               //console.log(typeof xhr.responseText);
               handleResponse(photoSize , domNodeImageContainer ,xhr.responseText);
            }
            else{
               domNodeImageContainer.textContent = 'Error loading resource:' + xhr.status;
               const messageError = 'Si è verificato un errore:\n' + xhr.status;
               alert(messageError);
               throw new Error('Error loading resource: ' + xhr.status);
            }
         }
     
      }
   }

   function handleResponse(photoSize , domNodeImageContainer ,responseText){
      
      try{
         let errors;
         const parser = new DOMParser();
         const htmldom = parser.parseFromString(responseText , 'text/html');
         errors = htmldom.getElementsByTagName('parsererror');
         if(errors.length > 0){
            throw new Error('Parsing error!');
         }

         const domImg = htmldom.querySelector(`img[src='${photoSize}']`);
         domNodeImageContainer.appendChild(domImg);
      }
      catch(ex){
         alert(ex.message);
         console.log(ex);
         throw new Error('Errore nel parsing');
      }
   }

   