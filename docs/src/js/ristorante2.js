import './moduli.js';

(()=>{
   //aggiungo un listener allo scroll per implementare position:sticky per l'elemento aside
   let asideOrdineBox = document.querySelector('#box-ordina');
   // getBoundingClientRect().top torna la distanza tra l elemento e il top della viewport 
   // ma attenzione che questo valore cambia al cambiare dello scroll. Allora è meglio usare
   //offsetTop che non cambia al cambiare dello scroll.
   const rectTop = asideOrdineBox.offsetTop;
   /* E' necessario clonare il nodo perchè position:fixed porta l elemento ad essere fuori dal flusso e 
   cioè non occupare più lo spazio che prima occupava. Allora clono l elemento e lo inserisco con
   visibility:'hidden' che causa che l elemento non è visibile ma fa sempre parte del flusso in questo
   modo il layout non subirà modifiche */
   const clonedAsideOrdineBox = asideOrdineBox.cloneNode(true);
   clonedAsideOrdineBox.style.visibility = 'hidden';
   let asideBoxFixedPositioned = false;

   //Rendi cliccabili gli articoli del menu.
   //Uso event delegation con un solo gestore per ogni categoria di articoli 
   let costoConsegna = document.querySelector('.box-ordina-costoConsegna span');
   const ordineMinimo= document.querySelector('#box-ordina .box-ordina-ordineMinimo span');
   costoConsegna = convertFromEuroToFloat(costoConsegna);

   let articlesCategorie = document.querySelectorAll('article[id]');
   for(let art of articlesCategorie)
      art.addEventListener('click',gestisciArticoli);

   window.addEventListener('scroll',gestisciScroll);

   function gestisciScroll(){
      let scrollPosition = window.pageYOffset || window.scrollY || document.body.scrollTop || document.documentElement.scrollTop;
      if( !asideBoxFixedPositioned && scrollPosition >= rectTop ){
         asideOrdineBox.parentNode.appendChild(clonedAsideOrdineBox);
         asideOrdineBox.style.position = 'fixed';
         asideOrdineBox.style.top=0;
         asideBoxFixedPositioned=true;
      }
      else{
         if(asideBoxFixedPositioned && scrollPosition <= rectTop){
            asideOrdineBox.parentNode.removeChild(clonedAsideOrdineBox);
            asideOrdineBox.style.position = 'static';
            asideOrdineBox.style.top='';
            asideBoxFixedPositioned = false;
         }
      }
   }

   function gestisciArticoli(ev){
      let el = ev.target;
      //l elemento è un articolo che ha la classe menu-categoria-item
      //this è l elemento cui hai attaccato il listener cioè l articolo della macrocategoria.
      //this!== el significa che stai controllando che non hai premuto sulla categoria generica
      //tipo Fritti,Pizze che non essendo un articolo specifico non può aggiungere il prezzo
      //Devi anche controllare di non avere premuto sull intestazione della macrocategoria
      if(this !== el && el !== this.querySelector('.menu-categoria h3')){
         let article = retrieveArticle(el);
         const costoTotOrdine= aggiornaPrezzo(article);
         incrementaNumOrdini();
         checkRaggiuntoOrdineMinimo(costoTotOrdine);
      }
   }

   function retrieveArticle(n){
      if(n.nodeName.toLowerCase() === 'article')
         return n;
   
         return retrieveArticle(n.parentNode); 
   }

   function aggiornaPrezzo(el){
      const priceNode = el.querySelector("div[class='menu-categoria-item-price']");
      const prezzo = convertFromEuroToFloat(priceNode);
      let totaleOrdineNode = document.querySelector('.box-ordina-totale span:last-of-type');
      let totaleOrdine = convertFromEuroToFloat(totaleOrdineNode);
      totaleOrdine = checkFirstOrder(totaleOrdine); //se è il primo articolo aggiungi anche il costo di consegna al totale
      
      totaleOrdine += prezzo;

      let totaleOrdineCarrello = document.querySelector('.carrello span.carrello-prezoTotaleAcquisti');
      let totaleOrdineFormattato = totaleOrdine.toFixed(2) + ' &euro;'; //aggiunge sempre due cifre decimali
      totaleOrdineCarrello.innerHTML = totaleOrdineFormattato;
      totaleOrdineNode.innerHTML = totaleOrdineFormattato;

      return totaleOrdine;
   }

   function incrementaNumOrdini(){
      let numAcquistiNode = document.querySelector('.carrello .carrello-numAcquisti');
      numAcquistiNode.textContent = parseInt(numAcquistiNode.textContent) + 1;
   }

   function checkRaggiuntoOrdineMinimo(costoTotOrdine){
      const minOrdine = convertFromEuroToFloat(ordineMinimo);
      if(costoTotOrdine >= minOrdine ){ //se hai raggiunto l ordine minimo abilita i bottoni
         let bottoniOrdinaCollection = document.querySelectorAll('button[title="Devi raggiungere l\'ordine mininimo per ordinare"]');
         for(let currBottone of bottoniOrdinaCollection){
            currBottone.disabled = false;
            currBottone.title = 'Ordina ora';
         }
      }
   }

   //se è il primo articolo aggiungi anche il costo di consegna al totale
   function checkFirstOrder(totaleOrdine){
      if(totaleOrdine === 0){
         totaleOrdine += costoConsegna;
      }

      return totaleOrdine;
   }

   //Vuole il nodo dom in ingresso
   function convertFromEuroToFloat(amount){
      amount = amount.textContent;
      return parseFloat(amount.replace(/[^0-9|,|.]/g, '').replace(',','.')); //elimina tutto tranne numeri e virgola e punto, converte virgola in punto. Converte stringa in numero
   }

})()