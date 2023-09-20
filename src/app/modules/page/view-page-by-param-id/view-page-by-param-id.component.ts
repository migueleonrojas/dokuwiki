import { ActivatedRoute, Params, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  loadingData: boolean = true;
  renderContent: string = '';
  mobileQuery: MediaQueryList;
  viewImageZoom: boolean = false;
  zoomImage: string = "";
  styleImage: string = "";
  styleContentImage: string = "";
  scale: number = 1;
  porcentX = 0;
  porcentY = 0;

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

 @HostListener("wheel", ['$event'])
 scrollImage(event:any){
   if( event.target.constructor.name === 'HTMLImageElement'){
     if( event.target.hasAttribute("data-image-zoom")){
       return;
     }
     
     event.preventDefault();
     this.scale += event.deltaY * -0.01;
     this.scale = Math.min(Math.max(1, this.scale), 10);

     this.styleImage = `
       width: 100%;
       height: 100%;
       object-fit: cover;
       transform: scale(${this.scale});
       transform-origin: ${this.porcentX}% ${this.porcentY}%;
       object-position: ${this.porcentX}% ${this.porcentY}%;
     `; 
     
   }

 }

 @HostListener('mouseover', ['$event'])
 enterImage(event:any){

   if( event.target.constructor.name === 'HTMLImageElement'){
     
     if( event.target.hasAttribute("data-image-zoom")){
       return;
     }
     
     this.scale = 1;
     
     event.target.style = `
       ${event.target.style.cssText}
       border: 5px solid red;
       cursor: crosshair;
       box-sizing: border-box;
     `;
   }

 }

 @HostListener('mouseout', ['$event'])
 leaveImage(event:any){
   if( event.target.constructor.name === 'HTMLImageElement'){
     if( event.target.hasAttribute("data-image-zoom")){
       return;
     }

     let arrayStylesImage = event.target.style.cssText.split(';');
     event.target.style = `
       ${arrayStylesImage[0]};
       ${arrayStylesImage[1]};
     `;
   }
 }

 @HostListener('mousemove',['$event'])
 zoomImageHover(event:any) {
   if( event.target.constructor.name === 'HTMLImageElement'){

     
     if( event.target.hasAttribute("data-image-zoom")){
       return;
     }
     
     this.viewImageZoom = true;
     this.zoomImage = event.target['currentSrc'];

     this.porcentX = event.offsetX / (event.target['scrollWidth'] / 100);
     this.porcentY = event.offsetY / (event.target['scrollHeight'] / 100);


     this.styleContentImage = `
       max-width: 35%;
       width: 35%;
       height: 30rem;
       position: fixed;
       top: ${5}%;
       right: ${5}%;
       overflow: hidden;
       z-index: 1000;
       border: 1px solid black;
       z-index: 4000;
     `;
     
     this.styleImage = `
       width: 100%;
       height: 100%;
       object-fit: cover;
       transform: scale(${this.scale});
       transform-origin: ${this.porcentX}% ${this.porcentY}%;
       object-position: ${this.porcentX}% ${this.porcentY}%;
     `; 

   }
   else{
     this.viewImageZoom = false;
   }
 }

 @HostListener('document:click', ['$event'])
 clickElements(event: any){

  if( event.target.constructor.name === 'HTMLImageElement'){

   let imageSrc = event.target.src;

   let height = event.target.naturalHeight;
   let width = event.target.naturalWidth;

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
      this.loadingData = false;
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
