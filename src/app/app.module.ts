import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, isDevMode } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

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
import { HttpClientModule } from '@angular/common/http';
import { MtPopoverComponent } from './components/mt-popover/mt-popover.component';
import { MtSunatComprobantesComponent } from './pages/mt-sunat-comprobantes/mt-sunat-comprobantes.component';
import { MtConfiguracionComponent } from './pages/mt-configuracion/mt-configuracion.component';
import { MtCreateUserComponent } from './pages/mt-create-user/mt-create-user.component';
import { MtSelectComponent } from './components/mt-select/mt-select.component';
import { MtControlAsistenciaComponent } from './pages/mt-control-asistencia/mt-control-asistencia.component';
import { MtNotificationComponent } from './components/mt-notification/mt-notification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MtCalendarComponent } from './components/mt-calendar/mt-calendar.component';
import { MtFrmChangeStdPostulantComponent } from './pages/mt-inscription-postulant/components/mt-frm-change-std-postulant/mt-frm-change-std-postulant.component';
import { MtEmployeeComponent } from './pages/mt-employee/mt-employee.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

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
    MtVerificationComprobantesComponent,
    MtPopoverComponent,
    MtSunatComprobantesComponent,
    MtConfiguracionComponent,
    MtCreateUserComponent,
    MtSelectComponent,
    MtControlAsistenciaComponent,
    MtNotificationComponent,
    MtCalendarComponent,
    MtFrmChangeStdPostulantComponent,
    MtEmployeeComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    FormsModule, 
    ReactiveFormsModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
