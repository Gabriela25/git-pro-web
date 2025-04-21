import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingAlertComponent } from './floating-alert.component';

describe('FloatingAlertComponent', () => {
  let component: FloatingAlertComponent;
  let fixture: ComponentFixture<FloatingAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FloatingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
