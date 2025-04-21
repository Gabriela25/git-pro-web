
import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

import { ComunicationService } from '../../services/comunication.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { CategoryService } from '../../services/category.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxMaskDirective } from 'ngx-mask';
import { ZipcodeService } from '../../services/zipcode.service';
import { Category } from '../../interface/category.interface';
import { Zipcode } from '../../interface/zipcode.interface';
import { User } from '../../interface/user.interface';
import { Profile } from '../../interface/profile.interface';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UploadsService } from '../../services/uploads.service';
import { SocketComponent } from "../../shared/socket/socket.component";
import { CapitalizeFirstDirective } from '../../shared/directives/capitalize-first.directive';
import { NoWhitespaceDirective } from '../../shared/directives/no-whitespace';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { environment } from '../../../environments/environment';
import { Image } from '../../interface/image.interface';
import { limit } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';
@Component({
  selector: 'app-become-to-pro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    ModalComponent,
    CapitalizeFirstDirective,
    NoWhitespaceDirective,
    NgMultiSelectDropDownModule,
    FloatingAlertComponent

  ],
  templateUrl: './become-to-pro.component.html',
  styleUrl: './become-to-pro.component.css'
})
export default class BecomeToProComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;

  value: boolean = false;
  licenses: boolean = false;
  selectedFilePersonal: File | null = null;

  listCategories: Array<Category> = [];
  listServicesPro: Array<any> = [];
  listZipcode: Array<Zipcode> = [];
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  proPersonalForm: FormGroup;
  proBusinessForm: FormGroup;
  currentStep: number = 1;
  isSelectOption: string = 'isPersonal';
  showOptsPro: boolean = true;
  showBusinessTab: boolean = false;
  onSelect: boolean = false;
  profileForm!: FormGroup;

  imagePersonal: string = '';
  imageBusiness: string = '';
  isUserProPersonal: boolean = false;
  previewImgPersonal: string | ArrayBuffer | null = null;
  previewImgBusiness: string | ArrayBuffer | null = null;
  isBusiness: boolean = false;
  isNext: boolean = false;
  isDisabled: boolean = false;
  previewImg: string | ArrayBuffer | null = null;
  @ViewChild('fileInputPersonal') fileInputPersonal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputBusiness') fileInputBusiness!: ElementRef<HTMLInputElement>;
  selectedFileBusiness: File | null = null;
  base64Image: string | null = null;
  user: User = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    profile: {
      id: '',
      categories: [],
      zipcodeId: '',
      address: '',
      imagePersonal: '',
      introduction: '',

      isBusiness: false
    }
  }
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  urlUploads = environment.urlUploads;
  listImages: Array<Image> =[];
  filesLicences: File[] = [];
  previews: string[] = [];
  errorMessage: string = '';
  imagesToDelete :Array<Image> =[]
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private zipCodeService: ZipcodeService,
    private userService: UserService,
    private uploadsService: UploadsService,
    private authService: AuthService
  ) {
    this.proPersonalForm = this.initializeProPersonalForm();
    this.proBusinessForm = this.initializeProBusinessForm();

  }
  ngOnInit(): void {
    this.loadInitialData();
    this.checkUserProfile();


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      limitSelection:3
    };


  }
  onItemSelect(item: any) {

  }
  onSelectAll(items: any) {

  }
  initializeProPersonalForm(): FormGroup {
    return this.fb.group({
      categories: new FormControl([], [Validators.required]),
      licenses: new FormControl(null,),
      zipcode: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      imagePersonal: new FormControl('', [Validators.required]),
      introduction: new FormControl('')
    });
  }


  initializeProBusinessForm(): FormGroup {
    return this.fb.group({
      nameBusiness: new FormControl('', [Validators.required]),
      yearFounded: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      numberOfemployees: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      imageBusiness: new FormControl('', [Validators.required]),
    });
  }
  validateNumber(event: KeyboardEvent): void {
    const charCode = event.keyCode ? event.keyCode : event.which;
    if ((charCode < 48 || charCode > 57) && charCode !== 8 && charCode !== 9) {
      event.preventDefault();
    }
  }
  loadInitialData() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => this.listCategories = response.categories,
      error: (error) => console.error(error)
    });
    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => this.listZipcode = response.zipcodes,
      error: (error) => console.error(error)
    });

  }
  initializeUser(): User {
    return {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      profile: {
        id: '',
        categories: [],
        zipcodeId: '',
        address: '',
        imagePersonal: '',
        introduction: '',
        isBusiness: false
      }
    };
  }
  checkUserProfile() {
    this.userService.getMe().subscribe({
      next: (response) => {
        this.user = response.user;
        this.populateUserProfile()
      },
      error: (error) => console.error(error)
    });
  }
  populateUserProfile() {

    if (this.user.profile) {
      //asignamos si el perfil es personal o business
      this.isUserProPersonal = this.user.profile.isBusiness!;
    
      this.imagePersonal = `${this.urlUploads}${this.user.profile.imagePersonal}`;

      this.proPersonalForm.patchValue({
        categories: this.user.profile.categories,
        zipcode:this.user.profile.zipcodeId,
        address:this.user.profile.address,
        imagePersonal: `${this.urlUploads}${this.user.profile.imagePersonal}`,
        introduction: this.user.profile.introduction
      });
      if (this.user.profile.isBusiness) {
        this.isSelectOption = 'isBusiness';
        this.isDisabled = true;

        this.imageBusiness = `${this.urlUploads}${this.user.profile.imageBusiness}`;
        this.proBusinessForm.patchValue({
          imageBusiness : `${this.urlUploads}${this.user.profile.imageBusiness}`,
          nameBusiness: this.user.profile.nameBusiness,
          yearFounded: this.user.profile.yearFounded,
          numberOfemployees: this.user.profile.numberOfemployees
        });
      }
      this.checkLicences(this.user.profile.id!)
    } else {
      this.openModalOnPageLoad();
    }
  }
  openModalOnPageLoad() {
    if (this.modal) {
      this.modal.open();
    }
  }
  checkLicences(profileId:string){
    this.userService.getLicense(profileId).subscribe({
      next: (response) => {
       
        this.listImages = response.images
      },
      error: (error) => console.error(error)
    });
  }
  onRadioChange(event: Event) {
    this.onSelect = true;
    const target = event.target as HTMLInputElement;
    this.isSelectOption = target.value;
    if (this.isSelectOption === 'isBusiness') {
      this.isUserProPersonal = false;
      this.showBusinessTab = this.isSelectOption === 'isBusiness';
    }
    else {
      this.isUserProPersonal = true;
      //this.currentStep = 1;
    }
  }
  onAccept() {
    console.log('clieck del boton')

    console.log(this.showBusinessTab)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = reader.result as string;
          //base64 para vista previa de la imagen
          if (input.id == 'imagePersonal') {
            this.previewImgPersonal = e.target.result;
            //se setea el base64, para el campo del formulario
            this.proPersonalForm.get('imagePersonal')?.setValue(base64String);
            this.selectedFilePersonal = file;
          }
          else {
            this.previewImgBusiness = e.target.result;
            //se setea el base64, para el campo del formulario
            this.proBusinessForm.get('imageBusiness')?.setValue(base64String);
            this.selectedFileBusiness = file;
          }

        }
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInputP(): void {
    this.fileInputPersonal.nativeElement.click();
  }
  triggerFileInputB(): void {
    this.fileInputBusiness.nativeElement.click();
  }
 
  previousStep() {
    this.isNext = false;

  }
  nextStep() {
    this.validatedFormPersonal()

  }
  validatedFormPersonal() {
    this.proPersonalForm.markAllAsTouched();
    if (this.proPersonalForm.invalid) {
      return;
    }
    this.isNext = true;

  }
  goToStep(step: number) {
    if (step == 2) {
      this.validatedFormPersonal()
    }
    else if (step == 1) {
      this.currentStep = step;
    }
  }
  async onSubmit() {
    this.proPersonalForm.markAllAsTouched();
    this.proBusinessForm.markAllAsTouched();
  
    const isFirstTime = !this.user.profile || !this.user.profile.id;
    const isEditingPersonal = this.isSelectOption === 'isPersonal' && !this.isNext;
    const isEditingBusiness = this.isSelectOption === 'isBusiness' && this.isNext;
  
    // Imagenes
    const nameImage = this.selectedFilePersonal ? await this.uploadImageWithFile(this.selectedFilePersonal) : '';
    const nameImageBusiness = this.selectedFileBusiness ? await this.uploadImageWithFile(this.selectedFileBusiness) : '';
  
    if (isEditingPersonal && this.proPersonalForm.valid) {
      const profile = this.buildProfile(false, nameImage, '', false);
      
      if (isFirstTime) {
        this.handleProfileSubmit(profile);
      } else if (!this.proBusinessForm.valid) {
     
        if (!nameImage) {
          profile.imagePersonal = this.user.profile?.imagePersonal;
         
        }
        this.handleProfileEdit(profile);
      }
  
      await this.handleUploadsAndDeletes();
    }
  
    if (isEditingBusiness && this.proBusinessForm.valid) {
      const profile = this.buildProfile(true, nameImage, nameImageBusiness, isFirstTime);
  
      if (!nameImage) profile.imagePersonal = this.user.profile?.imagePersonal;
      if (!nameImageBusiness) profile.imageBusiness = this.user.profile?.imageBusiness;
  
      if (isFirstTime) {
        this.handleProfileSubmit(profile);
      } else {
        this.handleProfileEdit(profile);
      }
  
      await this.handleUploadsAndDeletes();
      this.isDisabled = true;
    }
  
    this.selectedFilePersonal = null;
    this.selectedFileBusiness = null;
  }
  
  private async uploadImageWithFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return await this.uploadImage(formData);
  }
  
  private buildProfile(
    isBusiness: boolean,
    nameImage: string,
    nameImageBusiness: string,
    isFirstTime: boolean
  ): Profile {
    const personalValues = this.proPersonalForm.value;
    const businessValues = this.proBusinessForm.value;
  
    return {
      categories: personalValues.categories.map((c: any) => c.id),
      zipcodeId: personalValues.zipcode || '',
      address: personalValues.address || '',
      imagePersonal: nameImage || '',
      introduction: personalValues.introduction || '',
      isBusiness,
      available: true,
      ...(isBusiness && {
        nameBusiness: businessValues.nameBusiness || '',
        yearFounded: businessValues.yearFounded || '',
        numberOfemployees: businessValues.numberOfemployees || '',
        imageBusiness: nameImageBusiness || ''
      })
    };
  }
  
  private handleProfileSubmit(profile: Profile) {
    this.userService.becomeToPro(profile).subscribe({
      next: (response) => {
        this.user.profile = response.profile;
        this.handleSuccessfulSubmission(response);
        this.authService.updateUser('available', true);
        this.authService.updateUser('isPro', true);
        console.log(response.profile.imagePersonal)
        if (response.profile.imagePersonal) {
          this.authService.updateUser('imagePersonal', response.profile.imagePersonal);
        }
      },
      error: (error) => this.handleError(error)
    });
  }
  
  private handleProfileEdit(profile: Profile) {
    this.userService.putMe({ ...this.user, profile }).subscribe({
      next: (response) => {
        if (response.user.profile?.imagePersonal) {
          this.authService.updateUser('imagePersonal', response.user.profile.imagePersonal);
        }
        this.authService.updateUser('available', response.user.profile?.available);
        this.handleSuccessfulSubmission(response);
      },
      error: (error) => this.handleError(error)
    });
  }
  
  private async handleUploadsAndDeletes() {
    if (this.imagesToDelete.length > 0) {
      this.deletedLicenses(this.imagesToDelete);
    }
    if (this.filesLicences) {
      this.uploadLicenses();
    }
  }
  
  
  openFileSelector(fileInput: HTMLInputElement) {
    fileInput.click();
  }
  onFileSelected1(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
    
      if (this.listImages.length+this.previews.length + files.length > 3) {
        this.errorMessage = 'You can only upload a maximum of 3 images.';
        return;
      }

      this.errorMessage = ''; 
      
      files.forEach(file => {
        this.filesLicences.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }
  
  removeImage(index: number) {
    this.previews.splice(index, 1);
  }
  removeExistingImage(index: number) {
    // Puedes eliminarlas del array o marcarlas para borrar
    const removed = this.listImages.splice(index, 1);
    this.imagesToDelete.push(removed[0]); 
  }

  deletedLicenses( imagesToDelete: Image[]) {   
    for(const imgId of imagesToDelete){
      this.userService.deletedLicenses(imgId.id!).subscribe({
        next: (response) => {
          console.log(response)
          
        },
        error: (error) => {
          console.error('Error al eliminar el archivo');
        },
      })
    }  
  }
  async uploadLicenses(){
    const files = [
      { file: this.filesLicences[0], key: 'imageName1' },
      { file: this.filesLicences[1], key: 'imageName2' },
      { file: this.filesLicences[2], key: 'imageName3' },
    ]
    for (const fileData of files) { 
      if (fileData.file) {
        const formData = new FormData();
        formData.append('file', fileData.file);
        try {
          const nameImage = await this.uploadImage(formData);
         
          if (nameImage) {
            const data = {
              name: nameImage
            }
            this.userService.postLicenses(data).subscribe({
              next: (response) => {
                console.log(response)   
              },
              error: (error) => {
                console.error('Error al eliminar el archivo');
              },
            })
          }
        } catch (error) {
          console.error(`Error asignando la URL para ${fileData.key}:`, error);
        }
      }
    }
  }
  /*uploadImage(file: File, isBusiness: boolean) {

    const formData = new FormData();
    formData.append('model', 'profile');
    formData.append('idModel', '');
    formData.append('field', isBusiness ? 'imageBusiness' : 'imagePersonal');
    formData.append('file', file);

    this.uploadsService.postUploads(formData).subscribe({
      next: (response) => {

        if (response.uploads.urlImage) {
          if (this.selectedFilePersonal != null) {
            this.authService.updateUser('imagePersonal', `${response.uploads.urlImage}`);
            this.selectedFilePersonal = null
          }
        }
      },
      error: (error) => this.handleError(error)
    });
  }*/
  async uploadImage(formData: FormData): Promise<string> {
    
    try {
      const response = await this.uploadsService.postUploadsImageAll(formData).toPromise();
      return response!.fileName; 
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      return 'Error al subir el archivo'; 
    }
  }
  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'Profile updated successfully';
    this.isLoading = false;
   
  }

  handleError(error: any) {
    this.alertMessage = 'alert-danger';
    this.backendMessage = error.error.message || 'An error occurred';
    this.isLoading = false;
   
  }
  
  

}


