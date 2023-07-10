import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetPageForPage } from 'src/app/models/getPagesForPage.model';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/page.model';
import { CreatePageResponse } from 'src/app/models/createPageResponse.model';
import { GetAllPages } from 'src/app/models/getAllPages.model';
import { ModifyPageResponse } from 'src/app/models/modifyPageResponse.model';
import { GetSearchPages } from 'src/app/models/getSearchPages.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(
    private http: HttpClient
  ) { }


  getSearchPages(search: string): Observable<GetSearchPages> {
    return this.http.get<GetSearchPages>(`${environment.apiUrl}/search-page?search=${search}`);
  }
 

  getPagesForPage(page:number, limit:number):Observable<GetPageForPage> {

    return this.http.get<GetPageForPage>(`${environment.apiUrl}/get-pages-for-page?page=${page}&limit=${limit}`);
    
  }

  getAllPages(): Observable<GetAllPages> {

    return this.http.get<GetAllPages>(`${environment.apiUrl}/get-all-pages`);

  }

  createPage(page: Page):Observable<CreatePageResponse> {

    return this.http.post<CreatePageResponse>(`${environment.apiUrl}/create-page`, page);
    
  }
  
  modifyPage(page: Page):Observable<ModifyPageResponse> {

    return this.http.put<ModifyPageResponse>(`${environment.apiUrl}/modify-page`, page);
  }


}
