import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {PropertiesService} from "../../services/properties.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgentService} from "../../services/agent.service";
import {DepartmentMod} from "../../interfaces/department-mod";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-mod-department',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './mod-department.component.html',
  styleUrl: './mod-department.component.scss'
})
export class ModDepartmentComponent implements OnInit{
  PropiedadId: number = 0;
  propertyForm: FormGroup;
  photo: File[] = []; // Cambia el tipo a File[]
  photoPreview: string[] = [];
  formSubmitted = false; // Indicador para mostrar errores solo después de intentar enviar el formulario

  constructor(
    private fb: FormBuilder,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    protected router: Router,
    private agentService: AgentService
  ) {
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
      direccion: ['', [Validators.required, Validators.maxLength(150)]],
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.PropiedadId = +params['id']; // Obtener el ID de la propiedad desde la URL
      this.obtenerDatosDepa(this.PropiedadId);
    });
  }

  obtenerDatosDepa(id: number): void {
    this.propertiesService.getDepartmentById(id).subscribe((departamento: DepartmentMod) => {
      this.propertyForm.patchValue(departamento);
      // No asignamos las fotos aquí porque queremos que sean seleccionadas por el usuario.
    });
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

  onSubmit() {
    this.formSubmitted = true;

    if (this.propertyForm.invalid) {
      return;
    }

    const depaData: DepartmentMod = this.propertyForm.value;

    const formData = new FormData();
    formData.append('descripcion', depaData.descripcion);
    formData.append('areaTerreno', depaData.areaTerreno.toString());
    formData.append('cantBanos', depaData.cantBanos.toString());
    formData.append('cantDormitorios', depaData.cantDormitorios.toString());
    formData.append('cochera', depaData.cochera.toString());
    formData.append('cantCochera', depaData.cantCochera ? depaData.cantCochera.toString() : '');
    formData.append('otrasComodidades', depaData.otrasComodidades);
    formData.append('tipoPropiedad', depaData.tipoPropiedad);
    formData.append('pisos', depaData.pisos.toString());
    formData.append('interior', depaData.interior ? depaData.interior.toString() : '');
    formData.append('ascensor', depaData.ascensor.toString());
    formData.append('areasComunes', depaData.areasComunes.toString());
    formData.append('areasComunesEspecificas', depaData.areasComunesEspecificas);
    formData.append('pais', depaData.pais);
    formData.append('region', depaData.region);
    formData.append('provincia', depaData.provincia);
    formData.append('distrito', depaData.distrito);
    formData.append('direccion', depaData.direccion);
    formData.append('latitud', depaData.latitud ? depaData.latitud.toString() : '');
    formData.append('longitud', depaData.longitud ? depaData.longitud.toString() : '');
    formData.append('costoTotal', depaData.costoTotal.toString());
    formData.append('costoInicial', depaData.costoInicial.toString());

    this.photo.forEach((file, index) => {
      formData.append('fotos', file, file.name);
    });

    const token = localStorage.getItem('token') || '';

    this.agentService.modDepartment(this.PropiedadId, formData, token).subscribe(
      response => {
        alert('Departamento modificado exitosamente');
        this.router.navigate(['/manageProperties']);
      },
      error => {
        console.error('Error al modificar el Departamento', error);
        this.router.navigate(['/manageProperties']);

      }
    );
  }

}
