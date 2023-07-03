import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/core/services/sharing.service';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';
import { PageService } from 'src/app/services/page/page.service';

@Component({
  selector: 'app-mat-drawer-elements',
  templateUrl: './mat-drawer-elements.component.html',
  styleUrls: ['./mat-drawer-elements.component.css']
})
export class MatDrawerElementsComponent {
  searchFormControl = new FormControl('', [Validators.required]);
  matSide: MatSidenav;

  constructor(
    private sharingService: SharingService,
    private pageService: PageService,
    private router: Router,
  ) {
    
  }

  async search() {

    if (this.searchFormControl.invalid) return;
    
    this.sharingService.sharingQuerySearchObservableData = this.searchFormControl.value;

    this.pageService.getSearchPages(this.searchFormControl.value).subscribe((data:GetSearchPages) => {

      this.sharingService.sharingPagesObservableData = data.pages;

      this.sharingService.sharingSideNavObservable.subscribe((matSidenav:MatSidenav) => {
        this.matSide = matSidenav;
      });

    });

    await this.matSide.close();

    this.router.navigate(['/view-search-page']);

  }
}
