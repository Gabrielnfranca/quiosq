import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { LoadingService } from '../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator, CommonModule, ToastModule],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="flex justify-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed h-8 w-8">
                    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path>
                    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
                    <path d="m2.1 21.8 6.4-6.3"></path>
                    <path d="m19 5-7 7"></path>
               </svg>
                        </div>

                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Controle Financeiro</div>
                            <span class="text-muted-color font-medium">Bem-vindo! Faça login para continuar.</span>
                        </div>

                        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">E-mail</label>
                            <input pInputText id="email1" type="text" placeholder="Endereço de e-mail" class="w-full md:w-120 mb-2" formControlName="email" />
                            <div *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" class="text-red-500 mb-6">
                                <small *ngIf="loginForm.get('email')?.errors?.['required']">O e-mail é obrigatório.</small>
                                <small *ngIf="loginForm.get('email')?.errors?.['email']">Digite um e-mail válido.</small>
                            </div>

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                            <p-password id="password1" formControlName="password" placeholder="Senha" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>
                            <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)" class="text-red-500 mb-6">
                                <small *ngIf="loginForm.get('password')?.errors?.['required']">A senha é obrigatória.</small>
                                <small *ngIf="loginForm.get('password')?.errors?.['minlength']">A senha deve ter pelo menos 6 caracteres.</small>
                            </div>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox formControlName="rememberMe" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Lembrar-me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Esqueceu a senha?</span>
                            </div>
                            <p-button label="Entrar" styleClass="w-full" type="submit" [disabled]="loginForm.invalid"></p-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    loginForm: FormGroup;
    private service = inject(MessageService);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.loginForm = this.fb.group({
            email: ['nobertorafael9@gmail.com', [Validators.required, Validators.email]],
            password: ['123456', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loadingService.show();
            this.authService.logar(this.loginForm.value.email, this.loginForm.value.password).subscribe({
                next: (response) => {
                    this.loadingService.hide();

                    if (response) {
                        this.tokenService.setToken(response.token)
                        this.router.navigate(['/']);
                    }
                },
                error: (error) => {
                    this.loadingService.hide();
                    this.service.add({ severity: 'error', summary: 'Error Message', detail: error.error.message });
                }
            })

        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
