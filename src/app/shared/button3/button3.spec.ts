import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button3 } from './button3';

describe('Button3', () => {
  let component: Button3;
  let fixture: ComponentFixture<Button3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
