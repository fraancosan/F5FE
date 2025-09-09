import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMenu } from './card-menu';

describe('CardMenu', () => {
  let component: CardMenu;
  let fixture: ComponentFixture<CardMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
