import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MtLoginComponent } from './pages/mt-login/mt-login.component';
import { MtInscriptionPostulantComponent } from './pages/mt-inscription-postulant/mt-inscription-postulant.component';
import { MtVerificationComprobantesComponent } from './pages/mt-verification-comprobantes/mt-verification-comprobantes.component';
import { MtSunatComprobantesComponent } from './pages/mt-sunat-comprobantes/mt-sunat-comprobantes.component';
import { MtConfiguracionComponent } from './pages/mt-configuracion/mt-configuracion.component';
import { MtCreateUserComponent } from './pages/mt-create-user/mt-create-user.component';
import { AuthGuardService as authGuard } from './services/authGuardService';
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
    path: 'inscription',
    component: MtInscriptionPostulantComponent,
    canActivate: [authGuard]
  },
  {
    path: 'comprobantes',
    component: MtVerificationComprobantesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'comprobantes-sunat',
    component: MtSunatComprobantesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'configuracion',
    component: MtConfiguracionComponent
  },
  {
    path: 'create-account/:token',
    component: MtCreateUserComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo:''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
