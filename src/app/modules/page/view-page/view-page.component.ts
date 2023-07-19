import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import {  Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import {Location} from '@angular/common';
import { PageService } from 'src/app/services/page/page.service';
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenavContainer } from '@angular/material/sidenav';


@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit, AfterViewInit {
 @ViewChild('matSideContainer') matSideContainer: MatSidenavContainer;
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
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }

 
  
  private _mobileQueryListener: () => void;
  
  ngOnInit() {

    this.sharingService.sharingPageObservable.subscribe((page: Page) => {
    
      this.page = page;

      this.renderContent = this.page.contents_html;
    });

    this.sharingService.sharingPageObservableData = this.page; 


    this.pageService.getAllPages().subscribe((getPageForPage: GetAllPages) => {
      
      this.allPages = getPageForPage.pages;

    });
    
  }

  ngAfterViewInit() {
   this.sharingService.sharingSideContainerObservableData = this.matSideContainer;
  }


  view(page: Page) {

    this.sharingService.sharingPageObservableData = page;    
    
  }

}
