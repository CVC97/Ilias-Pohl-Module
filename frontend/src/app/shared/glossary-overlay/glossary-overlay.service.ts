import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { GlossaryDialogComponent } from './glossary-dialog.component';

@Injectable({ providedIn: 'root' })
export class GlossaryOverlay {
    constructor(private dialog: Dialog) {}

    open(term: string): void {
        this.dialog.open(GlossaryDialogComponent, {
            data: { term },
            hasBackdrop: true,
            backdropClass: 'glossary-overlay-backdrop',
            panelClass: 'glossary-overlay-panel',
            closeOnNavigation: true,
            autoFocus: false,
            width: '90vw',
            maxWidth: '720px',
        });
    }
}
