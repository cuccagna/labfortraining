import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArbitriComponent } from './Components/arbitri/arbitri.component';
import { ProgrammaGiornataComponent } from './Components/programma-giornata/programma-giornata.component';
  

const routes: Routes = [
  { path: '', component: ProgrammaGiornataComponent },
  { path: 'arbitri', component: ArbitriComponent }
    

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
