import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-arbitri-conferma-designazione-dialog',
  templateUrl: './arbitri-conferma-designazione-dialog.component.html',
  styleUrls: ['./arbitri-conferma-designazione-dialog.component.css']
})
export class ArbitriConfermaDesignazioneDialogComponent implements OnInit {
  infoPartitaArbitro: any;

  constructor(private dialogRef: MatDialogRef<ArbitriConfermaDesignazioneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.infoPartitaArbitro = data;
    }

  ngOnInit(): void {
  }

  close(scelta:string) {
        this.dialogRef.close(scelta);
    }

}
