import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitriComponent } from './arbitri.component';

describe('ArbitriComponent', () => {
  let component: ArbitriComponent;
  let fixture: ComponentFixture<ArbitriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbitriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
