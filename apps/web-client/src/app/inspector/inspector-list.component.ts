import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
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
    <section *ngIf="inspectors$ | async as inspectors">
      <mat-card class="p-4">
        <header class="mb-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Inspectors List
          </h2>

          <div>
            <button
              mat-raised-button
              color="primary"
              (click)="openCreateInspectorModal()"
            >
              New
            </button>

            <button mat-raised-button (click)="onReloadInspectors()">
              Reload
            </button>
          </div>
        </header>

        <ul>
          <li
            *ngFor="let inspector of inspectors; let last = last"
            class="mb-4 p-4 bg-black bg-opacity-10 border-l-4 border-green-500"
            [ngClass]="{ 'mb-4': !last }"
          >
            <p>Owner: {{ inspector.owner.toBase58() }}</p>
            <p>Public Key: {{ inspector.publicKey.toBase58() }}</p>
            <p>Site ID: {{ inspector.siteId }}</p>
            <p>
              <a
                [routerLink]="[
                  '/sites',
                  siteId,
                  'inspectors',
                  inspector.publicKey.toBase58()
                ]"
                class="text-blue-400 underline"
              >
                view details
              </a>
            </p>
          </li>
        </ul>
      </mat-card>
    </section>
  `,
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    NgClass,
    RouterLink,
    MatButtonModule,
    MatCardModule,
  ],
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
