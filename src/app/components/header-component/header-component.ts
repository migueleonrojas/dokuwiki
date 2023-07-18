import { Component, HostListener, OnInit } from '@angular/core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { SharingService } from 'src/app/core/services/sharing.service';
import { PageService } from 'src/app/services/page/page.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {Location} from '@angular/common';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { Page } from 'src/app/models/page.model';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { DeletePageResponse } from 'src/app/models/deletePageResponse.model';


@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  page: Page;
  faClipboard = faClipboard;
  searchFormControl = new FormControl('', [Validators.required]);
  matSide: MatSidenav;
  matSidenavContainer: MatSidenavContainer;
  urlActual:string = '';
  constructor(
    private sharingService: SharingService,
    private pageService:PageService,
    private router: Router,
    private location: Location,
  ) { }
  
  

  ngOnInit() {
   
   this.router.events.subscribe((val) => {
    this.urlActual = window.location.pathname; 
    
   });
   this.sharingService.sharingPageObservable.subscribe((page: Page) => {
    this.page = page;
    
   });
    
    this.sharingService.sharingSideNavObservable.subscribe((matSidenav:MatSidenav) => {
      this.matSide = matSidenav;
    })

    this.sharingService.sharingSideContainerObservable.subscribe((matSideCont:MatSidenavContainer) => {
     this.matSidenavContainer = matSideCont;
    });
  }

  

  search() {

    if (this.searchFormControl.invalid) return;
    
    this.sharingService.sharingQuerySearchObservableData = this.searchFormControl.value;

    this.pageService.getSearchPages(this.searchFormControl.value).subscribe((data:GetSearchPages) => {

      this.sharingService.sharingPagesObservableData = data.pages;

    });

    this.router.navigate(['/page/view-search-page']);

  }

  async toggleMatCont(){

   if(this.matSidenavContainer['_right']['_opened']){
    
    this.matSidenavContainer.close();

   }
   else{
    this.matSidenavContainer.open();
   }
   
  }

  async toggleMatSide() {
    
    if (this.matSide['_start'].opened) {
      await this.matSide.close();
    }
    else {
      await this.matSide.open();
    }

  }

  goTo(path: string) {
    
   this.router.navigate([`/${path}`]);

  }

  back() {
    
   this.location.back();
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
