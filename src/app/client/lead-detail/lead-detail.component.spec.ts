import { ComponentFixture, TestBed } from '@angular/core/testing';

import LeadsDetailComponent from './lead-detail.component';

describe('LeadsDetailComponent', () => {
  let component: LeadsDetailComponent;
  let fixture: ComponentFixture<LeadsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
