import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button2 } from './button2';

describe('Button2', () => {
  let component: Button2;
  let fixture: ComponentFixture<Button2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
