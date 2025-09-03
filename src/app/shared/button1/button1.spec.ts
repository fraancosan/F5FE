import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button1 } from './button1';

describe('Button1', () => {
  let component: Button1;
  let fixture: ComponentFixture<Button1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
