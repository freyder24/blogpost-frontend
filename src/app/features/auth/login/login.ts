import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  loginStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  loginFormGroup = this.fb.group({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get emailFormControl() {
    return this.loginFormGroup.controls.email;
  }

  get passwordFormControl() {
    return this.loginFormGroup.controls.password;
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.loginStatus.set('loading');
    this.errorMessage.set('');

    const formValueLogin = this.loginFormGroup.getRawValue();

    this.authService.login(formValueLogin).subscribe({
      next: (response) => {
        if (!response?.token) {
          this.loginStatus.set('error');
          this.errorMessage.set('Credenciales inválidas.');
          return;
        }

        this.loginStatus.set('success');
        this.loginFormGroup.reset();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
        this.loginStatus.set('error');
        this.errorMessage.set('No se pudo iniciar sesión.');
      },
    });
  }
}
