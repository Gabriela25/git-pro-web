import { ComponentFixture, TestBed } from '@angular/core/testing';

import  ProCategoriesFormComponent  from './pro-categories-form.component';

describe('ProCategoriesFormComponent', () => {
  let component: ProCategoriesFormComponent;
  let fixture: ComponentFixture<ProCategoriesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProCategoriesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProCategoriesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
