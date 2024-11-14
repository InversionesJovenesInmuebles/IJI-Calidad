import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {RealEstateService} from "../../services/real-estate.service";
import {Agent} from "../../interfaces/agent";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-mod-agent',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './mod-agent.component.html',
  styleUrl: './mod-agent.component.scss'
})
export class ModAgentComponent implements OnInit {
  idAgent: number = 0;
  agenteForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private realEstateService: RealEstateService
  ) {
    this.agenteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), this.noNumbersOrSpecialCharsValidator]],
      apellido: ['', [Validators.required, Validators.maxLength(50), this.noNumbersOrSpecialCharsValidator]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      nombreInmobiliaria: [{ value: '', disabled: true }, Validators.required],
      correo: ['', [Validators.required, this.emailValidator]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), this.passwordValidator]]
    });
  }

  ngOnInit(): void {
    this.idAgent = +this.route.snapshot.paramMap.get('id')!;
    this.loadAgent(this.idAgent);
  }

  loadAgent(id: number): void {
    this.realEstateService.getAgentById(id).subscribe(
      (agente: Agent) => {
        this.agenteForm.patchValue({
          nombre: agente.nombre,
          apellido: agente.apellido,
          dni: agente.dni,
          telefono: agente.telefono,
          nombreInmobiliaria: agente.nombreInmobiliaria,
          correo: agente.username
        });
      },
      () => {
        this.showErrorMessage('Error al cargar el agente');
      }
    );
  }

  onSubmit(): void {
    if (this.agenteForm.valid) {
      const { nombre, apellido } = this.agenteForm.value;
      this.realEstateService.modAgent(this.idAgent, this.agenteForm.getRawValue()).subscribe(
        () => {
          alert(`La modificación del agente ${nombre} ${apellido} fue exitosa.`);
          this.router.navigate(['/manageAgent']);
        },
        (error) => {
          // Detectar el código de estado HTTP 409 para mostrar el mensaje correspondiente
          if (error.status === 409) {
            this.showErrorMessage('El correo ya está registrado. Por favor, intente con otro correo.');
          } else {
            this.showErrorMessage('Error al modificar el agente. Inténtelo nuevamente.');
          }
        }
      );
    } else {
      this.showErrorMessage('Por favor complete los campos correctamente.');
      this.markFormGroupTouched(this.agenteForm);
    }
  }


  private noNumbersOrSpecialCharsValidator(control: any) {
    const value = control.value;
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      return { invalidChars: true };
    }
    return null;
  }

  private emailValidator(control: any) {
    const email = control.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  private passwordValidator(control: any) {
    const password = control.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$+*\-\/#&!¡_?¿°|])[A-Za-z\d@$+*\-\/#&!¡_?¿°|]{8,16}$/;
    if (!regex.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => formGroup.get(key)?.markAsTouched());
  }
}
