import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitriDialogComponentComponent } from './arbitri-dialog-component.component';

describe('ArbitriDialogComponentComponent', () => {
  let component: ArbitriDialogComponentComponent;
  let fixture: ComponentFixture<ArbitriDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbitriDialogComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitriDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
