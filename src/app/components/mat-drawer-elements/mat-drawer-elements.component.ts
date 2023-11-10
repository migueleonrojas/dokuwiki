import {  Component ,OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { PageService } from 'src/app/services/page/page.service';
import {Location} from '@angular/common';
import { Page } from 'src/app/models/page.model';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { DeletePageResponse } from 'src/app/models/deletePageResponse.model';

@Component({
  selector: 'app-mat-drawer-elements',
  templateUrl: './mat-drawer-elements.component.html',
  styleUrls: ['./mat-drawer-elements.component.css']
})
export class MatDrawerElementsComponent implements OnInit {
  searchFormControl = new FormControl('', [Validators.required]);
  matSide: MatSidenav;
  matSidenavContainer: MatSidenavContainer;
  urlActual:string = '';
  page: Page;
  constructor(
    private sharingService: SharingService,
    private pageService: PageService,
    private router: Router,
    private location: Location,
    
  ) {
   
  }

  

  ngOnInit(): void {

   this.router.events.subscribe((val) => {
    this.urlActual = window.location.pathname; 
    
   });

   this.sharingService.sharingPageObservable.subscribe((page: Page) => {
    this.page = page;
   });

   this.sharingService.sharingSideNavObservable.subscribe((matSidenav:MatSidenav) => {
    this.matSide = matSidenav;
   });

   this.sharingService.sharingSideContainerObservable.subscribe((matSideCont:MatSidenavContainer) => {
    this.matSidenavContainer = matSideCont;
   });

  }

  async search() {

    if (this.searchFormControl.invalid) return;
    
    this.sharingService.sharingQuerySearchObservableData = this.searchFormControl.value;

    this.pageService.getSearchPages(this.searchFormControl.value).subscribe((data:GetSearchPages) => {

      this.sharingService.sharingSearchPagesObservableData = data.pages;

      

    });

    await this.matSide.close();

    this.router.navigate(['page/view-search-page']);

  }

  async closeMatSidenav() {
    await this.matSide.close();
  }

  async toggleMatCont(){

   if(this.matSidenavContainer['_right']['_opened']){
    
    this.matSidenavContainer.close();
    
   }
   else{
    this.matSidenavContainer.open();
    await this.matSide.close();
   }
   
  }

  async goTo(path: string) {
    
   this.router.navigate([`/${path}`]);
   await this.matSide.close();
  }

  async back() {
    
   this.location.back();
   await this.matSide.close();

  }

  async deletePage(id_page: string)  {


   let resultAlert: SweetAlertResult = await Swal.fire({
     title: 'Coloque el titulo de la página para eliminarla',
     input: 'text',
     showCancelButton: true,
     cancelButtonText: 'Cancelar',
     confirmButtonText: 'Eliminar Página',
     showLoaderOnConfirm: true,
     preConfirm: (result) => {
       if (result === this.page.title_page) {
         return true
       }
       else {
         Swal.showValidationMessage(
           `El titulo de la página no es correcto`
         );
       }
     },
     allowOutsideClick: () => !Swal.isLoading()
   });
     
   if (!resultAlert.isConfirmed) return;
     
   
   this.pageService.deletePage(id_page).subscribe({
     next: async (data: DeletePageResponse) =>{
       await Swal.fire({
         position: 'center',
         icon: 'success',
         title: data.message,
         showConfirmButton: false,
         timer: 2500
       });
       this.router.navigate([`/`]);
       await this.matSide.close();

     },
     error: (error: any) => {
       Swal.fire({
         position: 'center',
         icon: 'error',
         title: error.message,
         showConfirmButton: false,
         timer: 2500
       })
     }
     
   })
 }
}
