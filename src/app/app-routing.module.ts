import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MtLoginComponent } from './pages/mt-login/mt-login.component';
import { MtVerificationComprobantesComponent } from './pages/mt-verification-comprobantes/mt-verification-comprobantes.component';
import { MtArticulosComponent } from './pages/mt-articulos/mt-articulos.component';
import { MtConfiguracionComponent } from './pages/mt-configuracion/mt-configuracion.component';
import { AuthGuardService as authGuard } from './services/authGuardServices';
import { MtRrhhAsistenciaComponent } from './pages/mt-rrhh-asistencia/mt-rrhh-asistencia.component';
import { MtHorarioTiendaComponent } from './pages/mt-horario-tienda/mt-horario-tienda.component';
const routes: Routes = [
  {
    path: '',
    component: MtLoginComponent
  },
  {
    path: 'login',
    component: MtLoginComponent
  },
  {
    path: 'comprobantes',
    component: MtVerificationComprobantesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'inventario',
    component: MtArticulosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'configuracion',
    component: MtConfiguracionComponent,
    canActivate: [authGuard]
  },
  {
    path: 'asistencia',
    component: MtRrhhAsistenciaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'horario',
    component: MtHorarioTiendaComponent,
    canActivate: [authGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
