import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPartido } from './buscar-partido';

describe('BuscarPartido', () => {
  let component: BuscarPartido;
  let fixture: ComponentFixture<BuscarPartido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarPartido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarPartido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
