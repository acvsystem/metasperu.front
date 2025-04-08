import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

interface buttonAccion extends ICellRendererParams {
    onClick: () => void;
    onClick2: () => void;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<button matTooltip="Ver registro" (click)="onClick()" type="button" class="btn btn-primary btn-sm" style="padding-bottom: 0px;padding-left: 3px;padding-right: 3px;padding-top: 0;margin-right: 5px;">
                <i class="fa fa-eye" aria-hidden="true"></i>
               </button>
                          `,
})
export class CustomButtonComponent implements ICellRendererAngularComp {
    params;

    agInit(params: ICellRendererParams) {
        console.log(params);
        if (params) {
            this.params = params;
        }
    }

    refresh(params: buttonAccion) {
        return true;
    }

    onClick() {
        this.params.miFuncionParaRegresarParametros(this.params.node.data.dataRegistro);
    }

    onClick2() {
        this.params.papParaRegresarParametros(this.params.node.data.papeletas || []);
    }
}