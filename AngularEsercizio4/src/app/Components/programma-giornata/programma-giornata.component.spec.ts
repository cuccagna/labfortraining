import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammaGiornataComponent } from './programma-giornata.component';

describe('ProgrammaGiornataComponent', () => {
  let component: ProgrammaGiornataComponent;
  let fixture: ComponentFixture<ProgrammaGiornataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammaGiornataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammaGiornataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
