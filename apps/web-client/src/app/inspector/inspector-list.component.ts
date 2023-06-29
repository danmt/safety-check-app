import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CreateInspectorModalComponent } from './create-inspector-modal.component';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-inspector-list',
  template: `
    <section>
      <header class="mb-4">
        <h2>Inspectors</h2>

        <button
          mat-raised-button
          color="primary"
          (click)="openCreateInspectorModal()"
        >
          New
        </button>

        <button mat-raised-button (click)="onReloadInspectors()">Reload</button>
      </header>

      <ul>
        <li *ngFor="let inspector of inspectors$ | async" class="mb-4">
          <mat-card class="p-4">
            <p>Owner: {{ inspector.owner.toBase58() }}</p>
            <p>Public Key: {{ inspector.publicKey.toBase58() }}</p>
            <p>Site ID: {{ inspector.siteId }}</p>
            <p>
              <a
                [routerLink]="[
                  '/sites',
                  siteId,
                  'inspectors',
                  inspector.owner.toBase58()
                ]"
                class="text-blue-400 underline"
              >
                view details
              </a>
            </p>
          </mat-card>
        </li>
      </ul>
    </section>
  `,
  standalone: true,
  imports: [AsyncPipe, NgFor, RouterLink, MatButtonModule, MatCardModule],
})
export class InspectorListComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _inspectorApiService = inject(InspectorApiService);
  private readonly _dialog = inject(MatDialog);

  readonly siteId = this._route.snapshot.paramMap.get('siteId');
  readonly inspectors$ = this._inspectorApiService.inspectors$.pipe(
    map((inspectors) =>
      inspectors.filter((inspector) => inspector.siteId === this.siteId)
    )
  );

  onReloadInspectors() {
    this._inspectorApiService.reloadInspectors();
  }

  openCreateInspectorModal() {
    this._dialog.open(CreateInspectorModalComponent, {
      data: { siteId: this.siteId },
    });
  }
}
