import { Injectable } from "@angular/core";
import { Arbitro } from "../arbitro";
import { PartitaGiornata } from "../partita-giornata";


@Injectable({
  providedIn: 'root'
})

export class SharedService{
   isThereDesignation: boolean = false;
   atLeast1DesignationHappened:boolean = false
   partite: PartitaGiornata[]=[];
  arbitriDesignati: Arbitro[] = [];
  
  constructor() {
    console.log("sharedService called")
  }

}