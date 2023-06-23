import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CreateImageResponse } from 'src/app/models/createImageResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient
  ) { }

  createImage(formData:FormData):Observable<CreateImageResponse> {

    return this.http.post<CreateImageResponse>(`${environment.apiUrl}/create-image`, formData);
    
  }
}
