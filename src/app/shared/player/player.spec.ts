import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Player } from './player';

describe('Player', () => {
  let component: Player;
  let fixture: ComponentFixture<Player>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Player]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Player);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
