import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Muro } from './muro';

describe('Muro', () => {
  let component: Muro;
  let fixture: ComponentFixture<Muro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Muro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Muro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
