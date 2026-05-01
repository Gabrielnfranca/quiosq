cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\service
$content = Get-Content mesa.service.ts -Raw
$pattern = '(?s)    deleteAll\(quiosqueId: string\): Observable<any> \{.*?\}'
$replacement = @"
    deleteAll(quiosqueId: string): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlMesaBase}/${quiosqueId}/all`);
    }
    deleteBatch(ids: any[]): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlMesaBase}/delete-batch`, ids);
    }
}
"@
$content = $content -replace $pattern, $replacement
Set-Content mesa.service.ts $content
