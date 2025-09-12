import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEquipo } from './crear-equipo';

describe('CrearEquipo', () => {
  let component: CrearEquipo;
  let fixture: ComponentFixture<CrearEquipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEquipo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEquipo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
