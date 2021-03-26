import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeHeaderComponent } from './Components/home-header/home-header.component';
import { HomeNavbarComponent } from './Components/home-navbar/home-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgrammaGiornataComponent } from './Components/programma-giornata/programma-giornata.component';
import { ArbitriComponent } from './Components/arbitri/arbitri.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ArbitriDialogComponentComponent } from './Components/arbitri-dialog-component/arbitri-dialog-component.component';
import { AggiungiArbitroComponent } from './Components/aggiungi-arbitro/aggiungi-arbitro.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    AppComponent,
    HomeHeaderComponent,
    HomeNavbarComponent,
    ProgrammaGiornataComponent,
    ArbitriComponent,
    ArbitriDialogComponentComponent,
    AggiungiArbitroComponent

  ],
  imports: [
BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ArbitriDialogComponentComponent]
})
export class AppModule { }
