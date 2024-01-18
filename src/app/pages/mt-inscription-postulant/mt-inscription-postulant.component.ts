import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { MtModalContentComponent } from '../../components/mt-modal-content/mt-modal-content.component';
import { ShareService } from 'src/app/services/shareService';
import { jsPDF } from 'jspdf';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'mt-inscription-postulant',
  templateUrl: './mt-inscription-postulant.component.html',
  styleUrls: ['./mt-inscription-postulant.component.scss'],
})
export class MtInscriptionPostulantComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('pagePDF_FC', { static: false }) pagePDF_FC: ElementRef;
  @ViewChild('pagePDF_1', { static: false }) pdfTable_1: ElementRef;
  @ViewChild('pagePDF_2', { static: false }) pdfTable_2: ElementRef;
  @ViewChild('pagePDF_3', { static: false }) pdfTable_3: ElementRef;
  @ViewChild('pagePDF_4', { static: false }) pdfTable_4: ElementRef;

  headList: Array<any> = [];
  bodyList: Array<any> = [];
  actionButton: boolean = true;
  buttonOptionList: Array<any> = [
    {
      text: 'Update',
      type: 'crud',
      fn: 'update',
      options: [{ value: 'Update', fn: 'update' }, { value: 'Delete' }],
    },
  ];

  isAuth: boolean = true;
  isPostulant: boolean = false;
  dataPostulanteList: Array<any> = [];
  datosPersonalesList: Array<any> = [];
  isLoadPDF: boolean = false;

  estadoPostulante: string = '';
  tiendaPostulante: string = '';

  optionListEstado: Array<any> = [
    { key: 'ACEPTADO', value: 'ACEPTADO' },
    { key: 'PENDIENTE', value: 'PENDIENTE' },
  ];

  optionListTiendas: Array<any> = [
    { key: 'BBW JOCKEY', value: 'BBW JOCKEY' },
    { key: 'VSBA JOCKEY', value: 'VSBA JOCKEY' },
    { key: 'AEO JOCKEY', value: 'AEO JOCKEY' },
    { key: 'AEO ASIA', value: 'AEO ASIA' },
    { key: 'VSBA MALL AVENTURA', value: 'VSBA MALL AVENTURA' },
    { key: 'BBW MALL AVENTURA', value: 'BBW MALL AVENTURA' },
    { key: 'BBW LA RAMBLA', value: 'BBW LA RAMBLA' },
    { key: 'VS LA RAMBLA', value: 'VS LA RAMBLA' },
    { key: 'VS PLAZA NORTE', value: 'VS PLAZA NORTE' },
    { key: 'BBW SAN MIGUEL', value: 'BBW SAN MIGUEL' },
    { key: 'VS SAN MIGUEL', value: 'VS SAN MIGUEL' },
    { key: 'BBW SALAVERRY', value: 'BBW SALAVERRY' },
    { key: 'VS SALAVERRY', value: 'VS SALAVERRY' },
    { key: 'VS MALL DEL SUR', value: 'VS MALL DEL SUR' },
    { key: 'VS PURUCHUCO', value: 'VS PURUCHUCO' },
    { key: 'VS ECOMMERCE', value: 'VS ECOMMERCE' },
    { key: 'BBW ECOMMERCE', value: 'BBW ECOMMERCE' },
    { key: 'AEO ECOMMERCE', value: 'AEO ECOMMERCE' },
    { key: 'VS MEGA PLAZA', value: 'VS MEGA PLAZA' },
    { key: 'VS MINKA', value: 'VS MINKA' },
    { key: 'VSFA JOCKEY FULL', value: 'VSFA JOCKEY FULL' },
    { key: 'BBW ASIA', value: 'BBW ASIA' },
  ];

  displayedColumns: string[] = [
    'Nombre completo',
    'Tipo Documento',
    'Numero Documento',
    'Tienda',
    'Estado',
    'Accion',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(
    this.datosPersonalesList
  );

  constructor(
    private sanitized: DomSanitizer,
    public modalCtrl: ModalController,
    private service: ShareService
  ) { }

  ngOnInit() {
    this.onData();
    this.headList = [
      {
        value: '#',
        isSearch: false,
      },
      {
        value: 'Nombre',
        isSearch: false,
        propSearch: [
          {
            input: true,
          },
        ],
      },
      {
        value: 'Apellido Paterno',
        isSearch: false,
        propSearch: [
          {
            input: true,
          },
        ],
      },
      {
        value: 'Apellido Materno',
        isSearch: false,
        propSearch: [
          {
            input: true,
          },
        ],
      },
      {
        value: 'Tipo Documento',
        isSearch: false,
        propSearch: [
          {
            input: true,
          },
        ],
      },
      {
        value: 'Documento',
        isSearch: false,
        propSearch: [
          {
            input: true,
          },
        ],
      },
      {
        value: 'Tienda',
        isSearch: false,
        propSearch: [
          {
            input: true,
          },
        ],
      },
      {
        value: 'Estado',
        isSearch: false,
      },
      {
        value: 'Accion',
        isSearch: false,
      },
    ];
  }

  viewModal: any = -1;
  onViewSearchModal(index) {
    this.viewModal = this.viewModal == index ? -1 : index;
  }

  onData() {
    let parms = {
      url: '/rrhh/search/postulante',
    };

    this.service.get(parms).then((response) => {
      this.datosPersonalesList = [];
      this.dataPostulanteList = ((response || [])[0] || {}).data || [];
      (this.dataPostulanteList || []).filter((dt) => {
        (this.datosPersonalesList || []).push((dt || {}).datos_personales);
      });

      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.datosPersonalesList
      );
      this.dataSource.paginator = this.paginator;
    });
  }

  onSaveOrUpdate(ev: any) { }

  async openModalAddPostulant() {
    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addPostulant',
        title: 'Ingreso a inscripcion',
        bodyContent: 'mt-frm-add-postulant',
      },
      cssClass: 'mt-modal',
    });

    modal.present();
  }

  async openModalGenerateLink() {
    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'generateLink',
        title: 'Generar URL inscripcion',
        bodyContent: 'mt-frm-generate-link',
      },
      cssClass: 'mt-modal',
    });

    modal.present();
  }

  async openModalDireccion(ev) {
    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addressPostulant',
        title: 'Direccion de postulante',
        bodyContent: 'mt-frm-address-postulant',
        dataIn: ev,
      },
      cssClass: 'mt-modal',
    });

    modal.present();
  }

  async onPDF(keyPostulant) {
    let dataPdf = this.dataPostulanteList.filter((dp) => dp.id == keyPostulant);

    let experienciaLaboral: Array<any> = [];
    let experienciaAcademica: Array<any> = [];
    let datosHabientes: Array<any> = [];
    let datosPersonales: Array<any> = [];
    let saludAntecedentes: Array<any> = [];

    experienciaLaboral = dataPdf[0].experiencia_laboral;
    experienciaAcademica = dataPdf[0].formacion_academica;
    datosHabientes = dataPdf[0].derecho_habiente;
    datosPersonales = dataPdf[0].datos_personales;
    saludAntecedentes = dataPdf[0].datos_salud;

    const doc = new jsPDF();
    doc.addImage(
      '../../../assets/LOGO METAS PERU SAC.png',
      'JPEG',
      20,
      5,
      45,
      10
    );
    doc.setFontSize(12);
    doc.text('FICHA DE REGISTRO DE DATOS PERSONALES', 60, 20);
    doc.setFont(undefined, 'bold');
    doc.text('I.', 20, 30);
    doc.text('DATOS PERSONALES', 30, 30);
    doc.setFontSize(11);

    doc.setFont(undefined, 'bold');
    doc.text(`Apellidos y Nombres: `, 30, 37);
    doc.setFont(undefined, 'normal');
    doc.text(
      `${datosPersonales['ap_paterno']} ${datosPersonales['ap_materno']} ${datosPersonales['nombres']}`,
      71,
      37
    );
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Fecha Nacimiento:`, 30, 44);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['fec_nacimiento']}`, 65, 44);

    doc.setFont(undefined, 'bold');
    doc.text(`Pais de Nacimiento:`, 120, 44);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['pais_nacimiento']}`, 158, 44);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Tipo Documento:`, 30, 51);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['tipo_documento']}`, 63, 51);

    doc.setFont(undefined, 'bold');
    doc.text(`Numero Documento:`, 120, 51);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['num_documento']}`, 160, 51);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Sexo:`, 30, 58);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['sexo']}`, 42, 58);

    doc.setFont(undefined, 'bold');
    doc.text(`Estado Civil:`, 120, 58);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['estado_civil']}`, 145, 58);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Domicilio:`, 30, 65);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['direccion']}`, 50, 65);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Referencia:`, 30, 72);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['referencia']}`, 53, 72);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Correo Electronico:`, 30, 79);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['email']}`, 68, 79);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Celular:`, 30, 86);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['num_documento']}`, 46, 86);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Regimen Pensionario:`, 30, 93);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['tipo_pension']}`, 73, 93);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Nombre Contacto de Emergencia:`, 30, 100);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['contacto_emergengia']}`, 94, 100);
    /** END LINE */
    /** LINE */
    doc.setFont(undefined, 'bold');
    doc.text(`Numero Contacto de Emergencia:`, 30, 107);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosPersonales['numero_emergencia']}`, 94, 107);
    /** END LINE */

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('II.', 20, 118);
    doc.text('EXPERIENCIA LABORAL', 30, 118);
    doc.setFontSize(10);
    let lx = 118;
    (experienciaLaboral || []).forEach((x, i) => {
      if (i <= 2) {
        doc.setFont(undefined, 'bold');
        doc.text(`Empresa:`, 20, (lx += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['empresa']}`, 38, lx);

        doc.setFont(undefined, 'bold');
        doc.text(`Puesto:`, 30, (lx += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['puesto']}`, 45, lx);

        doc.setFont(undefined, 'bold');
        doc.text(`Desde:`, 30, (lx += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['desde']}`, 45, lx);

        doc.setFont(undefined, 'bold');
        doc.text(`Hasta:`, 30, (lx += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['culmino']}`, 45, lx);

        doc.setFont(undefined, 'bold');
        doc.text(`Motivo de Cese:`, 30, (lx += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['motivo']}`, 60, lx);
      }
    });

    if (experienciaLaboral.length == 2) {
      doc.setFont(undefined, 'bold');
      doc.text(`Empresa:`, 20, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Puesto:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Desde:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Hasta:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Motivo de Cese:`, 30, (lx += 7));
    }

    if (experienciaLaboral.length == 1) {
      doc.setFont(undefined, 'bold');
      doc.text(`Empresa:`, 20, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Puesto:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Desde:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Hasta:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Motivo de Cese:`, 30, (lx += 7));

      doc.setFont(undefined, 'bold');
      doc.text(`Empresa:`, 20, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Puesto:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Desde:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Hasta:`, 30, (lx += 7));
      doc.setFont(undefined, 'bold');
      doc.text(`Motivo de Cese:`, 30, (lx += 7));
    }

    let lx2 = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');

    doc.text('III.', 20, (lx += 11));
    doc.text('FORMACION ACADEMICA', 30, lx);
    doc.setFontSize(10);
    doc.text(`Estudios Tecnicos:`, 20, (lx += 7));

    (experienciaAcademica || []).forEach((x, i) => {
      if (i <= 1) {
        if (x['tipo'] == 'Tecnica') {
          doc.setFont(undefined, 'bold');
          doc.text(`Centro de estudios:`, 30, (lx += 7));
          doc.setFont(undefined, 'normal');
          doc.text(`${x['ctrEstudio']}`, 65, lx);

          doc.setFont(undefined, 'bold');
          doc.text(`Carrera:`, 30, (lx += 7));
          doc.setFont(undefined, 'normal');
          doc.text(`${x['carrera']}`, 45, lx);

          doc.setFont(undefined, 'bold');
          doc.text(`Estado:`, 120, lx);
          doc.setFont(undefined, 'normal');
          doc.text(`${x['estado']}`, 135, lx);
        } else {
          doc.setFont(undefined, 'bold');
          doc.text(`Centro de estudios:`, 30, (lx += 7));

          doc.setFont(undefined, 'bold');
          doc.text(`Carrera:`, 30, (lx += 7));

          doc.setFont(undefined, 'bold');
          doc.text(`Estado:`, 120, lx);
        }
      }
    });

    if (!(experienciaAcademica || []).length) {
      doc.setFont(undefined, 'bold');
      doc.text(`Centro de estudios:`, 30, (lx += 7));

      doc.setFont(undefined, 'bold');
      doc.text(`Carrera:`, 30, (lx += 7));

      doc.setFont(undefined, 'bold');
      doc.text(`Estado:`, 120, lx);
    }

    doc.setFont(undefined, 'bold');
    doc.text('Estudios Universitarios:', 20, (lx += 7));
    experienciaAcademica.forEach((x, i) => {
      if (i <= 4) {
        if (x['tipo'] == 'Universitario') {
          doc.setFont(undefined, 'bold');
          doc.text(`Centro de estudios:`, 30, (lx += 7));
          doc.setFont(undefined, 'normal');
          doc.text(`${x['ctrEstudio']}`, 65, lx);

          doc.setFont(undefined, 'bold');
          doc.text(`Carrera:`, 30, (lx += 7));
          doc.setFont(undefined, 'normal');
          doc.text(`${x['carrera']}`, 45, lx);

          doc.setFont(undefined, 'bold');
          doc.text(`Estado:`, 120, lx);
          doc.setFont(undefined, 'normal');
          doc.text(`${x['estado']}`, 135, lx);
        } else {
          doc.setFont(undefined, 'bold');
          doc.text(`Centro de estudios:`, 30, (lx += 7));

          doc.setFont(undefined, 'bold');
          doc.text(`Carrera:`, 30, (lx += 7));

          doc.setFont(undefined, 'bold');
          doc.text(`Estado:`, 120, lx);
        }
      }
    });
    doc.addPage();

    doc.addImage(
      '../../../assets/LOGO METAS PERU SAC.png',
      'JPEG',
      lx2,
      5,
      45,
      10
    );
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('IV.', 20, (lx2 += 3));
    doc.text('DATOS DE DERECHOS HABIENTES', 30, lx2);
    doc.setFontSize(10);

    (datosHabientes || []).forEach((x, i) => {
      if (i <= 4) {
        doc.setFont(undefined, 'bold');
        doc.text(`Apellidos y Nombre:`, 30, (lx2 += 10));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['nombres']}`, 65, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Parentesco:`, 30, (lx2 += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['parentesco']}`, 51, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Edad:`, 120, lx2);
        doc.setFont(undefined, 'normal');
        doc.text(`${x['edad']}`, 131, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Sexo:`, 150, lx2);
        doc.setFont(undefined, 'normal');
        doc.text(`${x['sexo']}`, 161, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Tipo Documento:`, 30, (lx2 += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['tipodoc']}`, 60, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Numero Documento:`, 120, lx2);
        doc.setFont(undefined, 'normal');
        doc.text(`${x['nrodoc']}`, 156, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Fecha Nacimiento:`, 30, (lx2 += 7));
        doc.setFont(undefined, 'normal');
        doc.text(`${x['fchnac']}`, 63, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Ocupacion:`, 120, lx2);
        doc.setFont(undefined, 'normal');
        doc.text(`${x['ocupacion']}`, 141, lx2);
      }

      for (let i = 0; i <= 4 - (datosHabientes || []).length; i++) {
        doc.setFont(undefined, 'bold');
        doc.text(`Apellidos y Nombre:`, 30, (lx2 += 10));

        doc.setFont(undefined, 'bold');
        doc.text(`Parentesco:`, 30, (lx2 += 7));

        doc.setFont(undefined, 'bold');
        doc.text(`Edad:`, 120, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Sexo:`, 150, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Tipo Documento:`, 30, (lx2 += 7));

        doc.setFont(undefined, 'bold');
        doc.text(`Numero Documento:`, 120, lx2);

        doc.setFont(undefined, 'bold');
        doc.text(`Fecha Nacimiento:`, 30, (lx2 += 7));

        doc.setFont(undefined, 'bold');
        doc.text(`Ocupacion:`, 120, lx2);
      }
    });
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('V.', 20, (lx2 += 11));
    doc.text('DATOS DE SALUD', 30, lx2);
    doc.setFontSize(10);

    doc.setFont(undefined, 'bold');
    doc.text(`Alergias:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['alergias']}`, 47, lx2);

    doc.setFont(undefined, 'bold');
    doc.text(`Enfermedad:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['enfermedad']}`, 54, lx2);

    doc.setFont(undefined, 'bold');
    doc.text(`Medicamentos:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['medicamento']}`, 57, lx2);

    doc.setFont(undefined, 'bold');
    doc.text(`Grupo Sanguineo:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['grupo_sanguineo']}`, 63, lx2);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('VI.', 20, (lx2 += 9));
    doc.text('ANTECEDENTES', 30, lx2);
    doc.setFontSize(10);

    doc.text(`Tiene antecedentes policiales:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['antecedentes_policiales']}`, 83, lx2);

    doc.setFont(undefined, 'bold');
    doc.text(`Tiene antecedentes judiciales:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['antecedentes_penales']}`, 83, lx2);

    doc.setFont(undefined, 'bold');
    doc.text(`Tiene antecedentes penales:`, 30, (lx2 += 7));
    doc.setFont(undefined, 'normal');
    doc.text(`${saludAntecedentes['antecedentes_penales']}`, 83, lx2);
    doc.addPage();

    let lx3 = 20;

    doc.addImage(
      '../../../assets/LOGO METAS PERU SAC.png',
      'JPEG',
      lx3,
      5,
      45,
      10
    );
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('VII.', 20, (lx3 += 3));
    doc.text('DECLARACION JURADA', 30, lx3);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(
      'DECLARO  QUE TODOS  LOS  DATOS CONSIGNADOS  EN  LA  PRESEN FICHA  SON',
      30,
      (lx3 += 7)
    );
    doc.text(
      'EXACTOS Y VERDADEROS. ASI MISMO, DECLARO QUE EH LEIDO Y ENCONTRADO',
      30,
      (lx3 += 7)
    );
    doc.text('CONFORME LOS DATOS ANTES DESCRITOS.', 30, (lx3 += 7));

    doc.text('_____________________________________________', 30, (lx3 += 40));
    doc.text('Firma y Huella', 65, (lx3 += 7));

    doc.line(130, 80, 180, 80);
    doc.line(130, 110, 180, 110);
    doc.line(130, 80, 130, 110);
    doc.line(180, 110, 180, 80);

    doc.text('V.B. RR.HH', 145, 85);

    let date = new Date();
    const months = {
      0: 'Enero',
      1: 'Febrero',
      2: 'Marzo',
      3: 'Abril',
      4: 'Mayo',
      5: 'Junio',
      6: 'Julio',
      7: 'Agosto',
      8: 'Septiembre',
      9: 'Octubre',
      10: 'Noviembre',
      11: 'Diciembre',
    };

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let fecha = day + ' de ' + months[month] + ' del ' + year;

    doc.setFont(undefined, 'bold');
    doc.text(fecha, 30, 106);
    doc.setFont(undefined, 'normal');

    doc.line(20, 130, 195, 130);
    doc.line(20, 167, 195, 167);
    doc.line(20, 205, 195, 205);

    doc.line(20, 137, 195, 137);
    doc.line(20, 174, 195, 174);

    doc.line(20, 130, 20, 205);
    doc.line(55, 130, 55, 205);
    doc.line(90, 130, 90, 205);
    doc.line(125, 130, 125, 205);
    doc.line(160, 130, 160, 205);
    doc.line(195, 130, 195, 205);

    doc.text('Pulgar Derecho', 25, 135);
    doc.text('Indice Derecho', 61, 135);
    doc.text('Medio Derecho', 95, 135);
    doc.text('Anular Derecho', 130, 135);
    doc.text('Meñique Derecho', 164, 135);

    doc.text('Pulgar Izquierdo', 25, 172);
    doc.text('Indice Izquierdo', 61, 172);
    doc.text('Medio Izquierdo', 95, 172);
    doc.text('Anular Izquierdo', 130, 172);
    doc.text('Meñique Izquierdo', 164, 172);

    doc.setFont(undefined, 'bold');
    doc.text('LLENAR SOLO AL INGRESO DEL POSTULANTE', 70, 220);
    doc.text('_________________________________________', 70, 221);

    doc.setFont(undefined, 'normal');

    doc.text('FECHA DE INGRESO:', 30, 240);
    doc.text('INGRESO APROBADO POR:', 30, 250);
    doc.text('______________________________________________________', 80, 250);

    doc.text('_____________________________________________', 30, 270);
    doc.text('Firma y Huella', 62, 277);

    doc.line(130, 260, 180, 260);
    doc.line(130, 290, 180, 290);
    doc.line(130, 260, 130, 290);
    doc.line(180, 290, 180, 260);

    doc.text('V.B. RR.HH', 145, 265);

    doc.autoPrint();
    doc.save('FICHA DE DATOS.pdf');
  }
  onePostulantData = [];
  onePostulantExpLAb = [];
  onPostulantFormEst = [];
  arrFrTecnica = [];
  arrFrUniv = [];
  arrdDtosHabientes = [];
  arrSaludAntecedentes = [];
  datePDF = "";
  fechaInContrato: string = "";
  fechaOutContrato: string = "";
  emisionContrato:string = "";
  salarioContrato:string = "";
  nomenclatura:string = "";

  async openModalSelectContrato(keyPostulant) {
    let onResponseModal = new EventEmitter();

    onResponseModal.subscribe((outputData) => {
      let data = {
        keyPostulant: keyPostulant,
        outputData: (outputData || {}).opContrato,
        fcIn: (outputData || {}).fechaInContrato,
        fcOut: (outputData || {}).fechaOutContrato,
        salario: (outputData || {}).salario
      }

      this.downloadAsPDF(data);
    });

    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        title: 'Seleccion de tipo de contrato',
        bodyContent: 'mt-select-contratos',
        onResponseModal: onResponseModal
      },
      cssClass: 'mt-modal',

    });

    return await modal.present();
  }

  async downloadAsPDF(data) {
    const self = this;
    let keyPostulant = (data || {}).keyPostulant;
    let optContrato = (data || {}).outputData;
    this.salarioContrato = (data || {}).salario;

    self.isLoadPDF = true;
    self.onePostulantExpLAb = [];
    let datosHabientes: Array<any> = [];
    let datosPersonales: Array<any> = [];
    let saludAntecedentes: Array<any> = [];
    self.onePostulantData = [];
    self.onPostulantFormEst = [];
    self.arrdDtosHabientes = [];
    self.onePostulantExpLAb = [];
    self.arrFrUniv = [];
    self.arrFrTecnica = [];
    let dataPdf = this.dataPostulanteList.filter((dp) => dp.id == keyPostulant);
    let arrExpLab = [];
    let arrFrAcademica = [];

    let date = new Date();
    const months = {
      0: 'Enero',
      1: 'Febrero',
      2: 'Marzo',
      3: 'Abril',
      4: 'Mayo',
      5: 'Junio',
      6: 'Julio',
      7: 'Agosto',
      8: 'Septiembre',
      9: 'Octubre',
      10: 'Noviembre',
      11: 'Diciembre',
    };

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let initContrato = ((data || {}).fcIn).split('-');
    let outContrato = ((data || {}).fcOut).split('-');

    this.fechaInContrato = initContrato[2] + ' de ' + months[initContrato[1] - 1] + ' de ' + initContrato[0];
    this.fechaOutContrato = outContrato[2] + ' de ' + months[outContrato[1] - 1] + ' de ' + outContrato[0];

    self.datePDF = day + ' de ' + months[month] + ' del ' + year;
    this.emisionContrato = day + ' de ' + months[month] + ' de ' + year;
    
    arrExpLab = ((dataPdf || [])[0] || {}).experiencia_laboral;
    arrFrAcademica = ((dataPdf || [])[0] || {}).formacion_academica;

    datosHabientes = ((dataPdf || [])[0] || {}).derecho_habiente;
    datosPersonales = ((dataPdf || [])[0] || {}).datos_personales;
    self.arrSaludAntecedentes = ((dataPdf || [])[0] || {}).datos_salud;

    self.onePostulantData.push(((dataPdf || [])[0] || {}).datos_personales);

    self.onePostulantData.filter((data)=>{
      if(data.sexo == "Hombre"){
        this.nomenclatura = "el sr.";
      }

      if(data.sexo == "Mujer" && data.estado_civil == "Solera(o)"){
        this.nomenclatura = "la srta.";
      }

      if(data.sexo == "Mujer" && data.estado_civil == "Casada(o)"){
        this.nomenclatura = "la sra.";
      }
    });

    self.onPostulantFormEst.push(
      ((dataPdf || [])[0] || {}).formacion_academica
    );


    for (let i = 0; i <= 3; i++) {
      self.arrdDtosHabientes.push({
        edad: ((datosHabientes || [])[i] || {}).edad || '',
        fchnac: ((datosHabientes || [])[i] || {}).fchnac || '',
        nombres: ((datosHabientes || [])[i] || {}).nombres || '',
        nrodoc: ((datosHabientes || [])[i] || {}).nrodoc || '',
        ocupacion: ((datosHabientes || [])[i] || {}).ocupacion || '',
        parentesco: ((datosHabientes || [])[i] || {}).parentesco || '',
        sexo: ((datosHabientes || [])[i] || {}).sexo || '',
        tipodoc: ((datosHabientes || [])[i] || {}).tipodoc || ''
      });
    }
    console.log(self.arrdDtosHabientes);
    for (let i = 0; i <= 2; i++) {
      self.onePostulantExpLAb.push({
        culmino: ((arrExpLab || [])[i] || {}).culmino || '',
        desde: ((arrExpLab || [])[i] || {}).desde || '',
        empresa: ((arrExpLab || [])[i] || {}).empresa || '',
        motivo: ((arrExpLab || [])[i] || {}).motivo || '',
        puesto: ((arrExpLab || [])[i] || {}).puesto || '',
      });
    }

    for (let i = 0; i <= 1; i++) {

      if (!self.arrFrUniv.length && self.arrFrTecnica.length) {
        if ((((arrFrAcademica || [])[i] || {}).tipo || '') != 'Tecnica') {
          self.arrFrUniv.push({
            carrera: ((arrFrAcademica || [])[i] || {}).carrera || '',
            ctrEstudio: ((arrFrAcademica || [])[i] || {}).ctrEstudio || '',
            estado: ((arrFrAcademica || [])[i] || {}).estado || '',
            tipo: ((arrFrAcademica || [])[i] || {}).tipo || '',
          });
        } else {
          self.arrFrUniv.push({
            carrera: ((arrFrAcademica || [])[i] || {}).carrera || '',
            ctrEstudio: ((arrFrAcademica || [])[i] || {}).ctrEstudio || '',
            estado: ((arrFrAcademica || [])[i] || {}).estado || '',
            tipo: ((arrFrAcademica || [])[i] || {}).tipo || '',
          });
        }
      }

      if (!self.arrFrTecnica.length) {
        console.log((((arrFrAcademica || [])[i] || {}).tipo || ''));
        if ((((arrFrAcademica || [])[i] || {}).tipo || '') == 'Tecnica') {
          self.arrFrTecnica.push({
            carrera: ((arrFrAcademica || [])[i] || {}).carrera || '',
            ctrEstudio: ((arrFrAcademica || [])[i] || {}).ctrEstudio || '',
            estado: ((arrFrAcademica || [])[i] || {}).estado || '',
            tipo: ((arrFrAcademica || [])[i] || {}).tipo || '',
          });
        } else {
          self.arrFrTecnica.push({
            carrera: ((arrFrAcademica || [])[i] || {}).carrera || '',
            ctrEstudio: ((arrFrAcademica || [])[i] || {}).ctrEstudio || '',
            estado: ((arrFrAcademica || [])[i] || {}).estado || '',
            tipo: ((arrFrAcademica || [])[i] || {}).tipo || '',
          });
        }
      }
    }

    const doc = new jsPDF('p', 'pt', 'a4');

    setTimeout(() => {
      let pdfTable: any = "";
      let nameDocument: any = {};
      let arrTipoDocument = [
        {
          "key": "pagePDF_1",
          "value": "CONTRATO PART TIME"
        },
        {
          "key": "pagePDF_2",
          "value": "CONTRATO POR TEMPORADA"
        },
        {
          "key": "pagePDF_3",
          "value": "CONTRATO POR NECESIDAD DE MERCADO"
        },
        {
          "key": "pagePDF_4",
          "value": "CONTRATO POR INICIO O INCREMENTO DE ACTIVIDAD"
        },
        {
          "key": "pagePDF_FC",
          "value": "FICHA DE DATOS"
        }
      ];

      pdfTable = document.querySelector(`#${optContrato}`);

      nameDocument = arrTipoDocument.find((pdf) => (pdf || {}).key == optContrato);

      doc.html(pdfTable, {
        callback: function (doc) {
          self.isLoadPDF = false;
          doc.save(`${nameDocument.value}.pdf`);
        },
      });
    }, 2000);

  }

  async openModalChangeEstado(ev) {
    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addPostulant',
        title: 'Cambio de estado',
        bodyContent: 'mt-frm-change-std-postulant',
        dataIn: ev,
      },
      cssClass: 'mt-modal',
    });

    modal.present();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface PeriodicElement {
  nombres: string;
  ap_paterno: string;
  ap_materno: string;
  tipo_documento: string;
  num_documento: string;
  tienda: string;
  estado: string;
}
