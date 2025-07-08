import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPersonalFormComponent } from './pro-personal-form.component';

describe('ProPersonalFormComponent', () => {
  let component: ProPersonalFormComponent;
  let fixture: ComponentFixture<ProPersonalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProPersonalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProPersonalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
