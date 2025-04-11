import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

interface Shoes {
  value: string;
  name: string;
}

@Component({
  selector: 'mt-kardex-contabilidad',
  templateUrl: './mt-kardex-contabilidad.component.html',
  styleUrls: ['./mt-kardex-contabilidad.component.scss'],
})
export class MtKardexContabilidadComponent implements OnInit {
  form: FormGroup;
  vDetallado: Array<any> = [];
  shoes: Shoes[] = [
    { value: 'boots', name: 'Boots' },
    { value: 'clogs', name: 'Clogs' },
    { value: 'loafers', name: 'Loafers' },
    { value: 'moccasins', name: 'Moccasins' },
    { value: 'sneakers', name: 'Sneakers' },
  ];
  shoesControl = new FormControl();

  constructor() {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }

  ngOnInit() {
    console.log(this.shoesControl);
  }

  onCaledar($event) {
    console.log("onCaledar", $event);
    if ($event.isRange) {
      this.vDetallado = [];
      let range = $event.value;
      if (range.length >= 2) {
        this.vDetallado = range;
      }
    }
  }

}
