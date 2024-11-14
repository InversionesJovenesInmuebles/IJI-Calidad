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
import {House} from "../../interfaces/house";
import {HouseMod} from "../../interfaces/house-mod";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-mod-house',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './mod-house.component.html',
  styleUrl: './mod-house.component.scss'
})
export class ModHouseComponent implements OnInit{
  PropiedadId: number = 0;
  propertyForm: FormGroup;
  photoPreview: string[] = [];
  photo: File[] = [];
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
      tipoPropiedad: ['Casa', Validators.required],
      cantPisos: ['', [Validators.required, Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      jardin: [false],
      areaJardin: [{ value: '', disabled: true }, [Validators.pattern(/^\d+$/), this.positiveNumberValidator]],
      atico: [false],
      sotano: [false], //Hasta aqui
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
    }, { validators: this.initialCostValidator });

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

    this.propertyForm.get('jardin')?.valueChanges.subscribe(value => {
      const areaJardinControl = this.propertyForm.get('areaJardin');
      if (value) {
        areaJardinControl?.enable();
      } else {
        areaJardinControl?.disable();
        areaJardinControl?.reset(); // Limpia el campo si el checkbox está desactivado
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
      this.getDataHouse(this.PropiedadId);
    });
  }

  getDataHouse(id: number): void {
    this.propertiesService.getHouseById(id).subscribe((casa: HouseMod) => {
      this.propertyForm.patchValue(casa);
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

    const houseData: HouseMod = this.propertyForm.value;

    const formData = new FormData();
    formData.append('descripcion', houseData.descripcion);
    formData.append('areaTerreno', houseData.areaTerreno.toString());
    formData.append('cantBanos', houseData.cantBanos.toString());
    formData.append('cantDormitorios', houseData.cantDormitorios.toString());
    formData.append('cochera', houseData.cochera.toString());
    formData.append('cantCochera', houseData.cantCochera ? houseData.cantCochera.toString() : '');
    formData.append('otrasComodidades', houseData.otrasComodidades);
    formData.append('tipoPropiedad', houseData.tipoPropiedad);
    formData.append('cantPisos', houseData.cantPisos.toString());
    formData.append('jardin', houseData.jardin.toString());
    formData.append('areaJardin', houseData.areaJardin ? houseData.areaJardin.toString() : '');
    formData.append('atico', houseData.atico.toString());
    formData.append('sotano', houseData.sotano.toString());
    formData.append('pais', houseData.pais);
    formData.append('region', houseData.region);
    formData.append('provincia', houseData.provincia);
    formData.append('distrito', houseData.distrito);
    formData.append('direccion', houseData.direccion);
    formData.append('latitud', houseData.latitud ? houseData.latitud.toString() : '');
    formData.append('longitud', houseData.longitud ? houseData.longitud.toString() : '');
    formData.append('costoTotal', houseData.costoTotal.toString());
    formData.append('costoInicial', houseData.costoInicial.toString());

    this.photo.forEach((file, index) => {
      formData.append('fotos', file, file.name);
    });

    const token = localStorage.getItem('token') || '';

    this.agentService.modHouse(this.PropiedadId, formData, token).subscribe(
      response => {
        alert('Casa modificada exitosamente');
        this.router.navigate(['/manageProperties']);
      },
      error => {
        console.error('Error al modificar la casa', error);
        this.router.navigate(['/manageProperties']);
      }
    );
  }
}
