import { Injectable } from  '@angular/core' ; 

@Injectable ({ 
  providedIn : 'root' , 
}) 
export  class  LocalStorageService { 
  constructor ( ) {} 

  // Establecer un valor en el almacenamiento local 
  setItem ( key : string , value : string ): void { 
    localStorage.setItem (key, value); 
  } 

  // Obtener un valor del almacenamiento local 
  getItem ( key : string ): string | null { 
    return  localStorage.getItem (key); 
  } 

  // Eliminar un valor del almacenamiento local 
  removeItem ( key : string ): void { 
    localStorage . removeItem (key); 
  } 

  // Borrar todos los elementos del almacenamiento local 
  clear (): void { 
    localStorage . clear (); 
  } 
}