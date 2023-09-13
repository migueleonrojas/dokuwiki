import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import {  Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import {Location} from '@angular/common';
import { PageService } from 'src/app/services/page/page.service';
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenavContainer } from '@angular/material/sidenav';
import Swal from 'sweetalert2';


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
  allPagesAux: Page[];
  loadingData: boolean = true;
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

  @HostListener('document:click', ['$event'])
  clickElements(event: any){

   if( event.target.constructor.name === 'HTMLImageElement'){

    let imageSrc = event.target.src;

    let height = event.target.naturalHeight;
    let width = event.target.naturalWidth;

    if(height < 400){
     width = event.target.naturalWidth * 5.0;
     height = event.target.naturalHeight * 1.5;
    }

    if(height < 400 && width < 400) {
     width = event.target.naturalWidth * 3.0;
     height = event.target.naturalHeight * 2.0;
    }
        

    Swal.fire({
     imageHeight: height,
     heightAuto: true,
     width: width,
     showConfirmButton: true,
     
     padding: '3em',
     color: '#716add',
     imageUrl: imageSrc,

     backdrop: `
       rgba(0,0,12,0.4)
       left top
       no-repeat
     `,

    });
   }

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
      this.allPagesAux = getPageForPage.pages;
      this.loadingData = false;
    });
    
  }

  ngAfterViewInit() {
   this.sharingService.sharingSideContainerObservableData = this.matSideContainer;
  }


  view(page: Page) {

    this.sharingService.sharingPageObservableData = page;    
    
  }

  searchPage(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.allPages = this.allPagesAux;
    this.allPages = this.allPages.filter(el => el.title_page.toLocaleLowerCase().includes(filterValue));
 
   }

}
