import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharingService } from './core/services/sharing.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('matSidenav') matSidenav: MatSidenav;
  title = 'dokuwiki-app';
  mobileQuery: MediaQueryList;
  
  constructor(
    private router: Router,
    private sharingService: SharingService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher

  ) {
   this.mobileQuery = media.matchMedia('(max-width: 700px)');
   this._mobileQueryListener = () => changeDetectorRef.detectChanges();
   this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngAfterViewInit() {
    
    this.sharingService.sharingSideNavObservableData = this.matSidenav;
  }
  
}
