import { AsyncPipe, DatePipe, NgClass, NgFor } from '@angular/common';
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
      <mat-card class="p-4">
        <header class="mb-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Safety Checks List
          </h2>

          <div>
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
          </div>
        </header>

        <ul>
          <li
            *ngFor="let safetyCheck of safetyChecks$ | async; let last = last"
            class="mb-4 p-4 bg-black bg-opacity-10 border-l-4 "
            [ngClass]="{
              'border-red-500':
                !safetyCheck.expiresAt ||
                now >= safetyCheck.expiresAt.getTime(),
              'border-green-500':
                safetyCheck.expiresAt && now < safetyCheck.expiresAt.getTime(),
              'mb-4': !last
            }"
          >
            <p>
              ID: {{ safetyCheck.id }} (
              <span
                class="w-3 h-3 inline-block rounded-full"
                [ngClass]="{
                  'bg-red-500':
                    !safetyCheck.expiresAt ||
                    now >= safetyCheck.expiresAt.getTime(),
                  'bg-green-500':
                    safetyCheck.expiresAt &&
                    now < safetyCheck.expiresAt.getTime()
                }"
              ></span>
              <span class="uppercase">
                {{
                  safetyCheck.expiresAt && now < safetyCheck.expiresAt.getTime()
                    ? 'valid'
                    : 'expired'
                }}
              </span>
              )
            </p>
            <p>Public Key: {{ safetyCheck.publicKey.toBase58() }}</p>
            <p>Site ID: {{ safetyCheck.siteId }}</p>
            <p>Device ID: {{ safetyCheck.deviceId }}</p>
            <p>Inspector: {{ safetyCheck.inspector.toBase58() }}</p>
            <p>
              Created at:
              {{ safetyCheck.createdAt | date }}
            </p>
            <p>
              Duration in days:
              {{ safetyCheck.durationInDays }}
            </p>
            <p>
              Expires at:
              {{ safetyCheck.expiresAt | date }}
            </p>
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
          </li>
        </ul>
      </mat-card>
    </section>
  `,
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgFor,
    NgClass,
    RouterLink,
    MatButtonModule,
    MatCardModule,
  ],
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
        (safetyCheck) =>
          safetyCheck.siteId === this.siteId &&
          safetyCheck.deviceId === this.deviceId
      )
    )
  );
  readonly now = Date.now();

  onReloadSafetyChecks() {
    this._safetyCheckApiService.reloadSafetyChecks();
  }

  openCreateSafetyCheckModal() {
    this._dialog.open(CreateSafetyCheckModalComponent, {
      data: { siteId: this.siteId, deviceId: this.deviceId },
    });
  }
}
