import { Injectable } from "@angular/core";
import { PartitaGiornata } from './partita-giornata';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const programmaGiornataUrl = "https://run.mocky.io/v3/b4c75c1b-3197-4e7e-a70b-c248380a6131";

@Injectable()

export class ProgrammaGiornataService{

   constructor(private http:HttpClient){}

   getProgrammaGiornata(): Observable<PartitaGiornata[]>{
      return this.http.get<PartitaGiornata[]>(programmaGiornataUrl);
   }
}