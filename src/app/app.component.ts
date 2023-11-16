import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { SharingService } from './core/services/sharing.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnInit {
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

  ngOnInit(): void {
    this.router.events.pipe(
      filter<NavigationEnd>((event) => event instanceof NavigationEnd),
      map((event) => event.url),
    ).subscribe((url: string) => {

      if(url === '/page/view-page') return;
      if(url === '/page/modify-page') return;
      this.sharingService.sharingPreviousUrlObservableData = url;
      
    });
  }

  ngAfterViewInit() {
    
    this.sharingService.sharingSideNavObservableData = this.matSidenav;
  }
  
}
