import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  uploadImageCloudinary(id: string, photo: any, schema: string) {
    return this.http.post(`${environment.THECLINIC_API_URL}/file/photo/upload/${schema}/${id}`, photo, this.headers);
  }
  destroyImageCloudinary(id: string, schema: string) {
    return this.http.delete(`${environment.THECLINIC_API_URL}/file/photo/destroy/${schema}/${id}`, this.headers);
  }
}
