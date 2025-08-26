import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reserva } from './reserva';

describe('Reserva', () => {
  let component: Reserva;
  let fixture: ComponentFixture<Reserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reserva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
