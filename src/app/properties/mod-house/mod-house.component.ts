import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { PropertiesService } from "../../services/properties.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AgentService } from "../../services/agent.service";
import { HouseMod } from "../../interfaces/house-mod";
import { NgClass, NgForOf, NgIf } from "@angular/common";

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
export class ModHouseComponent implements OnInit {
  PropiedadId: number = 0;
  propertyForm: FormGroup;
  photoPreview: string[] = [];
  photo: File[] = [];
  formSubmitted = false;

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
      sotano: [false],
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

    this.propertyForm.get('cochera')?.valueChanges.subscribe(value => {
      const cantCocheraControl = this.propertyForm.get('cantCochera');
      value ? cantCocheraControl?.enable() : cantCocheraControl?.disable();
    });

    this.propertyForm.get('jardin')?.valueChanges.subscribe(value => {
      const areaJardinControl = this.propertyForm.get('areaJardin');
      value ? areaJardinControl?.enable() : areaJardinControl?.disable();
    });

    this.propertyForm.get('costoTotal')?.valueChanges.subscribe(() => {
      this.propertyForm.get('costoInicial')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.PropiedadId = +params['id'];
      this.getDataHouse(this.PropiedadId);
    });
  }

  getDataHouse(id: number): void {
    this.propertiesService.getHouseById(id).subscribe((casa: HouseMod) => {
      this.propertyForm.patchValue(casa);
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
      this.photo.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.photo.splice(index, 1);
    this.photoPreview.splice(index, 1);
    this.propertyForm.controls['fotos'].setValue(this.photo);
  }

  cancel() {
    this.router.navigate(['/manageProperties']);
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
      () => {
        alert('Casa modificada exitosamente');
        this.router.navigate(['/manageProperties']);
      },
      (error) => {
        alert('Casa modificada exitosamente');
        console.error('Error al modificar la casa', error);
        this.router.navigate(['/manageProperties']);
      }
    );
  }


  // Validadores y métodos adicionales
  greaterThanZeroValidator(control: AbstractControl): ValidationErrors | null {
    return control.value > 0 ? null : { greaterThanZero: true };
  }

  initialCostValidator(formGroup: FormGroup) {
    const totalControl = formGroup.get('costoTotal');
    const initialControl = formGroup.get('costoInicial');
    if (totalControl && initialControl) {
      initialControl.setErrors(
        initialControl.value > totalControl.value ? { greaterThanTotal: true } : null
      );
    }
  }

  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    return control.value !== null && control.value >= 0 ? null : { positive: true };
  }
}
