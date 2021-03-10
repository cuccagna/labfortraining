import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit {

  
  nome: string ="";
  cognome: string="";
  codiceFiscale: string="";
  about: string = "";
  datiSalvati: string[] = [];

  constructor() { }


  ngOnInit(): void {
  }

  isDisabledTest() {
    //Se hai un campo numerico questo codice forse non funziona
    return !( Object.values(this).every((value)=>!!value) );
  }

  handleSalvaDati() {
    for (let field of Object.values(this))
      if (typeof field === 'string') //questo codice è fragile perchè se aggiungo un campo numerico va refactorized
        this.datiSalvati.push(field);
    
    console.log('Dati salvati: ',this.datiSalvati)
  }
}
