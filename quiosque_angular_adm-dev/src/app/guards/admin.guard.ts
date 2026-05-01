import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../service/token.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const token = tokenService.getToken();

    if (!token) {
        router.navigate(['/auth/login']);
        return false;
    }

    const claims = tokenService.getClaim();
    
    console.log("CLAIMS RECEBIDAS NO GUARD:", claims);

    if (claims.roles && claims.roles.includes('ROLE_ADMIN')) {
        return true;
    }

    router.navigate(['/auth/access']);
    return false;
};
