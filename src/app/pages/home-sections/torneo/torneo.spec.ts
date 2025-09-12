import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Torneo } from './torneo';

describe('Torneo', () => {
  let component: Torneo;
  let fixture: ComponentFixture<Torneo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Torneo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Torneo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
