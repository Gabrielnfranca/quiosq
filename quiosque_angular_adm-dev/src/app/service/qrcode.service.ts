import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface QrCodeGenerateResponse {
    url: string;
    urlText: string;
}

@Injectable({
    providedIn: 'root'
})
export class QrCodeService {
    constructor(private http: HttpClient) {}

    generateQrCodeMesa(mesaId: string, quiosqueId: string): Observable<QrCodeGenerateResponse> {
        return this.http.get<QrCodeGenerateResponse>(`${environment.apiUrl}/api/v1/qrcode/${mesaId}/${quiosqueId}`);
    }
}
