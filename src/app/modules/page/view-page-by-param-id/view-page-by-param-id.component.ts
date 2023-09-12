import { ActivatedRoute, Params, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page/page.service';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { SharingService } from 'src/app/core/services/sharing.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { DeletePageResponse } from 'src/app/models/deletePageResponse.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { GetPageById } from 'src/app/models/getPageById.model';

@Component({
  selector: 'app-view-page-by-param-id',
  templateUrl: './view-page-by-param-id.component.html',
  styleUrls: ['./view-page-by-param-id.component.css']
})
export class ViewPageByParamIdComponent implements AfterViewInit {
  @ViewChild('matSideContainer') matSideContainer: MatSidenavContainer;
  idPageParam: string = '';
  page: Page = {
    contents_html: '',
    contents_user: '',
    title_page: '',
    type_of_page: '',
    username: ''
  };
  allPages: Page[];
  allPagesAux: Page[];
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
 ngAfterViewInit(): void {
  this.sharingService.sharingSideContainerObservableData = this.matSideContainer;
 }

  private _mobileQueryListener: () => void;

  ngOnInit() {

    this.mobileQuery = this.media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);

    this.activatedRoute.queryParams.subscribe((value: Params) => {

      this.idPageParam = value['id_page'];

    });


    this.pageService.getPageById(this.idPageParam).subscribe((getPageById: GetPageById) => {
      this.page = getPageById.page;
      this.renderContent = this.page.contents_html;
      this.sharingService.sharingPageObservableData = this.page;
    });

    

    this.pageService.getAllPages().subscribe((getPageForPage: GetAllPages) => {
      
      this.allPages = getPageForPage.pages;
      this.allPagesAux = getPageForPage.pages;
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

  searchPage(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.allPages = this.allPagesAux;
    this.allPages = this.allPages.filter(el => el.title_page.toLocaleLowerCase().includes(filterValue));
 
   }



}
