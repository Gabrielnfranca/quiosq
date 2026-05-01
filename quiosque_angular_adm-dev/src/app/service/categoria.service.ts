import { CategoriaModel } from "@/model/categoria.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {

    urlBase = '/api/v1/admin/categoria';


    constructor(private _http: HttpClient) { }

    create(categoria: CategoriaModel, quiosqueId: string): Observable<any> {
      return this._http.post<CategoriaModel>(`${environment.apiUrl}${this.urlBase}/${quiosqueId}`, categoria);
    }

    findAll(quiosqueId: string): Observable<CategoriaModel[]> {
        return this._http.get<CategoriaModel[]>(`${environment.apiUrl}${this.urlBase}/${quiosqueId}`);
    }

    delete(id: any): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlBase}/${id}`);
    }

    update(categoria: CategoriaModel): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlBase}`, categoria);
    }
}
