import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitriConfermaDesignazioneDialogComponent } from './arbitri-conferma-designazione-dialog.component';

describe('ArbitriConfermaDesignazioneDialogComponent', () => {
  let component: ArbitriConfermaDesignazioneDialogComponent;
  let fixture: ComponentFixture<ArbitriConfermaDesignazioneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbitriConfermaDesignazioneDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitriConfermaDesignazioneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
