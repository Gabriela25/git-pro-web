import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBusinessFormComponent } from './pro-business-form.component';

describe('ProBusinessFormComponent', () => {
  let component: ProBusinessFormComponent;
  let fixture: ComponentFixture<ProBusinessFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProBusinessFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProBusinessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
