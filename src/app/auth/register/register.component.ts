import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      correo: ['', [Validators.required, this.emailValidator, Validators.maxLength(50)]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), this.passwordValidator]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.registerClient(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Detectar el código de estado HTTP 409 para mostrar el mensaje correspondiente
          if (err.status === 409) {
            this.showErrorMessage('El correo ya está registrado. Por favor, intente con otro correo.');
          } else {
            this.showErrorMessage('Error en el registro. Inténtelo nuevamente.');
          }
        }
      });
    } else {
      this.showErrorMessage('Por favor complete los campos correctamente.');
      this.markFormGroupTouched(this.registerForm); // Marca todos los campos como tocados para mostrar los errores
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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$+*\-\/#&!¡_?¿°|])[A-Za-z\d@$+*\-\/#&!¡_?¿°|]{8,16}$/;
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
    }, 3000);  // La alerta desaparece después de 3s
  }

  // Función para marcar todos los campos del formulario como tocados para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
