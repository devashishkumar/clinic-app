import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SearchingService {
  public headers: {} = this.authService.headers
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getResponse(term: string) {
    return this.http.get(`${environment.THECLINIC_API_URL}/search/${term}`, this.headers)
  }
}
