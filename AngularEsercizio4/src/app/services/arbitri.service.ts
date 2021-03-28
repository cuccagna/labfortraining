import { Injectable } from "@angular/core";
import { Arbitro } from './arbitro';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const programmaGiornataUrl = "https://run.mocky.io/v3/1de704cf-2172-45f7-9729-ae4f3e444a66";
const PATH_FOTO = "../../../assets/immagini/";

@Injectable()

export class ArbitriService{
   pathFoto = PATH_FOTO;

   constructor(private http:HttpClient){}

   getArbitri(): Observable<Arbitro[]>{
      return this.http.get<Arbitro[]>(programmaGiornataUrl);
   }
}