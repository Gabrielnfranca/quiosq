import { MesaModel } from "@/model/mesa.model";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MesaService {
   
    urlMesaBase = '/api/v1/admin/mesa';
    constructor(private _http: HttpClient) { }

    create(mesa: MesaModel, quiosqueId: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlMesaBase}/${quiosqueId}`, mesa);
    }

    createLote(mesaLote: import('../model/mesa-lote.model').MesaLoteModel, quiosqueId: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlMesaBase}/${quiosqueId}/lote`, mesaLote);
    }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<MesaModel>> {
        const { page = 0, size = 10, orderBy = 'id', direction = 'DESC', numero = undefined } = params || {};

        let queryParams = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('orderBy', orderBy)
            .set('direction', direction);

        if (numero) {   
            queryParams = queryParams.set('numero', numero);
        }

        return this._http.get<ApiPageableResponse<MesaModel>>(`${environment.apiUrl}${this.urlMesaBase}/${quiosqueId}/pageable`, { params: queryParams });
    }

    delete(mesaId: any): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlMesaBase}/${mesaId}`);
    }
        
    activate(mesaId: any): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlMesaBase}/activate`, {id: mesaId});
    }
        
    update(mesa: MesaModel): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlMesaBase}/update`, mesa);
    }

    deleteAll(quiosqueId: string): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlMesaBase}/${quiosqueId}/all`);
    }

    deleteBatch(ids: any[]): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlMesaBase}/delete-batch`, ids);
    }
}
