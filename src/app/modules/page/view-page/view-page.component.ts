import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import {Location} from '@angular/common';
import { PageService } from 'src/app/services/page/page.service';
import { DeletePageResponse } from 'src/app/models/deletePageResponse.model';
import Swal, { SweetAlertResult } from 'sweetalert2'
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {
  page: Page;
  renderContent: string;
  allPages: Page[];
  mobileQuery: MediaQueryList;
  constructor(
    private router: Router,
    private sharingService: SharingService,
    private location: Location,
    private pageService: PageService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  
  private _mobileQueryListener: () => void;
  
  ngOnInit() {

    this.sharingService.sharingPageObservable.subscribe((page: Page) => {
    
      this.page = page;

      this.renderContent = this.page.contents_html;
    });


    this.pageService.getAllPages().subscribe((getPageForPage: GetAllPages) => {
      
      this.allPages = getPageForPage.pages;

    });
    
  }

  back() {
    
    this.location.back();
  }

  goTo(path: string) {
    
    this.router.navigate([`/${path}`]);

  }

  view(page: Page) {

    this.sharingService.sharingPageObservableData = page;    
    
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
