import { Component, OnInit } from '@angular/core';
import { ArbitriService } from '../../services/arbitri.service';
import { Arbitro } from '../../services/arbitro';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ArbitriDialogComponentComponent } from '../arbitri-dialog-component/arbitri-dialog-component.component';
import { SharedService } from '../../services/shared/sharedService';
import { ArbitriConfermaDesignazioneDialogComponent } from '../arbitri-conferma-designazione-dialog/arbitri-conferma-designazione-dialog.component';


@Component({
  providers:[ArbitriService],
  selector: 'app-arbitri',
  templateUrl: './arbitri.component.html',
  styleUrls: ['./arbitri.component.css']
})
export class ArbitriComponent implements OnInit {

  arbitri: Arbitro[];
  displayAddReferee: boolean = false;
  displayReferees: boolean = true;
  refereeAdded: (string | number)[];
  alreadyRefereeChoised: boolean = false;

  constructor(private dialog: MatDialog ,private dialogDesigna: MatDialog, private arbitriService:ArbitriService, public sharedService:SharedService){}

  ngOnInit(): void {
    this.setArbitri();
  }

  setArbitri():void {
    this.arbitriService.getArbitri().subscribe((data) => {
      this.arbitri = data;
    });
  }

  onRefereeSubmit(event):void {
    let refereeToAdd:(string|number)[] = event;
    this.arbitri.push(this.parseRefereeAdded(refereeToAdd));
    //inverti la visualizzazione cioè rendi visibili gli arbitri e 
    //cancella il form
    this.displayComponents(true); 
  }

  //QUESTO ANDREBBE MESSO NEL SERVICE
  parseRefereeAdded(refereeToAdd:any[]):Arbitro {
    let newReferee:Arbitro = { id: this.arbitri.length + 1,nome:'',foto:'',sezione:'',categoria:'',anzianita:0,anni:0,mediaVoto:'',partiteArbitrate:[] };
    newReferee.nome = refereeToAdd[0].trim() + " " + refereeToAdd[1].trim();
    newReferee.foto = refereeToAdd[1].trim().toLowerCase() + ".jpg";
    newReferee.sezione = refereeToAdd[2];
    newReferee.categoria = refereeToAdd[3];
    newReferee.anzianita = refereeToAdd[4]
    newReferee.anni = refereeToAdd[5];
    newReferee.mediaVoto = refereeToAdd[6].toString();
    
    let partite = refereeToAdd[7].split('\n');
    //elimino l'ventuale stringa vuota generata da accapo finale
    if (partite[partite.length - 1] === "")
      partite.pop();
    let partiteFormattate = partite.map((item) => {
      let teams = item.split('-');
      return `${teams[0].trim()} - ${teams[1].trim()}`;
    });
    newReferee.partiteArbitrate = partiteFormattate;
    
    return newReferee;
  }

  designa(idArbitro: number) {
    if (this.sharedService.isThereDesignation && !this.alreadyRefereeChoised) {
      this.openDialogConfermaDesignazione(idArbitro);
    }
      
  }

  private openDialogConfermaDesignazione(idArbitro: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { ...this.sharedService.partite[this.sharedService.partite.length-1], nomeArbitro: this.arbitri[idArbitro - 1].nome };
  
    const dialogRef = this.dialogDesigna.open(ArbitriConfermaDesignazioneDialogComponent, dialogConfig);
    
    //result gli viene passato dal metodo close nel DialogCOmponent
    dialogRef.afterClosed().subscribe(result => {
      if (result === "SI"){
        this.sharedService.arbitriDesignati.push(this.arbitri[idArbitro - 1]);
        this.sharedService.atLeast1DesignationHappened = true;
        this.alreadyRefereeChoised = true;
      }
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

  displayComponents(displayCurrentComponent:boolean): void{
        this.displayAddReferee = !displayCurrentComponent;
        this.displayReferees = displayCurrentComponent;

  }

}



