import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page/page.service';
import { CategoryService } from 'src/app/services/category/category.service'
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import { DateExactly } from 'src/app/pipes/date.pipe';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CreateCategoryResponse } from 'src/app/models/createCategoryResponse.model';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from 'src/app/models/category';
import { GetAllCategoryResponse } from 'src/app/models/getAllCategoryResponse';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { GetPagesByCategory } from 'src/app/models/getPagesByCategory';
import { ModifyCategoryResponse } from 'src/app/models/modifyCategoryResponse.model';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-view-all-pages',
  templateUrl: './view-all-pages.component.html',
  styleUrls: ['./view-all-pages.component.css']
})
export class ViewAllPagesComponent implements AfterViewInit   {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ['id', 'title_page', 'username', 'creation_date', 'modification_date', 'type_of_page', 'category','options'];
  dataToDisplay: Page[] = [];
  dataSource: MatTableDataSource<Page>;
  loadingData: boolean = true;
  categories: Category[] = [];
  auxCategories: Category[] = [];
  mobileQuery: MediaQueryList;
  
  constructor(
    private pageService: PageService,
    private categoryService: CategoryService,
    private router: Router,
    private sharingService: SharingService,
    private dateExactly: DateExactly,
    private datePipe:DatePipe,
    private cdref: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1500px)');
   this._mobileQueryListener = () => changeDetectorRef.detectChanges();
   this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }
  
  private _mobileQueryListener: () => void;

  ngAfterViewInit() {

     
     this.sharingService.sharingPageObservableData = {
      id_page: '',
      username: '',
      contents_html: '',
      contents_user: '',
      title_page: '',
      type_of_page: '',
      creation_date: null,
      modification_date: null
     }; 

     this.categoryService.getAllCategories().subscribe((data:GetAllCategoryResponse) => {
      this.categories= data.categories;
      this.auxCategories = data.categories;
     });
    
    this.pageService.getAllPages().subscribe(
      (data: GetAllPages) => {
        this.dataSource = new MatTableDataSource(data.pages);
        
        if (this.paginator) {
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data: Page, filter: string) => {

           if (data.id_page.toLowerCase().includes(filter.toLowerCase())) {
            return true;
           }
            
            if (data.title_page.toLowerCase().includes(filter.toLowerCase())) {
              return true;
            }

            if (data.username.toLowerCase().includes(filter.toLowerCase())) {
              return true;
            }

            if(data.category.toLowerCase().includes(filter.toLowerCase())){
              return true;
            }

            if(data.type_of_page.toLowerCase().includes(filter.toLowerCase())){
             return true;
           }



            if ( this.datePipe.transform(this.dateExactly.transform(data.creation_date.toString()).toString(), 'dd/MM/yyyy hh:mm:ss a').toLowerCase().includes(filter.toLowerCase()) ) {
              return true;
            }

            if ( this.datePipe.transform(this.dateExactly.transform(data.modification_date.toString()).toString(), 'dd/MM/yyyy hh:mm:ss a').toLowerCase().includes(filter.toLowerCase())) {
              return true;
            }
          }
        }
        
      },
      
    );
    this.loadingData = false;
    this.cdref.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchCategory(event:Event) {
   const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
   this.categories = this.auxCategories;
   this.categories = this.categories.filter(el => el.name_category.toLocaleLowerCase().includes(filterValue));

  }
  


  view(page: Page) {

    this.sharingService.sharingPageObservableData = page;
    
    this.router.navigate(['page/view-page']);
  }

  viewPageByCategory(category:string){

   this.pageService.getPagesByCategory(category).subscribe((data:GetPagesByCategory) => {

    this.sharingService.sharingPagesObservableData = data.pages;

    this.router.navigate(['/page/view-search-page']);
   });


  }

  async modifyCategory(category:Category){

   let resultAlertConfirm: SweetAlertResult = await Swal.fire({
    title: 'Coloque el nombre de la categoría para confirmar su modificación',
    input: 'text',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Modificar Categoría',
    showLoaderOnConfirm: true,

     preConfirm: async (result: string)  => {
     
     if (result === '') {
      Swal.showValidationMessage(
       `El nombre de la categoría esta vacio`
      );
      return false;
     }   


     if(result.trim() !== category.name_category){
      Swal.showValidationMessage(
       `El nombre de la categoría no coincide`
      );
      return false;
     }

     return true;

    },
    allowOutsideClick: () => !Swal.isLoading()
   });

   if(!resultAlertConfirm.isConfirmed){

    return;
   }


   let resultAlertSetNewNameCategory: SweetAlertResult = await Swal.fire({
    title: 'Coloque el nuevo nombre que desea asignarle a la categoría.\nNota: Las páginas que tienen asignada la categoría que se esta modificando también se modificaran.',
    input: 'text',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Asignar nuevo nombre',
    showLoaderOnConfirm: true,

     preConfirm: async (result: string)  => {
     
     if (result === '') {
      Swal.showValidationMessage(
       `El nuevo nombre de la categoría esta vacio`
      );
      return false;
     }   

     return firstValueFrom(
      this.categoryService.modifyCategory({
       id_category: category.id_category,
       name_category: category.name_category,
       new_name_category: result
      })
     )
     .then( async (data:CreateCategoryResponse)  => {
      await Swal.fire({
       position: 'center',
       icon: 'success',
       title: data.message,
       showConfirmButton: false,
       timer: 2500
      });

      this.ngAfterViewInit();
      
     })
     .catch((err:HttpErrorResponse) => {
      Swal.showValidationMessage(
       err.error.message
      );
     });

    },
    allowOutsideClick: () => !Swal.isLoading()
   });

  }


  async deleteCategory(category:Category){
   let resultAlertConfirm: SweetAlertResult = await Swal.fire({
    title: 'Coloque el nombre de la categoría para confirmar su eliminación\nNota: Solo se eliminará la categoría si no ha sido asignada a ninguna página.',
    input: 'text',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Eliminar Categoría',
    showLoaderOnConfirm: true,

     preConfirm: async (result: string)  => {
     
     if (result === '') {
      Swal.showValidationMessage(
       `El nombre de la categoría esta vacio`
      );
      return false;
     }   


     if(result.trim() !== category.name_category){
      Swal.showValidationMessage(
       `El nombre de la categoría no coincide`
      );
      return false;
     }

     return firstValueFrom(
      this.categoryService.deleteCategory(category.name_category)
     )
     .then( async (data:CreateCategoryResponse)  => {
      await Swal.fire({
       position: 'center',
       icon: 'success',
       title: data.message,
       showConfirmButton: false,
       timer: 2500
      });

      this.ngAfterViewInit();
      
     })
     .catch((err:HttpErrorResponse) => {
      Swal.showValidationMessage(
       err.error.message
      );
     });

    },
    allowOutsideClick: () => !Swal.isLoading()
   });

   if(!resultAlertConfirm.isConfirmed){

    return;
   }

   return;
   let resultAlertDeleteNewNameCategory: SweetAlertResult = await Swal.fire({
    title: 'Coloque el nuevo nombre que desea asignarle a la categoría.\nNota: Las páginas que poseen la categoría que se esta modificando tambien cambiará su valor.',
    input: 'text',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Asignar nuevo nombre',
    showLoaderOnConfirm: true,

     preConfirm: async (result: string)  => {
     
     if (result === '') {
      Swal.showValidationMessage(
       `El nuevo nombre de la categoría esta vacio`
      );
      return false;
     }   

     return firstValueFrom(
      this.categoryService.modifyCategory({
       id_category: category.id_category,
       name_category: category.name_category,
       new_name_category: result
      })
     )
     .then( async (data:CreateCategoryResponse)  => {
      await Swal.fire({
       position: 'center',
       icon: 'success',
       title: data.message,
       showConfirmButton: false,
       timer: 2500
      });

      this.ngAfterViewInit();
      
     })
     .catch((err:HttpErrorResponse) => {
      Swal.showValidationMessage(
       err.error.message
      );
     });

    },
    allowOutsideClick: () => !Swal.isLoading()
   });
  }
  

  addPage() {
   this.router.navigate(['/page/create-page']);
  }


  async addCategory(){

   

   let resultAlert: SweetAlertResult = await Swal.fire({
    title: 'Coloque el nombre de la categoría a crear',
    input: 'text',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Crear Categoría',
    showLoaderOnConfirm: true,

     preConfirm: async (result: string)  => {
     
     if (result === '') {
      Swal.showValidationMessage(
       `El nombre de la categoría esta vacio`
      );
      return;
     }
     if(result.length > 100){
      Swal.showValidationMessage(
       `El nombre de la categoría debe contener como máximo 100 letras`
      );
      return;

     }

      return firstValueFrom(
       this.categoryService.createCategory({
        name_category:result.trim()
       })
      )
      .then( async (data:CreateCategoryResponse)  => {
       await Swal.fire({
        position: 'center',
        icon: 'success',
        title: data.message,
        showConfirmButton: false,
        timer: 2500
       });
       this.categoryService.getAllCategories().subscribe((data:GetAllCategoryResponse) => {
        this.categories= data.categories;
       });
      })
      .catch((err:HttpErrorResponse) => {
       Swal.showValidationMessage(
        err.error.message
       );
      });  
    },
    allowOutsideClick: () => !Swal.isLoading()
   });

  }

}
