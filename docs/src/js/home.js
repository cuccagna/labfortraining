/* Lo script è messo nell html prima di body quindi sono sicuro che il DOM 
è già stato caricato quindi DOMContentLoaded è superfluo, tuttavia lo uso 
lo stesso anche per non creare variabili globali */

import './moduli.js';

document.addEventListener('DOMContentLoaded',() =>{
   /*Serve per evitare la situazione che ci sia il menu hamburger aperto, poi l utente fa il 
   refresh e si ritrovi il menu hamburger aperto (perchè il menu hamburger è aperto usando target)*/
   location.hash='';
   const copertinaEl = document.querySelector('.copertina');
   const imgMoto    = document.querySelector('#logo-home-header img');
   const inputSearchBox = document.getElementById('ricerca-indirizzo');
   const civicoSearchBox = document.getElementById('num-civico');
   const formSearchBox = document.forms['box-search-form'];
   const spanSearchBox = document.getElementById('box-search-errore');
   const tornaSu = document.querySelector('div a.tornaSu');
   let isCivicoMancante = false;
   let isFirstFocus = true;
   let gestoreIntermedioScroll = debounce(gestisciScroll, 200);

   copertinaEl.addEventListener('click', annullaCopertina);
   imgMoto.addEventListener('animationend' , centraIntestazioneHeader);
   inputSearchBox.addEventListener('focus' , usaApiFacilitareInserimentoIndirizzo);
   formSearchBox.addEventListener('submit',submitIndirizzo);
   /*Per lo scroll viene usata una tecnica che impedisce che la funzione venga gestisciScroll()
   venga chiamata troppo spesso dato che normalmente lo scroll è un evento che causa tanti
   inneschi dell'evento*/
   window.addEventListener('scroll',gestoreIntermedioScroll);

   //Necessario che googleAPICaricata sia globale per essere visibile allo script che poi deve chiamare la callback. A tal fine lo attacco all oggetto window
   let _resolve;//serve per cambiare lo stato della Promise a settled quando è caricata la libreria google API ed è chiamata la callback
   let googleAPIStatus = new Promise((resolve)=>{_resolve = resolve}); //Promise in stato pendente che serve per capire se la google API è stata caricata
   window.googleAPICaricata = function (){
    _resolve();//this cause Promise to settled state
   }

   //Rende visibile o invisibile il bottone torna su
    function gestisciScroll(){
      let scrollPosition = window.pageYOffset || window.scrollY || document.body.scrollTop || document.documentElement.scrollTop;
       if(scrollPosition >=200){
         tornaSu.classList.add('tornaSu-visibilita');
       }
       else
         tornaSu.classList.remove('tornaSu-visibilita');
   }
   
   // Helper to "debounce" a function call, meaning it has to wait
    // at least a certain amount of time before being called again
    // so that the function is not run too often.
    // See https://remysharp.com/2010/07/21/throttling-function-calls
    function debounce(fn, delay) {
      let timer = null;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn();
        }, delay);
      };
    }

   //NOTA BENE
/* Questo codice serve per evitare che l utente digiti un codice che non è rispondente al formato 
di indirizzi di google place ExtensionScriptApis.
In pratica obbliga l utente a scegliere sempre un risultato da quelli dell elenco di google anche
quando preme invio.
Allora se l utente preme invio senza avere 
selezionato dall elenco di voci suggerite da google (sta in ascolto sull evento onkeydown sul 
  campo di testo) viene controllato che il tasto premuto è enter e che non si è selezionato 
  nessuna voce dall elenco di google in tal caso viene simulato ed innescato l evento freccia 
  sotto che automaticamente obbliga la selezione di una delle voci di menu  */
 function enableEnterKey(input) {

   /* Store original event listener */
   const _addEventListener = input.addEventListener
 
   const addEventListenerWrapper = (type, listener) => {
     if (type === 'keydown') { //evento premi un tasto
       /* Store existing listener function */
       const _listener = listener
       listener = (event) => {
         /* Simulate a 'down arrow' keypress if no address has been selected */
         const suggestionSelected = document.getElementsByClassName('pac-item-selected').length //pac-item-selected è la classe degli item selezionati per google api
         if (event.key === 'Enter' && !suggestionSelected) { //se hai premuto invio e non ne hai selezionato manco uno
           const e = new KeyboardEvent('keydown', { 
             key: 'ArrowDown', 
             code: 'ArrowDown', 
             keyCode: 40, 
           })
           _listener.apply(input, [e])
         }
         _listener.apply(input, [event])
       }
     }
     _addEventListener.apply(input, [type, listener])
   }
 
   input.addEventListener = addEventListenerWrapper //diventa il nuovo listener
 }


 

 function submitIndirizzo(event){
   event.preventDefault();
   //console.log(document.getElementsByClassName('pac-item-selected'));
   valida(inputSearchBox.value); 
}

function valida(inputSearchBoxContain){
   //se non do il focus al searchBox non viene scaricata la API google. Se premo invio senza dare focus avrei errore. Ad evitare questo serve il controllo qui
   if(inputSearchBoxContain === ''){ 
      indirizzoInvalido('Indirizzo mancante');
      resettaCivico(); //caso speciale, lascialo anche se non lo capisci
      return;
   }

   //Al precedente submit mancava il civico
   if(isCivicoMancante){
      //Consentiti i civici come 2a,1b ecc. Numeri positivi e basta
      if(! /^\d+([a-z]|[A-Z])?$/.test(civicoSearchBox.value)){ //Se è ancora vuoto o non hai inserito un numero(o 1a ecc)
         civicoMancante('Civico inesatto'); //Errore, il civico manca o non è corretto
         return;
      }
      else{
         //Replace rimpiazza solo la prima occorrenza della stringa
         inputSearchBoxContain= inputSearchBoxContain.replace(',' , `, ${civicoSearchBox.value}, `);
         inputSearchBox.value = inputSearchBoxContain;
      }
   }
   
   doGeocode(inputSearchBoxContain); //validazione tramite google
}



   async function usaApiFacilitareInserimentoIndirizzo(){
      //solo la prima volta che dai il focus devi localizzare l'utente e caricare la libreria
      //inputSearchBox.removeEventListener('focus',usaApiFacilitareInserimentoIndirizzo);
      if(isFirstFocus){
         isFirstFocus = false;
         //carica la google maps api
         caricaGoogleAPI();      
         //eseguo in parallelo la localizzazione e il caricamento delle API Goggle, ma vado avanti solo quando entrambi sono caricati
         //NOtare che se la geolocalizzazione fallisce viene comunque tornata una Promise in stato resolved
         //con value=undefined dove value è la position, perchè ho gestito la cosa con un try-catch nella
         //funzione geolocalizza. Se  non lo avessi fatto un problema nella geolocalizzazione avrebbe causato
         //il lancio dell'eccezione qui ed avrei dovuto mettere qui un try-catch.....
         let [_,posizione]= await Promise.all([googleAPIStatus , geolocalizza()]); //se la posizione è undefined vuol dire che si è verificato un errore tipo che l utente non ha autorizzato la geolocalizzzazione
         //Se sono qui sono sicuro che sia la geolocalizzazione(almeno la richiesta, se ha avuto esito negativo poco importa) che il caricamento delle API è avvenuto.
         initAutocomplete(posizione);
         //Serve per fare si che quando l'utente preme invio viene preso il primo risultato nell'autocomplete dropdown
         enableEnterKey(inputSearchBox); 
         //Serve per fare si che quando perdo il focus la prima voce dell'autocomplete sia inserita nel campo
         inputSearchBox.addEventListener('blur', blurInputSearchBox);
         //autocomplete.addListener('place_changed', fillInAddress);  //fillInAddress funzione da chiamare quando seleziono un indirizzo
      }
      else
         resettaErrore();
   }
   
   // è necessario codificare l'indirizzo perchè è possibile che l utente abbia inserito un indirizzo
   // senza sceglierlo dall'autocomplete menu, ma che sia ugualmente corretto. In questo caso google
   // deve metterlo nel formato corretto. Può anche accadere che l indirizzo sia completamente inesiste
   //nte.
   function doGeocode(addr) {
      // Get geocoder instance
      var geocoder = new google.maps.Geocoder();
    
      // Geocode the address
      geocoder.geocode({
        'address': addr
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) { //Questo controlla solo che l'indirizzo sia valido. (anche solo via)
          // set it to the correct, formatted address if it's valid
          //addr.value = results[0].formatted_address;
          analizzaCivico(results[0]);
          // show an error if it's not
        } else indirizzoInvalido('Indirizzo inesistente');
      });
    }

   //Ritorna true solo se c'è anche il civico.
   function analizzaCivico(addressGoogleGeocoded){
      let addr_comp = addressGoogleGeocoded.address_components;
      
      /* cioè manca il civico. Però pare che alcuni indirizzi nelle frazioni sia memorizzati da google
      senza il civico ma non tutti. Per gestire questo caso borderline la prima volta che manca il 
      civico comunque chiedo l inserimento del civico (la prima volta isCivicoMancante è false anche 
         se manca il civico perchè sarà settato a true di lì a breve. ). Alla seconda volta che manca 
         il civico (anche se l utente lo ha inserito) faccio comunque partire il submit (senza civico). 
         Per rilevare questo scenario controllo addr_comp[1].long_name === addr_comp[2].long_name 
         perchè quando sono uguali non si tratta di una frazione */
      if(addr_comp[0].types[0] !== 'street_number' && (!isCivicoMancante || (addr_comp[1].long_name === addr_comp[2].long_name))) 
         indirizzoInvalido('Manca Civico');
      else{ //OK,CORRETTO SE SEI QUI, fai tipo invia(addressGoogleGeocoded)
         //console.log(addressGoogleGeocoded.formatted_address);
         resettaErrore();//Cancella tutti gli errori e chiamando resettaCivico() rende invisibile la casella del civico
         resettaCivico();//toglie la casella di inserimento del civico
         trovaRistorantiVicini(addressGoogleGeocoded);
      }
   }

   function indirizzoInvalido(messaggio){
      if(messaggio === 'Manca Civico'){
         civicoMancante();
      }
      else{ //Problema non sul civico, ma sull'indirizzo
         switch(messaggio){
            case 'Indirizzo inesistente':
               spanSearchBox.classList.add('active-error');
               spanSearchBox.classList.add('first-error-message');
               inputSearchBox.setAttribute('aria-invalid','true');
               break;

            case 'Indirizzo mancante':
               spanSearchBox.classList.add('active-error');
               spanSearchBox.classList.add('second-error-message');
               inputSearchBox.setAttribute('aria-invalid','true');
               break;
         }
      }
      
   }

   //Chiamato se il civico è mancante o c'è un errore nel civico
   function civicoMancante(civicoInesatto){
      isCivicoMancante = true;
      civicoSearchBox.className='inserisci-civico'; //fa spuntare la casella dell'indirizzo
      civicoSearchBox.setAttribute('aria-invalid','true');
      civicoSearchBox.focus();
      civicoSearchBox.value='';
      spanSearchBox.classList.add('active-error'); //fa spuntare lo span dell'errore
      spanSearchBox.classList.add('active-error-civico'); //fa spuntare lo span dell'errore
      if(arguments.length && arguments[0]==="Civico inesatto") 
         spanSearchBox.classList.add('active-error-civico2'); //formatta lo span dell'errore in modo da mettere il suo testo e l'icona sulla destra
      else
         spanSearchBox.classList.add('active-error-civico'); //formatta lo span dell'errore in modo da mettere il suo testo e l'icona sulla destra

   }

   //Cancella tutti gli errori e chiamando resettaCivico() rende invisibile la casella del civico
   function resettaErrore(){
      spanSearchBox.classList.remove('active-error');
      spanSearchBox.classList.remove('first-error-message');  
      spanSearchBox.classList.remove('second-error-message');
      inputSearchBox.removeAttribute('aria-invalid');  
      resettaCivico();
   }

   //Fa sparire il box del civico e resetta il flag a false
   function resettaCivico(){
      if(isCivicoMancante){
         spanSearchBox.classList.remove('active-error-civico');
         spanSearchBox.classList.remove('active-error-civico2');
         civicoSearchBox.className='';
         civicoSearchBox.removeAttribute('aria-invalid');
         isCivicoMancante = false;
      }
   }
   //AL blur del campo di ricerca(che può essere anche il click del bottone di sumbit) scrive il primo risultato dell'autocomplete dropdown nel campo di testo
   function blurInputSearchBox() {
      if(inputSearchBox.value === '') //gestisco il caso borderline che do il focus alla pagina quando il campo è vuoto, e ci hai già inserito qualcosa in precedenza
         return;

      const hover = document.querySelectorAll(".pac-container .pac-item:hover");
      // if an item dal menu autocomplete has been clicked, do nothing, otherwise get first solution
      if (hover.length === 0) {
         let first_Result = document.querySelector(".pac-container .pac-item:first-of-type");
         if(!first_Result){ //accade quando inserisci cose inesistenti per cui non esiste corrispondenza con nessun indirizzo. In questo caso l autocomplete google menu è vuoto
            let geocoder = new google.maps.Geocoder();
    
            // Geocode the address
            geocoder.geocode({
              'address': inputSearchBox.value
            }, function(results, status) {
              if (!(status === google.maps.GeocoderStatus.OK) || !(results.length > 0) ) { //Questo controlla solo che l'indirizzo sia valido. (anche solo via)
                resettaCivico();
                indirizzoInvalido('Indirizzo inesistente');
              return;
              }
            });
            
            return;
         }
         //potrei usare textContent ma non prenderei tutti i campi perfettamente 
         const parsedResult = first_Result.querySelector('.pac-item-query').textContent + " " +first_Result.querySelector('div > span:last-child').textContent;
         inputSearchBox.value=parsedResult;
          //let firstResult = document.querySelector(".pac-container .pac-item:first-of-type .pac-item-query").textContent;
      }
   }

   function initAutocomplete(posizione){

      let autocomplete = new google.maps.places.Autocomplete(
         inputSearchBox,
         {types: ['address']}); 
      setRadiusAddresses(autocomplete,posizione);
   }

   function setRadiusAddresses(autocomplete,posizione){
      //posizione è undefined se c'è stato un errore di localizzazione
      if(posizione)
      {
         let geolocationCoords = {
            lat: posizione.coords.latitude,
            lng: posizione.coords.longitude
         }
         //per radius l unita di misura dovrebbe essere in metri.
         var circle = new google.maps.Circle({
            center: geolocationCoords,
            radius: 200  
         });
         
         autocomplete.setBounds(circle.getBounds());
      }

   }

   function caricaGoogleAPI(){
      let isLibraryLoaded = document.querySelector("script[src='google-api']"); //torna null cioè false se la libreria non è stata caricata altrimenti torna un oggetto che ha valore booleano true
      if(!(typeof google === 'object' && typeof google.maps === 'object')){
         //Aggiungi script dinamico che carica la libreria
         let script = document.createElement('script');
         script.type='text/javascript';
         script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCrWmZ9FKBsH5eLFwGWtl0JcFoUWfyaMus&libraries=places&callback=googleAPICaricata';
         script.id  = 'google-api';
         if(!isLibraryLoaded)
            document.body.appendChild(script);
         else
            isLibraryLoaded.parentNode.replaceChild(script,isLibraryLoaded);
      }
   }

   

   async function geolocalizza(){
      try{
         let position = await geolocation(); //Chiama geolocation() e non esegue il resto del codice finchè non si ha una risposta
         return position; //questo sarà automaticamente wrappato in una promise
      }
      //Vado nel catch se reject viene innescata. Voglio che comunque il programma continui
      catch(errore){
         gestioneErrore(errore);
         return undefined;
      }

      
   }
   
   async function geolocation(){
      if (navigator.geolocation){
         return await new Promise((resolve,reject)=>{ navigator.geolocation.getCurrentPosition(
            resolve,reject)});
      }
      else{
         alert('Non supporti la geolocalizzazione. Aggiorna il browser');
      }
   }

   //Gestisce l errore ad esempio se l utente rifiuta di dare le coordinate
   function gestioneErrore(errore){
      if(errore.code === 1){
         ;//Se non permetti la localizzazione non fare niente. alert('Dato che non hai permesso la tua localizzazione non so dirti dove sei')
      }
      else if(errore.code === 2){
         alert('Non riesco a recuperare ed inviare le informazioni necessarie');
      }
      else
         alert('Si è verificato un errore nella tua localizzazione');
   }

   function centraIntestazioneHeader(){
      let mainTitle = document.querySelector('header h1');
      mainTitle.style.marginRight = 0;
      /* const mq = window.matchMedia( "(min-width: 48em)" );
      if(mq.matches) {
         // window width is greater than 48em
         mainTitle.classList.add('scale-up');
      }  */
      
   }

   function annullaCopertina(event){
      document.querySelector('.copertina-contain').classList.add('endTypewriter'); //cesso l animazione di scrittura
      imgMoto.classList.add('logo-home-header-delay'); //Fa partire subito l animazione della moto
      copertinaEl.classList.add('erase-copertina');  //aggiungo la classe erase-copertina all'elemento copertina, che ne causa l'immediata scomparsa
   }

   /*CODICE PER CARICARE I RISTORANTI*/ 
   async function trovaRistorantiVicini(geoAddress){

      let ristoranti = await caricaRistoranti()
         .catch((err)=>{
               const message = 'ERRORE '+err.message+ " \n"+err;
               alert(message);
               console.error(message);
               return;
            }
         );

         let ristorantiAr = ristoranti.ristoranti;
         let service = new google.maps.DistanceMatrixService(); //servizio per trovare distanze tra più di due indirizzi
         //Si assume che nel file json gli indirizzi sono formattati correttamente per google
         let indirizziRistoranti = ristorantiAr.map(item=>item.locazione); //prendo gli indirizzi e li metto in un 'array
         let indirizzoConsegna   = geoAddress.formatted_address;
         
         //Unità di misura tornata in km per default
         //origins e destinations devono essere un array di luoghi. I luoghi possono essere
         //espressi come stringhe,come cordinate lat-lon, come google.map.Place
         service.getDistanceMatrix({
              origins: [indirizzoConsegna],
              destinations: indirizziRistoranti,
              travelMode: 'DRIVING',
            }, gestisciRisultatiDistanze);
      //console.log(geoAddress.geometry.location.lat());
      //console.log(geoAddress.geometry.location.lng());

      //Callback una volta tornate le distanze tra ristornati ed indirizzo di consegna
      function gestisciRisultatiDistanze(response, status){
         if (status == 'OK') {
            // I dati delle distanze sono tornati in un formato particolare dentro il campo row (VEDI DOCUMENTAZIONE)
            // Sarebbe necessario fare un doppio ciclo for ma nel mio caso basta un solo ciclo for perchè nell'
            // indirizzo di origine c è un solo indirizzo (quello di consegna)
            let risultati = response.rows[0].elements; //rows[0].elements torna un array di oggetti in cui ogni oggetto contiene le informazioni tra l unico indirizzo di consegna ed uno di quelli di destinazione in ordine
            
            let ristorantiMatchati = ristorantiAr.filter((ristoranteCorrente,index)=>{
               let distanzaKm;
               if(risultati[index].status === 'OK')
                  distanzaKm = risultati[index].distance.value / 1000; //l'API torna distanza in metri, nel file JSON è in km
                  if(distanzaKm <= ristoranteCorrente.max_distanza_consegna){
                     ristoranteCorrente.distanza = Math.round(distanzaKm*100)/100; //modifico al volo l'item corrente in modo da salvare la distanza dall indirizzo di consegna nell oggetto ritornato. Conservo solo due cifre decimali al più
                     ristoranteCorrente.tempoConsegna = Math.ceil(risultati[index].duration.value /60); //per convertire i secondi tornati dall'API in minuti
                     return true;
                  }
               return false; //Eseguito se lo stato non è OK(cioè l API non ha potuto calcolare la distanza) o la distanza è maggiore di quella massima cui il ristorante consegna (il confronto avviene in km) 
            }); 
            
            let markup = creaMarkupHTMLRistorantiVicini(ristorantiMatchati);
            apriPaginaRistorantiVicini(markup);
         }
         else{
            alert('ERRORE di rete nella richiesta');
            throw new Error('Errore nel servizio di calcolo delle distanze tra gli indirizzi');
         }
      }
   }

   function apriPaginaRistorantiVicini(markup){
      let ristorantiWindow = window.open("src/html/ristoranti.html","ristoranti");
      ristorantiWindow.onload=()=>{
         ristorantiWindow.document.getElementById('ristoranti').innerHTML=markup;
         ristorantiWindow.focus();
         
      //window.close(); non è stata aperta da uno scipt per cui non può essere chiusa
      }
   }

   function creaMarkupHTMLRistorantiVicini(ristorantiMatchati){

      let articles =`<header>
                        <h2>Ristoranti trovati:</h2>
                     </header>
                     `,
      nomeFoto,
      estensioneFoto,
      tempFoto,
      tipoCucina,
      costoConsegna,
      costoOrdineMinimo;

      if(!ristorantiMatchati.length){ //se è vuoto, nessun ristorante vicino
         articles = `<header>
                        <h2 class='nessun-ristorante-header'>NON CI SONO RISTORANTI VICINI A TE</h2>
                     </header>
                     `
      }

      for(const ristorante of ristorantiMatchati){
            tempFoto = ristorante.foto.split('.');
            estensioneFoto = tempFoto[tempFoto.length-1];
            tempFoto.pop(); //elimino l ultimo elemento cioè l estensione
            nomeFoto = tempFoto.join(''); //elimina l'ultimo valore cioè l'estensione e concatena il resto. Necessario qualora vi fosse un punto nel nome della foto
            tipoCucina = ristorante.tipo.join(' - ');
            costoConsegna = (ristorante.costo_consegna===0) ? 'GRATIS' : (ristorante.costo_consegna + ' &euro;');
            costoOrdineMinimo = (ristorante.costo_ordine_minimo === 0) ? 0 : (ristorante.costo_ordine_minimo + ' &euro;');


            articles += `
            <article data-indirizzo='${ristorante.indirizzoWeb}' class='ristoranti-item'>
               <div class="ristoranti-item-immagine">
                  <picture >
                     <source type='image/webp' media="(min-width:48em)" srcset="../../${ristorante.pathfoto}${nomeFoto}-small.${estensioneFoto}" />
                     <source  type='image/webp' srcset="../../${ristorante.pathfoto}${ristorante.foto}" /> 
                     <img
                  srcset="../../${ristorante.pathfoto}${nomeFoto}.png 768w,
                           ../../${ristorante.pathfoto}${nomeFoto}-small.png 200w"
                  sizes="(min-width:48em) 100px,
                        400px"
                  alt="Immagine ristorante" title="Immagine ristorante"/>
                     
               </picture>
            </div>

            <div class="ristoranti-item-info">
               <img src="../../${ristorante.pathfoto}${ristorante.logo}" title='Logo ristorante' alt='Logo ristorante'>
               <ul class="ristoranti-item-info-testuali">
                  <li class="ristoranti-item-info-testuali-titolo"><a href="${ristorante.indirizzoWeb}">${ristorante.nome}</a></li>
                  <li class="ristoranti-item-info-testuali-tipo">${tipoCucina}</li>
               </ul>
            </div>
            <div class="ristoranti-item-info-consegna">
               <p class="ristoranti-item-info-consegna-ordine">
                  <span class="ristoranti-item-info-consegna-ordine-costo">Consegna: <span class='valuestyle'>${costoConsegna}</span></span> 
                  <span class="ristoranti-item-info-consegna-ordine-costominimo">Ordine Minimo: <span class='valuestyle'>${costoOrdineMinimo}</span></span>
               </p>
               <p class="ristoranti-item-info-consegna-distanza">Distanza: <span class='valuestyle'>${ristorante.distanza} km</span></p>
               <p class="ristoranti-item-info-consegna-tempo">Tempo di consegna: <span class='valuestyle'>${ristorante.tempoConsegna}'</span></p>
            </div>
         </article>
      `
   }

   return articles;
   }

   async function caricaRistoranti(){
      let response = await fetch('src/html/json/ristoranti.json'); //fetch reject la promise in caso di timeout ad esempio. In questo caso viene lanciata un'eccezione che può essere gestita internamente con un try catch, o esternamente cioè nel chiamante con un .catch

      if(response.ok || response.status === 304){ //304 significa dati in cache
         return await response.json();
      }
      else 
         throw new Error('Errore ' + response.status +' nella richiesta');
     /* QUI SOTTO VECCHIO MODO DI GESTIRE LE PROMISE SENZA AWAIT CHE CAUSEREBBE CHE IL CONTROLLO
        PASSA AD UN'ALTRA FUNZIONE MENTRE COSI' IL CONTROLLO TORNA AL CHIAMANTE*/
     
     /*fetch('../html/json/ristoranti.json')
         .then(
            (response)=>{
               if(response.OK || response.status === 304){ //304 valore in cache
                  response.json();
               }
               else{
                  throw new Error('Errore ' + response.status +' nella richiesta');
               }
            },
            ()=>{ //seconda callback del primo then
               alert('Errore di rete nella richiesta'); //ad esempio scade il timeout per scaricare il file json
               throw new Error('Errore di rete nella richiesta');
            }
         )//chiusura primo then
         .then( //qui gestisco la risposta con esito positivo
            (ristoranti)=>{
               
            }
         ).catch
            (err)=>{
               alert('Errore nella richiesta: '+err.message);
               console.log(err);
            } */
         }
});



window.addEventListener('load',()=>{
   const mq = window.matchMedia( "(min-width: 48em)" ), //a questa media query aggiungo o tolgo il carousel
    relativePathImages='multimedia/img/',
   imagesName = ['carousel1','carousel2','carousel3'],
   pathImmagini = imagesName.map((item) => `${relativePathImages}${item}`);
   let carouselId;
   let numImmagine = 0; 
   const slideShowContainer = document.querySelector('div.slide-show');

   
/*    if necessario quando sin da subito la viewport è più grande di 768px*/
   if(mq.matches)
      mediaQueryInnescata();

   mq.addEventListener('change',mediaQueryInnescata);
   slideShowContainer.addEventListener('click',handlerArrowSliderClick); //use event delegation



   /*    Questa funzione è chiamata dalla media query 48em (768px) ed è innescata solo quando
   superi 768 px cioè ne hai di più o di meno. E non è chiamata ad ogni resize ma solo quando superi
   la soglia. Cioè se arrivi a 769px è chiamata ma poi non è chiamata di nuovo per 770px,771px ecc.
   è chiamata di nuovo se rimpicciolisci ed arrivi a 767px.
   Attenzione però che è metchata (event.matches===true) solo quando la mediaquery è soddisfatta

   Nota che è necessario collegarla all'evento onload perchè in questa funzione gestirò il carosello
   che carica delle immagini per le quali è necessario che l'evento onload del body si sia verificato
   per essere certi di non incappare in qualche problema.

   Si controlla anche event===undefined perchè viene chiamata anche da me
 */   function mediaQueryInnescata(event){
      if(!event || event.matches ){//piu di48em
         document.querySelector('main').classList.add('content-wrapper');
         createCarousel();
         //Crea carosello
      }
      else{ //meno di 48em
         document.querySelector('main').classList.remove('content-wrapper');
         deleteCarousel();
         //Togli carosello
      }
}

   function createCarousel(){
      carouselId = setTimeout(handleCarousel , 5000); //best practice usare setTimeout invece di setInterval
   }

   function deleteCarousel(){
      clearTimeout(carouselId);
      //Negli schermi sotto i 768 pixel non uso il carosello e in questi
      //casi ripristino la prima immagine come immagine fissa
      replacePictureInHTML(createNodePicture(pathImmagini[0]));
   }

   function handleCarousel(avantiIndietro){
      if(avantiIndietro === 'indietro'){
         --numImmagine;
         if(numImmagine === -1)
            numImmagine = pathImmagini.length - 1;
      }
      else{
         numImmagine = ++numImmagine % pathImmagini.length;
      }
      let pictureNode = createNodePicture(pathImmagini[numImmagine]);
      replacePictureInHTML(pictureNode);
      carouselId = setTimeout(handleCarousel , 5000);
   }

   function replacePictureInHTML(pictureToInsert){
      let pictureToReplace = document.getElementById('picture-carousel');
      let pictureElParent  = pictureToReplace.parentNode;
      pictureElParent.replaceChild(pictureToInsert,pictureToReplace);
   }

   function createNodePicture(imageName){
         let pictureEl = document.createElement('picture');
         pictureEl.id  = 'picture-carousel';

         const markup = `          
            <source media="(min-width:50em)" srcset="${imageName}_big.jpg"> 
            <source media="(min-width:37.5em)" srcset="${imageName}_large.jpg"> 
            <source media="(min-width:25em)" srcset="${imageName}_medium.jpg"> 
            <source  srcset="${imageName}_small.jpg"> 
            <img src='${imageName}_large.jpg' title='Hashfood n° 1 in Italia' alt='Immagine Hashfood n° 1 in Italia'>
         `
         pictureEl.innerHTML = markup;

         return pictureEl;
         
      }

      /* Uso event delegation per individuare se e quale bottone freccia del carosello
      è stato premuto */
      function handlerArrowSliderClick(event){
         switch(event.target.className){
            case 'slide-show-left-arrow':
               clearTimeout(carouselId); //cancella l eventuale richiesta gia in coda
               handleCarousel('indietro');
               break;

            case 'slide-show-right-arrow':
               clearTimeout(carouselId); //cancella l eventuale richiesta gia in coda
               handleCarousel();
               break;
         }
      }

});