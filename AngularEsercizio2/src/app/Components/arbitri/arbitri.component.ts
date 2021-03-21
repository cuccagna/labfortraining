import { Component, OnInit } from '@angular/core';
import { ArbitriService } from '../../services/arbitri.service';
import { Arbitro } from '../../services/arbitro';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ArbitriDialogComponentComponent } from '../arbitri-dialog-component/arbitri-dialog-component.component';

@Component({
  providers:[ArbitriService],
  selector: 'app-arbitri',
  templateUrl: './arbitri.component.html',
  styleUrls: ['./arbitri.component.css']
})
export class ArbitriComponent implements OnInit {

  arbitri: Arbitro[];
  constructor(private dialog: MatDialog , private arbitriService:ArbitriService){}

  ngOnInit(): void {
    this.setArbitri();
  }

  setArbitri():void {
    this.arbitriService.getArbitri().subscribe((data) => {
      this.arbitri = data;
    });
  }

  openDialog(partiteArbitrate:string[]) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = partiteArbitrate;

    this.dialog.open(ArbitriDialogComponentComponent, dialogConfig);
    }

  path(photoName:string):string {
    return this.arbitriService.pathFoto + photoName;
  }

  pathAvatar(photoName: string): any {
    let value: string = `url(${this.path(photoName)})`
    let styles = {
        'backgroundImage' : value
    };      
    return styles;
  }

}



