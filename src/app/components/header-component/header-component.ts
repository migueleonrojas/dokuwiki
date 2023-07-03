import { Component, OnInit } from '@angular/core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { SharingService } from 'src/app/core/services/sharing.service';
import { PageService } from 'src/app/services/page/page.service';
import { Router } from '@angular/router';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  faClipboard = faClipboard;
  searchFormControl = new FormControl('', [Validators.required]);
  matSide: MatSidenav;

  constructor(
    private sharingService: SharingService,
    private pageService:PageService,
    private router: Router,
  ) { }
  

  ngOnInit() {
    this.sharingService.sharingSideNavObservable.subscribe((matSidenav:MatSidenav) => {
      this.matSide = matSidenav;
    })
  }

  

  search() {

    if (this.searchFormControl.invalid) return;
    
    this.sharingService.sharingQuerySearchObservableData = this.searchFormControl.value;

    this.pageService.getSearchPages(this.searchFormControl.value).subscribe((data:GetSearchPages) => {

      this.sharingService.sharingPagesObservableData = data.pages;

    });

    this.router.navigate(['/view-search-page']);

  }

  async toggleMatSide() {
    
    if (this.matSide['_start'].opened) {
      await this.matSide.close();
    }
    else {
      await this.matSide.open();
    }

  }
}
