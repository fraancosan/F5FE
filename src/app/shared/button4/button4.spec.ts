import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button4 } from './button4';

describe('Button4', () => {
  let component: Button4;
  let fixture: ComponentFixture<Button4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
