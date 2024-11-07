import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {AgentService} from "../../services/agent.service";

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {
  propertyForm: FormGroup;
  photo: File[] = []; // Cambia el tipo a File[]
  photoPreview: string[] = [];
  formSubmitted = false; // Indicador para mostrar errores solo después de intentar enviar el formulario

  constructor(private fb: FormBuilder,private router: Router, private agentService: AgentService) {
    this.propertyForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      areaTerreno: ['', [Validators.required, Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      cantBanos: ['', [Validators.required, Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      cantDormitorios: ['', [Validators.required, Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      cochera: [false],
      cantCochera: [{ value: '', disabled: true }, [Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      otrasComodidades: ['', Validators.maxLength(250)],
      tipoPropiedad: ['Departamento', Validators.required],
      pisos: ['', [Validators.required, this.positiveNumberValidator]],
      interior: ['', [Validators.required, this.positiveNumberValidator]],
      ascensor: [false],
      areasComunes: [false],
      areasComunesEspecificas: [{ value: '', disabled: true }, Validators.maxLength(250)],
      pais: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      region: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      provincia: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      distrito: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      tipo: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      manzana: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      lote: ['', [Validators.required, Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      int: ['', [Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      referencia: ['', [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      latitud: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,4})?$/)]],
      longitud: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,4})?$/)]],
      costoTotal: ['', [Validators.required, this.positiveNumberValidator, this.greaterThanZeroValidator]],
      costoInicial: ['', [Validators.required, this.positiveNumberValidator, this.greaterThanZeroValidator]],
      fotos: ['']
    }, { validators: this.initialCostValidator })
    // Observadores para activar/desactivar campos según el estado de los checkboxes
    this.propertyForm.get('cochera')?.valueChanges.subscribe(value => {
      const cantCocheraControl = this.propertyForm.get('cantCochera');
      if (value) {
        cantCocheraControl?.enable();
      } else {
        cantCocheraControl?.disable();
        cantCocheraControl?.reset(); // Limpia el campo si el checkbox está desactivado
      }
    });

    this.propertyForm.get('areasComunes')?.valueChanges.subscribe(value => {
      const espAreasComunes = this.propertyForm.get('areasComunesEspecificas');
      if (value) {
        espAreasComunes?.enable();
      } else {
        espAreasComunes?.disable();
        espAreasComunes?.reset(); // Limpia el campo si el checkbox está desactivado
      }
    });

    // Observador para actualizar el campo costoInicial cuando cambia costoTotal
    this.propertyForm.get('costoTotal')?.valueChanges.subscribe(() => {
      this.propertyForm.get('costoInicial')?.updateValueAndValidity();
    });
  }

  // Validador para números mayores a cero
  greaterThanZeroValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value > 0 ? null : { greaterThanZero: true };
  }

  // Validador para asegurar que costoInicial no sea mayor que costoTotal
  initialCostValidator(formGroup: FormGroup) {
    const totalControl = formGroup.get('costoTotal');
    const initialControl = formGroup.get('costoInicial');

    if (totalControl && initialControl) {
      if (initialControl.value > totalControl.value) {
        initialControl.setErrors({ greaterThanTotal: true });
      } else {
        // Si el error 'greaterThanTotal' ya no aplica, se elimina
        if (initialControl.hasError('greaterThanTotal')) {
          initialControl.setErrors(null);
        }
      }
    }
  }

  // Validador personalizado para números positivos ya existente
  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value !== null && value >= 0 ? null : { positive: true };
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (this.photo.length + files.length > 5) {
      alert('No puedes subir más de 5 imágenes en total');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.photo.push(file); // Almacena el archivo original

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview.push(e.target.result); // Almacena la URL de la imagen para la previsualización
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.photo.splice(index, 1);
    this.photoPreview.splice(index, 1); // Remueve también la previsualización correspondiente
    this.propertyForm.controls['fotos'].setValue(this.photo);
  }

  createDireccion() {
    const tipo = this.propertyForm.get('tipo')?.value;
    const nombre = this.propertyForm.get('nombre')?.value;
    const manzana = this.propertyForm.get('manzana')?.value;
    const lote = this.propertyForm.get('lote')?.value;
    const interior = this.propertyForm.get('int')?.value;
    const referencia = this.propertyForm.get('referencia')?.value;

    let direccion = `${tipo} ${nombre} Mz. ${manzana} Lote ${lote}`;
    if (interior) {
      direccion += ` Int. ${interior}.`;
    }
    direccion += ` ${referencia}.`;

    return direccion;
  }

  onSubmit() {
    this.formSubmitted = true;

    // Verificar si "Otras comodidades" está vacío y asignar "No" si es necesario
    if (!this.propertyForm.get('otrasComodidades')?.value) {
      this.propertyForm.get('otrasComodidades')?.setValue('No');
    }

    // Validar que haya al menos una imagen cargada
    if (this.photo.length === 0) {
      alert('Debe cargar al menos una imagen.');
      return;
    }

    const formData = new FormData();
    const formValues = this.propertyForm.value;

    // Llama a createDireccion y agrega el resultado a formData
    const direccion = this.createDireccion();
    formData.append('direccion', direccion);

    for (let key in formValues) {
      if (key !== 'fotos') {
        formData.append(key, formValues[key]);
      }
    }

    // Agrega las imágenes como archivos
    for (let i = 0; i < this.photo.length; i++) {
      formData.append('fotos', this.photo[i], this.photo[i].name);
    }

    this.agentService.addDepartment(formData).subscribe(
      response => {
        console.log('Departamento agregado exitosamente', response);
        this.router.navigateByUrl('/manageProperties'); // Redireccionar al usuario
      },
      error => {
        console.error('Error al agregar departamento.', error);
        this.router.navigateByUrl('/manageProperties'); // Redireccionar al usuario en caso de error también
      }
    );
  }
}
