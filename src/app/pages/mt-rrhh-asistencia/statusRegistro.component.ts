import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <h6 style="margin: 0;height: 100%;display: flex;justify-content: center;align-items: center;"><span [class]="iconClass()" style="font-weight: 100;">{{ value() }}</span></h6> `,
})
export class statusRegistro implements ICellRendererAngularComp {
    value = signal(undefined);
    iconClass = computed(() => (this.value() === 'correcto' ? 'badge bg-primary' : 'badge bg-warnning'));

    agInit(params: ICellRendererParams): void {
        if(params.value != 'correcto'){
            this.value.set("revisar");
        }else{
            this.value.set("correcto");
        }
        
    }

    refresh(params: ICellRendererParams) {
        return false;
    }
}