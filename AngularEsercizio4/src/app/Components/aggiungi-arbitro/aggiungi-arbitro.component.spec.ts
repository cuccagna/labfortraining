import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiArbitroComponent } from './aggiungi-arbitro.component';

describe('AggiungiArbitroComponent', () => {
  let component: AggiungiArbitroComponent;
  let fixture: ComponentFixture<AggiungiArbitroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggiungiArbitroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiArbitroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
