import { ProdutoModel } from "@/model/produto.model";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {

    urlBase = '/api/v1/admin/item_cardapio';

    constructor(private _http: HttpClient) { }

    create(produto: ProdutoModel, quiosqueId: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlBase}/${quiosqueId}`, produto);
    }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<ProdutoModel>> {
        const { page = 0, size = 10, orderBy = 'id', direction = 'DESC', search = undefined } = params || {};

        let queryParams = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('orderBy', orderBy)
            .set('direction', direction);

        if (search) {
            queryParams = queryParams.set('search', search);
        }

        return this._http.get<ApiPageableResponse<ProdutoModel>>(`${environment.apiUrl}${this.urlBase}/${quiosqueId}/pageable`, { params: queryParams });
    }

    delete(id: any): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlBase}/${id}`);
    }

    update(produto: ProdutoModel): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlBase}`, produto);
    }

    habilitaDesabilita(id: any, ativo: boolean): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlBase}/${id}/habilita-desabilita`, { "ativo": ativo });
    }
}
