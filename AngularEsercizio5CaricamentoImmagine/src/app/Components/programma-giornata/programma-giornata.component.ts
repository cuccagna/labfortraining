import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PartitaGiornata } from 'src/app/services/partita-giornata';
import { ProgrammaGiornataService } from 'src/app/services/programma-giornata.service';
import date2String from '../../Utilities/utility';
import { SharedService } from '../../services/shared/sharedService';

/**
 * @title Data table with sorting, pagination, and filtering.
 */

@Component({
  providers:[ProgrammaGiornataService],
  selector: 'app-programma-giornata',
  templateUrl: './programma-giornata.component.html',
  styleUrls: ['./programma-giornata.component.css']
})

export class ProgrammaGiornataComponent implements OnInit{
  displayedColumns: string[] = ['data', 'partita','categoria', 'risultato', 'arbitro', 'voto'];
  dataSource: MatTableDataSource<PartitaGiornata>;
  programmaGiornata: PartitaGiornata[];
  dateToString:any = date2String;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public route: Router, public programmaGiornataService: ProgrammaGiornataService, private sharedService: SharedService) {
    console.log('Sono nel costruttore');
  }

  ngOnInit() {
    console.log('Sono nell" ngOnInit');
    this.setProgrammaGiornata();
  }

    setProgrammaGiornata():void {
     this.programmaGiornataService.getProgrammaGiornata().subscribe((data) => {
                              // Assign the data to the data source for the table to render
                              this.programmaGiornata = data;
                              this.updateData();
                              this.dataSource = new MatTableDataSource(data);
                              this.dataSource.paginator = this.paginator;
                              this.dataSource.sort = this.sort;
                            });
  }

  //Serve nel caso ci sia stata una designazione che ha modificato
  //i dati iniziali. Nota che se sono state fatte più di una designazione
  //solo l'ultima viene aggiornata e le altre sono perdute perchè i dati
  //non sono salvati permanentemente in un database ma sono ricaricati dal Mock.
  //Anche l'ultima designazione viene perduta se faccio un refresh del Componente.
  //Per ovviare dovrei usare il localStorage o un vero database o una PUT
  //su un servizio REST
  private updateData() {
    console.log(this.sharedService.partite)
            console.log(this.sharedService.arbitriDesignati)

    if (this.sharedService.isThereDesignation || this.sharedService.atLeast1DesignationHappened) {
      this.sharedService.isThereDesignation = false;

      let partitaToUpdate: PartitaGiornata;

      this.sharedService.partite.forEach((partita: PartitaGiornata, index) => {
        partitaToUpdate = this.programmaGiornata[partita.id - 1];
        
        if (index === this.sharedService.partite.length - 1) //sono all'ultimo elemento
          if (!this.sharedService.arbitriDesignati || this.sharedService.arbitriDesignati.length - 1 !== index)//controllo necessario perchè potresti non avere scelto l arbitro
            this.sharedService.partite.pop(); //elimino l'ultima partita per cui volevo designare
          else
            partitaToUpdate.arbitro = this.sharedService.arbitriDesignati[index].nome;
        else
          partitaToUpdate.arbitro = this.sharedService.arbitriDesignati[index].nome;
      }) 
    }
  }

  designa(idPartita: any) {
    this.sharedService.isThereDesignation = true;
    this.sharedService.partite.push(this.programmaGiornata[idPartita - 1]);
    this.route.navigate(['arbitri']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
}



