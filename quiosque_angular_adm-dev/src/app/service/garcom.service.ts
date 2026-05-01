import { GarcomModel } from "@/model/garcom.model";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})
export class GarcomService {
   
    urlGarcomBase = '/api/v1/admin/garcom';
    constructor(private _http: HttpClient) { }

    create(garcom: GarcomModel, quiosqueId: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlGarcomBase}/${quiosqueId}`, garcom);
    }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<GarcomModel>> {
        const { page = 0, size = 10, orderBy = 'id', direction = 'DESC', search = undefined } = params || {};

        let queryParams = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('orderBy', orderBy)
            .set('direction', direction);

        if (search) {
            queryParams = queryParams.set('search', search);
        }

        return this._http.get<ApiPageableResponse<GarcomModel>>(`${environment.apiUrl}${this.urlGarcomBase}/${quiosqueId}/pageable`, { params: queryParams });
    }

     findAllNOtEqualsId(garcomId: any, quiosqueId: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUrl}${this.urlGarcomBase}/findAllNotEquals/${quiosqueId}/${garcomId}`);
    }

     findAllWithStatusTrue(quiosqueId: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUrl}${this.urlGarcomBase}/findAllWithStatusTrue/${quiosqueId}`);
    }

     delete(quiosqueId: any, garcomId: any, novoGarcomId?: any): Observable<any> {
        let url = `${environment.apiUrl}${this.urlGarcomBase}/${quiosqueId}/${garcomId}`;
        if (novoGarcomId) {
            url += `/${novoGarcomId}`;
        }
        return this._http.delete<any>(url);
    }
        
    activate(garcomId: any): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlGarcomBase}/activate`, {id: garcomId});
    }
        
    update(garcom: GarcomModel): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlGarcomBase}/update`, garcom);
    }
}