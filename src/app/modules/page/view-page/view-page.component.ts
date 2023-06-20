import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {

  page: Page;
  renderContent: string;

  constructor(
    private router: Router,
    private sharingService: SharingService,
    private location: Location,
  ) { }
  
  
  ngOnInit() {

    this.sharingService.sharingPageObservable.subscribe((page: Page) => {
    
      this.page = page;

    });

    this.renderContent = this.page.contents_html;
    
  }

  back() {
    
    this.location.back();
  }

  goTo(path: string) {
    
    this.router.navigate([`/${path}`]);

  }
  


  

}
