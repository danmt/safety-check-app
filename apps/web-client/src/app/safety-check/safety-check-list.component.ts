import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CreateSafetyCheckModalComponent } from './create-safety-check-modal.component';
import { SafetyCheckApiService } from './safety-check-api.service';

@Component({
  selector: 'safety-check-app-safety-check-list',
  template: `
    <section>
      <header class="mb-4">
        <h2>Safety Checks</h2>

        <button
          mat-raised-button
          color="primary"
          (click)="openCreateSafetyCheckModal()"
        >
          New
        </button>

        <button mat-raised-button (click)="onReloadSafetyChecks()">
          Reload
        </button>
      </header>

      <ul>
        <li *ngFor="let safetyCheck of safetyChecks$ | async" class="mb-4">
          <mat-card class="p-4">
            <p>ID: {{ safetyCheck.id }}</p>
            <p>Public Key: {{ safetyCheck.publicKey.toBase58() }}</p>
            <p>Site ID: {{ safetyCheck.siteId }}</p>
            <p>
              <a
                [routerLink]="[
                  '/sites',
                  siteId,
                  'devices',
                  deviceId,
                  'safety-checks',
                  safetyCheck.id
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
export class SafetyCheckListComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _safetyCheckApiService = inject(SafetyCheckApiService);
  private readonly _dialog = inject(MatDialog);

  readonly siteId = this._route.snapshot.paramMap.get('siteId');
  readonly deviceId = this._route.snapshot.paramMap.get('deviceId');
  readonly safetyChecks$ = this._safetyCheckApiService.safetyChecks$.pipe(
    map((safetyChecks) =>
      safetyChecks.filter(
        (safetyCheck) => safetyCheck.deviceId === this.deviceId
      )
    )
  );

  onReloadSafetyChecks() {
    this._safetyCheckApiService.reloadSafetyChecks();
  }

  openCreateSafetyCheckModal() {
    this._dialog.open(CreateSafetyCheckModalComponent, {
      data: { siteId: this.siteId, deviceId: this.deviceId },
    });
  }
}
