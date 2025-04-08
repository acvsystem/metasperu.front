import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

interface buttonAccion extends ICellRendererParams {
    onClick: () => void;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <button (click)="onClick()" style="margin-left: 8px;" type="button" class="btn btn-primary btn-sm" type="button">
                   <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
               </button>
                          `,
})
export class ButtonAccionComponent implements ICellRendererAngularComp {
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
        this.params.miFuncionParaRegresarParametros(this.params.node.data);
    }
}