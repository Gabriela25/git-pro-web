import { ComponentFixture, TestBed } from '@angular/core/testing';

import  DetailLeadComponent  from './order-detail.component';

describe('DetailLeadComponent', () => {
  let component: DetailLeadComponent;
  let fixture: ComponentFixture<DetailLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
