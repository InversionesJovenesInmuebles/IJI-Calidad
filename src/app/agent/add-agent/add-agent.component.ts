import {Component, OnInit} from '@angular/core';
import {RealEstateService} from "../../services/real-estate.service";
import {Router, RouterLink} from "@angular/router";
import {RegisterAgentRequest} from "../../interfaces/register-agent-request";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-add-agent',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink
  ],
  templateUrl: './add-agent.component.html',
  styleUrl: './add-agent.component.scss'
})
export class AddAgentComponent implements OnInit{
  agentForm: FormGroup;
  errorMessage: string = '';
  nombreInmobiliaria: string = '';  // Almacenaremos el nombre aquí para usarlo al enviar

  constructor(
    private fb: FormBuilder,
    private realEstateService: RealEstateService,
    private router: Router
  ) {
    this.agentForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), this.noSpecialCharsValidator]],
      apellido: ['', [Validators.required, Validators.maxLength(50), this.noSpecialCharsValidator]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      nombreInmobiliaria: [{ value: '', disabled: true }, [Validators.required]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(50), this.emailValidator]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), this.passwordValidator]]
    });
  }

  ngOnInit(): void {
    this.getRealEstateName();
  }

  getRealEstateName(): void {
    this.realEstateService.getRealStateByToken().subscribe(
      (RealEstate) => {
        this.nombreInmobiliaria = RealEstate.nombreInmobiliaria;
        this.agentForm.patchValue({ nombreInmobiliaria: this.nombreInmobiliaria });
      },
      (error) => {
        console.error('Error al obtener datos de la inmobiliaria:', error);
        this.showErrorMessage('Error al obtener el nombre de la inmobiliaria.');
      }
    );
  }

  onSubmit() {
    if (this.agentForm.valid) {
      const formValue = { ...this.agentForm.getRawValue(), nombreInmobiliaria: this.nombreInmobiliaria };
      const token = localStorage.getItem('token');

      this.realEstateService.registerAgent(formValue, token).subscribe({
        next: () => {
          alert('Agente registrado exitosamente');
          this.router.navigate(['/manageAgent']);
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
      this.markFormGroupTouched(this.agentForm);
    }
  }


  private noSpecialCharsValidator(control: any) {
    const regex = /^[a-zA-Z\s]*$/;
    return !regex.test(control.value) ? { invalidChars: true } : null;
  }

  private emailValidator(control: any) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !regex.test(control.value) ? { invalidEmail: true } : null;
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

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => formGroup.get(key)?.markAsTouched());
  }
}
