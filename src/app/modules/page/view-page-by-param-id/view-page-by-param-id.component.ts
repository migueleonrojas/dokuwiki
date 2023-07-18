import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {Location} from '@angular/common';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page/page.service';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { SharingService } from 'src/app/core/services/sharing.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { DeletePageResponse } from 'src/app/models/deletePageResponse.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { GetAllPages } from 'src/app/models/getAllPages.model';

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
  allPages: Page[];
  renderContent: string = '';
  mobileQuery: MediaQueryList;

  constructor(
    private router: Router,
    private pageService: PageService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private sharingService: SharingService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    
  }

  private _mobileQueryListener: () => void;

  ngOnInit() {

    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.activatedRoute.queryParams.subscribe((value: Params) => {

      this.idPageParam = value['id_page'];

    });


    this.pageService.getSearchPages(this.idPageParam).subscribe((getSearchPages: GetSearchPages) => {
      this.page = getSearchPages.pages[0];
      this.renderContent = this.page.contents_html;
      this.sharingService.sharingPageObservableData = this.page;
    });

    

    this.pageService.getAllPages().subscribe((getPageForPage: GetAllPages) => {
      
      this.allPages = getPageForPage.pages;

    });
    
    
  }

  async view(page: Page) {
    
    this.page = page;
    this.renderContent = this.page.contents_html;
    await this.router.navigate([], {
      queryParams: {
        'id_page': page.id_page
      },
      skipLocationChange: false,
      queryParamsHandling: 'merge',
    });
    
  }

  
  goTo(path: string) {
   
    this.router.navigate([`/${path}`]);

  }



}
