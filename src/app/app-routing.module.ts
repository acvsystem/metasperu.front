import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MtLoginComponent } from './pages/mt-login/mt-login.component';
import { MtVerificationComprobantesComponent } from './pages/mt-verification-comprobantes/mt-verification-comprobantes.component';
import { MtArticulosComponent } from './pages/mt-articulos/mt-articulos.component';
import { MtConfiguracionComponent } from './pages/mt-configuracion/mt-configuracion.component';
import { AuthGuardService as authGuard } from './services/authGuardServices';
import { MtRrhhAsistenciaComponent } from './pages/mt-rrhh-asistencia/mt-rrhh-asistencia.component';
import { MtHorarioTiendaComponent } from './pages/mt-horario-tienda/mt-horario-tienda.component';
import { MtAutorizacionHoraExtraComponent } from './pages/mt-autorizacion-hora-extra/mt-autorizacion-hora-extra.component';
import { MtPanelHorarioComponent } from './pages/mt-panel-horario/mt-panel-horario.component';
import { MtPlanillaComponent } from './pages/mt-planilla/mt-planilla.component';
import { MtDetailCajaComponent } from './pages/mt-verification-comprobantes/mt-detail-caja/mt-detail-caja.component';
import { MtDropboxComponent } from './pages/mt-dropbox/mt-dropbox.component';

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
  },
  {
    path: 'auth-hora-extra',
    component: MtAutorizacionHoraExtraComponent,
    canActivate: [authGuard]
  },
  {
    path: 'panel-horario',
    component: MtPanelHorarioComponent,
    canActivate: [authGuard]
  },
  {
    path: 'planilla',
    component: MtPlanillaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'frontRetail',
    component: MtDetailCajaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'drive-cloud',
    component: MtDropboxComponent,
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
