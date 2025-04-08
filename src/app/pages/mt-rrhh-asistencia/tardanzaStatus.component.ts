import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <h6 style="margin: 0;height: 100%;display: flex;justify-content: center;align-items: center;"><span [class]="iconClass()" style="font-weight: 100;">{{ value() }}</span></h6> `,
})
export class tardanzaStatus implements ICellRendererAngularComp {
    value = signal(undefined);
    iconClass = computed(() => (this.value() === 'correcto' ? 'badge bg-primary' : this.value() === 'tardanza' ? 'badge bg-danger' : this.value() === 'sin rango' ? "badge bg-default" : ""));

    agInit(params: ICellRendererParams): void {
        this.value.set(params.value);
    }

    refresh(params: ICellRendererParams) {
        return false;
    }
}