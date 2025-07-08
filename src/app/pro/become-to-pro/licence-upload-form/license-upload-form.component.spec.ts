import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUploadFormComponent } from './license-upload-form.component';

describe('LicenceUploadFormComponent', () => {
  let component: LicenseUploadFormComponent;
  let fixture: ComponentFixture<LicenseUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseUploadFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LicenseUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
