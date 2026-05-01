import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PedidoModel } from '../model/pedido.model';
import { ApiPageableResponse, ParamsRequest } from '../shared/utils/pageable.utils';

@Injectable({
    providedIn: 'root'
})
export class PedidoService {

    urlPedidoBase = '/api/v1/admin/pedido';

    constructor(private _http: HttpClient) { }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<PedidoModel>> {
            const { page = 0, size = 10, orderBy = 'id', direction = 'DESC', search = undefined } = params || {};
    
            let queryParams = new HttpParams()
                .set('page', page)
                .set('size', size)
                .set('orderBy', orderBy)
                .set('direction', direction);
    
            if (search) {
                queryParams = queryParams.set('search', search);
            }
    
            return this._http.get<ApiPageableResponse<PedidoModel>>(`${environment.apiUrl}${this.urlPedidoBase}/${quiosqueId}/pageable`, { params: queryParams });
        }

    updateStatus(id: string, status:any): Observable<any> {
       return this._http.put(`${environment.apiUrl}${this.urlPedidoBase}/${id}/status`, {status: status});
    }
}
