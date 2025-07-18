import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPaymentComponent } from './category-payment.component';

describe('CategoryPaymentComponent', () => {
  let component: CategoryPaymentComponent;
  let fixture: ComponentFixture<CategoryPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
