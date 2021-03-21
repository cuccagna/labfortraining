import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PartitaGiornata } from 'src/app/services/partita-giornata';
import { ProgrammaGiornataService } from 'src/app/services/programma-giornata.service';
import date2String from '../../Utilities/utility';

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

  constructor(public programmaGiornataService:ProgrammaGiornataService){}

  ngOnInit() {
    this.setProgrammaGiornata();
  }

    setProgrammaGiornata():void {
     this.programmaGiornataService.getProgrammaGiornata().subscribe((data) => {
                              // Assign the data to the data source for the table to render
                              this.programmaGiornata = data;
                              this.dataSource = new MatTableDataSource(data);
                              this.dataSource.paginator = this.paginator;
                              this.dataSource.sort = this.sort;
                            });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
}



