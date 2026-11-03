import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  registerStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  registerFormGroup = this.fb.group({
    userName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  get userNameFormControl() {
    return this.registerFormGroup.controls.userName;
  }

  get emailFormControl() {
    return this.registerFormGroup.controls.email;
  }

  get passwordFormControl() {
    return this.registerFormGroup.controls.password;
  }

  onSubmit() {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    this.registerStatus.set('loading');
    this.errorMessage.set('');

    const formValueRegister = this.registerFormGroup.getRawValue();

    this.authService.register(formValueRegister).subscribe({
      next: () => {
        this.registerStatus.set('success');
        this.registerFormGroup.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.registerStatus.set('error');
        this.errorMessage.set('No se pudo crear la cuenta.');
      },
    });
  }
}
