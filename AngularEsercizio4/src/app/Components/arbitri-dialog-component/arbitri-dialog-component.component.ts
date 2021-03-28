import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-arbitri-dialog-component',
  templateUrl: './arbitri-dialog-component.component.html',
  styleUrls: ['./arbitri-dialog-component.component.css']
})
export class ArbitriDialogComponentComponent implements OnInit {

  partite: string[];
  constructor(private dialogRef: MatDialogRef<ArbitriDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.partite = data;
              }

  ngOnInit(): void {
  }

    close() {
        this.dialogRef.close();
    }
}
