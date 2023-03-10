import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MtLoginComponent } from './pages/mt-login/mt-login.component';
import { MtInputComponent } from './components/mt-input/mt-input.component';
import { MtInscriptionPostulantComponent } from './pages/mt-inscription-postulant/mt-inscription-postulant.component';
import { MtDatatableComponent } from './components/mt-datatable/mt-datatable.component';
import { MtModalContentComponent } from './components/mt-modal-content/mt-modal-content.component';
import { MtFrmAddPostulantComponent } from './pages/mt-inscription-postulant/components/mt-frm-add-postulant/mt-frm-add-postulant.component';
import { MtFrmGenerateLinkComponent } from './pages/mt-inscription-postulant/components/mt-frm-generate-link/mt-frm-generate-link.component';
import { MtTooltipComponent } from './components/mt-tooltip/mt-tooltip.component';
import { MtFrmInscriptionComponent } from './pages/mt-inscription-postulant/components/mt-frm-inscription/mt-frm-inscription.component';
import { MtNavStepComponent } from './components/mt-nav-step/mt-nav-step.component';
import { MtVerificationComprobantesComponent } from './pages/mt-verification-comprobantes/mt-verification-comprobantes.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const confSocket: SocketIoConfig = { url: 'http://localhost:3200', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    MtLoginComponent,
    MtInputComponent,
    MtInscriptionPostulantComponent,
    MtDatatableComponent,
    MtModalContentComponent,
    MtFrmAddPostulantComponent,
    MtFrmGenerateLinkComponent,
    MtTooltipComponent,
    MtFrmInscriptionComponent,
    MtNavStepComponent,
    MtVerificationComprobantesComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SocketIoModule.forRoot(confSocket)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
