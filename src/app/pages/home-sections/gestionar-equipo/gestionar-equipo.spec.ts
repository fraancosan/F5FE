import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEquipo } from './gestionar-equipo';

describe('GestionarEquipo', () => {
  let component: GestionarEquipo;
  let fixture: ComponentFixture<GestionarEquipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEquipo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarEquipo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
