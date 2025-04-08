import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <h6 style="margin: 0;height: 100%;display: flex;justify-content: center;align-items: center;"><span [class]="iconClass()" style="width: 82px;font-weight: 100;">{{ value() }}</span></h6> `,
})
export class statusPapeleta implements ICellRendererAngularComp {
    value = signal(undefined);
    iconClass = computed(() => (this.value() === 'papeleta' ? 'badge bg-warnning' : 'badge bg-default'));

    agInit(params: ICellRendererParams): void {
        if(params.value == 'papeleta'){
            this.value.set("papeleta");
        }else{
            this.value.set("sin papeleta");
        }
        
    }

    refresh(params: ICellRendererParams) {
        return false;
    }
}