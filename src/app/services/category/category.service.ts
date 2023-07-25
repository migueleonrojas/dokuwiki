import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from 'src/app/models/category';
import { CreateCategoryResponse } from 'src/app/models/createCategoryResponse.model';
import { GetAllCategoryResponse } from 'src/app/models/getAllCategoryResponse';
import { ModifyCategoryResponse } from 'src/app/models/modifyCategoryResponse.model';
import { DeleteCategoryResponse } from 'src/app/models/deleteCategoryResponse.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
   private http: HttpClient
  ) { }

  createCategory(category:Category):Observable<CreateCategoryResponse>{
   return this.http.post<CreateCategoryResponse>(`${environment.apiUrl}/create-category`, category);
  }

  modifyCategory(category:Object):Observable<ModifyCategoryResponse>{
   return this.http.put<ModifyCategoryResponse>(`${environment.apiUrl}/modify-category`, category);
  }

  deleteCategory(name_category:string):Observable<DeleteCategoryResponse>{
   return this.http.delete<DeleteCategoryResponse>(`${environment.apiUrl}/delete-category?name_category=${name_category}`);
  }


  getAllCategories():Observable<GetAllCategoryResponse>{
   return this.http.get<GetAllCategoryResponse>(`${environment.apiUrl}/get-all-categories`);
  }

  
}
