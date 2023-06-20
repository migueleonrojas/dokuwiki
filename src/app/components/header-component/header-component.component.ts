import { Component } from '@angular/core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { SharingService } from 'src/app/core/services/sharing.service';
import { PageService } from 'src/app/services/page/page.service';
import { Router } from '@angular/router';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent {
  faClipboard = faClipboard;
  searchFormControl = new FormControl('', [Validators.required]);

  constructor(
    private sharingService: SharingService,
    private pageService:PageService,
    private router: Router
  ) {}

  search() {

    if (this.searchFormControl.invalid) return;
    
    this.sharingService.sharingQuerySearchObservableData = this.searchFormControl.value;

    this.pageService.getSearchPages(this.searchFormControl.value).subscribe((data:GetSearchPages) => {

      this.sharingService.sharingPagesObservableData = data.pages;

    });

    this.router.navigate(['/view-search-page']);


  }
}
