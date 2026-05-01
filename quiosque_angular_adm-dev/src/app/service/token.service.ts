import { AppConstants } from '@/constant/app.constant';
import { Injectable } from '@angular/core';


import { jwtDecode } from 'jwt-decode';

export interface DecodeToken {
    sub: string;
    roles: string[];
    quiosque_id: string;
    user_name: string;
}

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    autenticado: Boolean = false;
    private sensitiveClaims: DecodeToken = {} as DecodeToken;
    setToken(token: string): void {

        const decodedToken = jwtDecode(token);
        this.sensitiveClaims = decodedToken as DecodeToken;
        this.autenticado = true;
        localStorage.setItem(AppConstants.BEARER_TOKEN, token);
        localStorage.setItem(AppConstants.CLAIMS, JSON.stringify(this.sensitiveClaims));
    }

    getToken(): any {
        return localStorage.getItem(AppConstants.BEARER_TOKEN);
    }

    getClaim(): DecodeToken {
        return JSON.parse(localStorage.getItem(AppConstants.CLAIMS) || '{}') as DecodeToken;
    }

    clearToken(): void {
        localStorage.removeItem(AppConstants.BEARER_TOKEN);
        localStorage.removeItem(AppConstants.CLAIMS);
        this.autenticado = false;
    }

}