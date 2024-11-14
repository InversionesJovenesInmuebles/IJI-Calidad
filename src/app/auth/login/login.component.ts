import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, this.emailValidator]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), this.passwordValidator]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          console.log('Login exitoso', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);

          let navigateUrl = '/properties';
          if (response.role === 'Agente') {
            navigateUrl = '/manageProperties';
          } else if (response.role === 'Inmobiliaria') {
            navigateUrl = '/manageAgent';
          }
          this.router.navigate([navigateUrl]).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.log('Error del servidor:', err);

          // Detectar el código de estado HTTP y mostrar el mensaje correspondiente
          if (err.status === 401) {
            this.showErrorMessage('Contraseña incorrecta. Por favor, intente de nuevo.');
          } else if (err.status === 404) {
            this.showErrorMessage('Correo no registrado. Por favor, verifique su correo.');
          } else if (err.status === 0 && err.message.includes('ERR_CONNECTION_REFUSED')) {
            this.showErrorMessage('Error de conexión. Intente más tarde.');
          } else {
            this.showErrorMessage('Ha ocurrido un error inesperado. Intente nuevamente.');
          }
        }
      });
    } else {
      this.showErrorMessage('Por favor, complete los campos correctamente.');
      this.markFormGroupTouched(this.loginForm);
    }
  }



  // Validador personalizado para el correo
  emailValidator(control: any) {
    const email = control.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: any) {
    const password = control.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$+*\-\/#&!¡_?¿°|])[A-Za-z\d@$+*\-\/#&!¡_?¿°|]{8,16}$/;
    if (!regex.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }

  // Función para mostrar el mensaje de error y hacer que desaparezca automáticamente
  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  // Función para marcar todos los campos del formulario como tocados para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
