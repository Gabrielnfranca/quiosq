import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private _http: HttpClient) { }

     logar(username: string, password: string): Observable<any> {
      return this._http.post(`${environment.apiUrl}/api/v1/auth`,{
            email:username,
            password:password
        })
    }
}
