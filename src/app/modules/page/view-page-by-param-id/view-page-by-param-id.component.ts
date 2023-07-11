import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {Location} from '@angular/common';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page/page.service';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { SharingService } from 'src/app/core/services/sharing.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { DeletePageResponse } from 'src/app/models/deletePageResponse.model';

@Component({
  selector: 'app-view-page-by-param-id',
  templateUrl: './view-page-by-param-id.component.html',
  styleUrls: ['./view-page-by-param-id.component.css']
})
export class ViewPageByParamIdComponent {
  idPageParam: string = '';
  page: Page = {
    contents_html: '',
    contents_user: '',
    is_solved: '0',
    title_page: '',
    type_of_page: '',
    username: ''
  };
  renderContent: string = '';

  constructor(
    private router: Router,
    private pageService: PageService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private sharingService:SharingService
  ) {
    
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((value: Params) => {

      this.idPageParam = value['id_page'];

    });


    this.pageService.getSearchPages(this.idPageParam).subscribe((getSearchPages:GetSearchPages) => {
      this.page = getSearchPages.pages[0];
      this.renderContent = this.page.contents_html;
      this.sharingService.sharingPageObservableData = this.page;
    })
    
    
  }

  back() {
    
    this.location.back();
  }

  goTo(path: string) {
    
    this.router.navigate([`/${path}`]);

  }

  async deletePage(id_page: string)  {


    let resultAlert: SweetAlertResult = await Swal.fire({
      title: 'Coloque el titulo de la página para eliminarla',
      input: 'text',
      showCancelButton: true,
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
