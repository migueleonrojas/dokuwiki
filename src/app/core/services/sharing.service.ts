import { Injectable } from "@angular/core";
import { MatDrawerToggleResult, MatSidenav, MatSidenavContainer } from "@angular/material/sidenav";
import { BehaviorSubject, Observable } from "rxjs";

import { Page } from "src/app/models/page.model";

@Injectable()
export class SharingService {
  private sharingPageObservablePrivate: BehaviorSubject<Page> = new BehaviorSubject<Page>({
    username: "",
    contents_user: "",
    contents_html: "",
    title_page: "",
    is_solved: '0',
    type_of_page: ''
  })

  private sharingPagesObservablePrivate: BehaviorSubject<Page[]> = new BehaviorSubject<Page[]>([]);

  private sharingQuerySearchObservablePrivate: BehaviorSubject<string> = new BehaviorSubject<string>("");

  private sharingSideNavObservablePrivate: BehaviorSubject<MatSidenav> = new BehaviorSubject<MatSidenav>(null);

  private sharingSideContainerObservablePrivate: BehaviorSubject<MatSidenavContainer> = new BehaviorSubject<MatSidenavContainer>(null);


  get sharingPageObservable(): Observable<Page> {
    return this.sharingPageObservablePrivate.asObservable();
  }

  set sharingPageObservableData(page: Page) {
    this.sharingPageObservablePrivate.next(page);
  }



  get sharingPagesObservable(): Observable<Page[]> {
    return this.sharingPagesObservablePrivate.asObservable();
  }

  set sharingPagesObservableData(pages: Page[]) {
    this.sharingPagesObservablePrivate.next(pages);
  }



  get sharingQuerySearchObservable(): Observable<string> {
    return this.sharingQuerySearchObservablePrivate.asObservable();
  }

  set sharingQuerySearchObservableData(search: string) {
    this.sharingQuerySearchObservablePrivate.next(search);
  }


  get sharingSideNavObservable(): Observable<MatSidenav> {
    return this.sharingSideNavObservablePrivate.asObservable();
  }

  set sharingSideNavObservableData(matSidenav: MatSidenav) {
    this.sharingSideNavObservablePrivate.next(matSidenav);
  }

  get sharingSideContainerObservable(): Observable<MatSidenavContainer> {
    return this.sharingSideContainerObservablePrivate.asObservable();
  }

  set sharingSideContainerObservableData(matSidenavContainer:MatSidenavContainer){
   this.sharingSideContainerObservablePrivate.next(matSidenavContainer);
  }



}