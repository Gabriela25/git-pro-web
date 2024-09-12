import { ComponentFixture, TestBed } from '@angular/core/testing';

import BecomeToProComponent from './become-to-pro.component';

describe('BecomeToProComponent', () => {
  let component: BecomeToProComponent;
  let fixture: ComponentFixture<BecomeToProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeToProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BecomeToProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
