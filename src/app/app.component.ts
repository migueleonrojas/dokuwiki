import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharingService } from './core/services/sharing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('matSidenav') matSidenav: MatSidenav;
  title = 'dokuwiki-app';
  constructor(
    private router: Router,
    private sharingService: SharingService
  ) {
     this.router.navigate(['/main-component']);
  }

  ngAfterViewInit() {
    
    this.sharingService.sharingSideNavObservableData = this.matSidenav;
  }
  
}
