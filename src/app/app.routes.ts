import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddAgentComponent } from './agent/add-agent/add-agent.component';
import { ModAgentComponent } from './agent/mod-agent/mod-agent.component';
import { ManageAgentComponent } from './agent/manage-agent/manage-agent.component';
import { ManagePropertiesComponent } from './properties/manage-properties/manage-properties.component';
import { AddHouseComponent } from './properties/add-house/add-house.component';
import { AddDepartmentComponent } from './properties/add-department/add-department.component';
import { ModHouseComponent } from './properties/mod-house/mod-house.component';
import { ModDepartmentComponent } from './properties/mod-department/mod-department.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { ViewPropertyHouseComponent } from './pages/view-property-house/view-property-house.component';
import { ViewPropertyDepartmentComponent } from './pages/view-property-department/view-property-department.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { authzGuard } from './guards/authz.guard';

export const routes: Routes = [
  { path: 'index', title: 'Inicio', component: IndexComponent },

  { path: 'login', title: 'Iniciar Sesion', component: LoginComponent },

  { path: 'register', title: 'Registrarse', component: RegisterComponent },

  {
    path: 'addAgent',
    title: 'Agregar Agente',
    component: AddAgentComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Inmobiliaria'] },
  },

  {
    path: 'modAgent/:id',
    title: 'Modificar Agente',
    component: ModAgentComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Inmobiliaria'] },
  },

  {
    path: 'manageAgent',
    title: 'Gestionar Agente',
    component: ManageAgentComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Inmobiliaria'] },
  },

  {
    path: 'manageProperties',
    title: 'Gestionar Propiedades',
    component: ManagePropertiesComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Agente'] },
  },

  {
    path: 'addHouse',
    title: 'Agregar Casa',
    component: AddHouseComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Agente'] },
  },

  {
    path: 'addDepartment',
    title: 'Agregar Departamento',
    component: AddDepartmentComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Agente'] },
  },

  {
    path: 'modHouse/:id',
    title: 'Modificar Casa',
    component: ModHouseComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Agente'] },
  },

  {
    path: 'modDepartment/:id',
    title: 'Modificar Departamento',
    component: ModDepartmentComponent,
    canActivate: [authzGuard],
    data: { expectedRoles: ['Agente'] },
  },

  { path: 'properties', title: 'Propiedades', component: PropertiesComponent },

  {
    path: 'viewPropertyHouse/:id',
    title: 'Ver Propiedad',
    component: ViewPropertyHouseComponent,
  },

  {
    path: 'viewPropertyDepartment/:id',
    title: 'Ver Propiedad',
    component: ViewPropertyDepartmentComponent,
  },

  {
    path: 'page-not-found',
    title: 'Página no encontrada',
    component: PageNotFoundComponent,
  },

  { path: '', redirectTo: '/index', pathMatch: 'full' },

  { path: '**', redirectTo: '/page-not-found' },
];
