(function(){
   let observer = new MutationObserver(gestoreMutazione);
   observer.observe(document.getElementById('ristoranti'),{childList:true});
})();

//Qui ascolto se in section vengono aggiunti dei nodi figli
//quindi viene chiamato il gestore quando cioò accade. E quando accade
//aggiungo l'evento click che rende cliccabili i vari article
//USO EVENT DELEGATION per gestire il click sugli articoli
 function gestoreMutazione(mutationRecords){
   let noRestaurantFound = true;
   for(let i=0; i<mutationRecords.length ; i++){
      
      for(let mtrAddN = mutationRecords[i].addedNodes,j=0 ; j<mtrAddN.length ;j++ ){
         if(mtrAddN[j].nodeName.toLowerCase() === 'article'){
            noRestaurantFound=false;
            break;
         }
      }
      if(!noRestaurantFound)
         break;
   }


    let footer = document.querySelector('footer.content-header-footer');
   // let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
   // //let scrollTopPosition = window.pageYOffset || window.scrollY || document.body.scrollTop || document.documentElement.scrollTop;
   //let footerDistanceToTopViewport = footer.getBoundingClientRect().top + scrollTopPosition;

   if(noRestaurantFound){ //non ci sono articoli
      footer.className = 'nessun-ristorante-footer';
   }

   //offsetHeight torna l'altezza del footer compreso padding e bordi (e scrollbar)
   // if((footer.offsetTop + footer.offsetHeight) < viewportHeight){ //nessun articolo aggiunto per cui non sono stati trovati ristoranti vicini oppure anche se c'è un articolo o due il footer sta più in alto della fine della pagina
   //    footer.className = 'nessun-ristorante-footer';
   // }
   
      let section = document.getElementById('ristoranti');
      if(section){
         section.addEventListener("click",(ev)=>{
            if(section.contains(ev.target)){
               let article = retrieveArticle(ev.target);
               let new_window=window.open(article.dataset.indirizzo,'ristorante_specifico');
               new_window.focus();
               window.close();
            }
               
         })
      }
   
}

function retrieveArticle(n){
   if(n.nodeName.toLowerCase() === 'article')
      return n;

      return retrieveArticle(n.parentNode);
   
}