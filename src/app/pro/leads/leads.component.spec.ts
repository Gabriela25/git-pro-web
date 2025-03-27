import { ComponentFixture, TestBed } from '@angular/core/testing';

import  GetLeadsComponent  from './leads.component';

describe('GetLeadsComponent', () => {
  let component: GetLeadsComponent;
  let fixture: ComponentFixture<GetLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetLeadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
