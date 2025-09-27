import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
import { MtNotificationComponent } from './components/mt-notification/mt-notification.component';
import { MtArticulosComponent } from './pages/mt-articulos/mt-articulos.component';
import { MtPopoverComponent } from './components/mt-popover/mt-popover.component';
import { MtSelectComponent } from './components/mt-select/mt-select.component';
import { MtConfiguracionComponent } from './pages/mt-configuracion/mt-configuracion.component';
import { MtCalendarComponent } from './components/mt-calendar/mt-calendar.component';
import { MtHorarioTiendaComponent } from './pages/mt-horario-tienda/mt-horario-tienda.component';
import { MtTableFilterComponent } from './components/mt-table-filter/mt-table-filter.component';
import { MtTableFilterPapeletasCreadasComponent } from './components/mt-table-filter-papeletas-creadas/mt-table-filter-papeletas-creadas.component';
import { MtTableOficinaComponent } from './components/mt-table-oficina/mt-table-oficina.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MtRrhhAsistenciaComponent } from './pages/mt-rrhh-asistencia/mt-rrhh-asistencia.component';
import { MtTraspasosInventarioComponent } from './pages/mt-traspasos-inventario/mt-traspasos-inventario.component';
import { MtLoadingComponent } from './components/mt-loading/mt-loading.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MtTableMobileComponent } from './components/mt-table-mobile/mt-table-mobile.component';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MtObservacionHorarioComponent } from './components/mt-observacion-horario/mt-observacion-horario.component';
import { MtPapeletaHorarioComponent } from './components/mt-papeleta-horario/mt-papeleta-horario.component';
import { MtAprobarHorasComponent } from './components/mt-aprobar-horas/mt-aprobar-horas.component';
import { MtAutorizacionHoraExtraComponent } from './pages/mt-autorizacion-hora-extra/mt-autorizacion-hora-extra.component';
import { MtPanelHorarioComponent } from './pages/mt-panel-horario/mt-panel-horario.component';
import { MtPapeletaPreviewComponent } from './components/mt-papeleta-preview/mt-papeleta-preview.component';
import { MtPlanillaComponent } from './pages/mt-planilla/mt-planilla.component';
import { MtViewRegistroComponent } from './pages/mt-rrhh-asistencia/components/mt-view-registro/mt-view-registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MtDropboxComponent } from './pages/mt-dropbox/mt-dropbox.component';
import { MtAccionCloudComponent } from './pages/mt-dropbox/mt-accion-cloud/mt-accion-cloud.component';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MtHrExtraConsolidadoComponent } from './components/mt-hr-extra-consolidado/mt-hr-extra-consolidado.component';
import { MtSearchObervacionComponent } from './components/mt-search-obervacion/mt-search-obervacion.component';
import { MtModalComentarioComponent } from './components/mt-modal-comentario/mt-modal-comentario.component';
import { MtModalViewComentarioComponent } from './components/mt-modal-view-comentario/mt-modal-view-comentario.component';
import { MtKardexContabilidadComponent } from './pages/mt-kardex-contabilidad/mt-kardex-contabilidad.component';
import { MtPopoverNotificacionComponent } from './components/mt-popover-notificacion/mt-popover-notificacion.component';
import { MtIcgreportComponent } from './pages/mt-icgreport/mt-icgreport.component';
import { MtTableTraspasosComponent } from './components/mt-table-traspasos/mt-table-traspasos.component';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { MtModalOptionTableMobileComponent } from './components/mt-modal-option-table-mobile/mt-modal-option-table-mobile.component';
import { MtTableAsistenciaViewMobileComponent } from './components/mt-table-asistencia-view-mobile/mt-table-asistencia-view-mobile.component';
registerLocaleData(localeEsPe, 'es-PE');

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
        MtVerificationComprobantesComponent,
        MtNotificationComponent,
        MtArticulosComponent,
        MtPopoverComponent,
        MtSelectComponent,
        MtConfiguracionComponent,
        MtRrhhAsistenciaComponent,
        MtCalendarComponent,
        MtHorarioTiendaComponent,
        MtObservacionHorarioComponent,
        MtPapeletaHorarioComponent,
        MtAprobarHorasComponent,
        MtAutorizacionHoraExtraComponent,
        MtPanelHorarioComponent,
        MtPapeletaPreviewComponent,
        MtPlanillaComponent,
        MtViewRegistroComponent,
        MtDropboxComponent,
        MtAccionCloudComponent,
        MtHrExtraConsolidadoComponent,
        MtSearchObervacionComponent,
        MtModalComentarioComponent,
        MtModalViewComentarioComponent,
        MtTableFilterComponent,
        MtTableFilterPapeletasCreadasComponent,
        MtKardexContabilidadComponent,
        MtTableOficinaComponent,
        MtTraspasosInventarioComponent,
        MtLoadingComponent,
        MtPopoverNotificacionComponent,
        MtIcgreportComponent,
        MtTableMobileComponent,
        MtTableTraspasosComponent,
        MtModalOptionTableMobileComponent,
        MtTableAsistenciaViewMobileComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    bootstrap: [AppComponent],
    imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        DragDropModule,
        PortalModule,
        ScrollingModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDatepicker,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule, MatRippleModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatTimepickerModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ToastrModule.forRoot(),
        SocketIoModule.forRoot(confSocket)],
    providers: [
        { provide: LOCALE_ID, useValue: 'es-PE' },
        provideAnimations(),
        provideToastr({
            positionClass: 'toast-bottom-right',
            progressBar: true,
            preventDuplicates: true
        }),
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        provideHttpClient(
            withInterceptorsFromDi()),
        provideAnimationsAsync()]
})
export class AppModule { }
