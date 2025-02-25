import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page/page.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import { DateExactly } from 'src/app/pipes/date.pipe';
import { DatePipe } from '@angular/common';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import {Location} from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-view-search-pages',
  templateUrl: './view-search-pages.component.html',
  styleUrls: ['./view-search-pages.component.css']
})
export class ViewSearchPagesComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = [/* 'id', */ 'title_page', 'username', 'creation_date', 'modification_date', 'category','type_of_page','options'];
  dataToDisplay: Page[] = [];
  dataSource: MatTableDataSource<Page>;
  querySearch: string = "";
  loadingData: boolean;
  previousUrl: string = '';

  constructor(
    private pageService: PageService,
    private router: Router,
    private sharingService: SharingService,
    private dateExactly: DateExactly,
    private datePipe: DatePipe,
    private location: Location,
    private cdref: ChangeDetectorRef

  ) {}
 ngOnInit(): void {

  /* throw new Error('Method not implemented.'); */
 }
  
 ngAfterViewInit() {
   this.loadingData = true;
   this.sharingService.sharingPageObservableData = {
    id_page: '',
    username: '',
    contents_html: '',
    contents_user: '',
    title_page: '',
    type_of_page: '',
    creation_date: null,
    modification_date: null,
    category: ''
   };

    
    this.sharingService.sharingSearchPagesObservable.subscribe(
      (data: Page[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataToDisplay = data;
        
        
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
       }
      
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
  


  view(page: Page) {

    this.sharingService.sharingPageObservableData = page;
    
    this.router.navigate(['/page/view-page']);
    
    
  }

  back() {
    
    this.router.navigate(['/']);
   
  }

  goTo(path: string) {
    
    this.router.navigate([`/${path}`]);

  }
  



}
