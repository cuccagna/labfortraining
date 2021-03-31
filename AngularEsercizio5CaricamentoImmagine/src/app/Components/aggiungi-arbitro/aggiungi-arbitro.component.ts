import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-aggiungi-arbitro',
  templateUrl: './aggiungi-arbitro.component.html',
  styleUrls: ['./aggiungi-arbitro.component.css']
})
export class AggiungiArbitroComponent implements OnInit {

  @Output() addReferree: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();

  refereeForm: FormGroup;
  name = new FormControl('',[Validators.required]);
  surname = new FormControl('',[Validators.required]);
  sezione = new FormControl('',[Validators.required]);
  categoria = new FormControl('',[Validators.required]);
  anzianita = new FormControl('',[Validators.required,Validators.min(1),Validators.max(32)]);
  anni = new FormControl('',[Validators.required,Validators.min(16),Validators.max(47)]);
  mediaVoto = new FormControl('',[Validators.required,Validators.pattern('^(0|(8(\.[0-9][0-9]?)?))$')]);
  partiteArbitrate = new FormControl('',[Validators.pattern('^([a-zA-z]{2,} *- *[a-zA-z]{2,}\n)*(([a-zA-z]{2,} *- *[a-zA-z]{2,}(\n)?){1})$')]);



  constructor(fb: FormBuilder) {
    this.refereeForm = fb.group({
        name: this.name,
        surname: this.surname,
        sezione: this.sezione,
        categoria: this.categoria,
        anzianita: this.anzianita,
        anni: this.anni,
        mediaVoto: this.mediaVoto,
        partiteArbitrate: this.partiteArbitrate
    });
  }

  ngOnInit(): void {
  }

  getAnzianitaErrorMessage() {
    if (this.anzianita.hasError('required'))
      return 'Devi specificare gli anni di tessera';
    
    let erroreMessage = this.anzianita.hasError('min') ? 'Minimo un anno di tessera' : 'Massimo 32 anni di tessera';
    return erroreMessage;
  }

  getAnniErrorMessage() {
    if (this.anni.hasError('required'))
      return 'Devi specificare l\'età';
    
    let erroreMessage = this.anni.hasError('min') ? 'Minimo 16 anni' : 'Massimo 47 anni';
    return erroreMessage;
  }

  onRefereeSubmit() {
    let refereeInserted:(string|number)[] = [];

    let refereeFormGroup = this.refereeForm.controls;

    for (let field in refereeFormGroup) 
      refereeInserted.push(refereeFormGroup[field].value);
    

    this.addReferree.emit(refereeInserted);
  }

}
