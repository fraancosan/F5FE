import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button5 } from './button5';

describe('Button5', () => {
  let component: Button5;
  let fixture: ComponentFixture<Button5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
