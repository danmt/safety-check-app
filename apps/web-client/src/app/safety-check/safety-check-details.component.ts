import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SafetyCheckApiService } from './safety-check-api.service';

@Component({
  selector: 'safety-check-app-safety-check-details',
  template: `
    <section class="flex flex-wrap gap-4 p-4">
      <div class="basis-full">
        <mat-card class="p-4" *ngIf="safetyCheck$ | async as safetyCheck">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Safety Check Details
          </h2>
          <p>
            ID: {{ safetyCheck.id }} (
            <span
              class="w-3 h-3 inline-block rounded-full"
              [ngClass]="{
                'bg-red-500':
                  !safetyCheck.expiresAt ||
                  now >= safetyCheck.expiresAt.getTime(),
                'bg-green-500':
                  safetyCheck.expiresAt && now < safetyCheck.expiresAt.getTime()
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
          <p>Mint: {{ safetyCheck.mint.toBase58() }}</p>
          <p>Metadata: {{ safetyCheck.metadata.toBase58() }}</p>
          <p>Master Edition: {{ safetyCheck.masterEdition.toBase58() }}</p>
          <p>Vault: {{ safetyCheck.vault.toBase58() }}</p>
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
        </mat-card>
      </div>
    </section>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, NgClass, AsyncPipe, DatePipe, MatCardModule],
})
export class SafetyCheckDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _safetyCheckApiService = inject(SafetyCheckApiService);

  readonly safetyCheck$ = this._safetyCheckApiService.safetyChecks$.pipe(
    map(
      (safetyChecks) =>
        safetyChecks.find(
          (safetyCheck) =>
            safetyCheck.id ===
              this._route.snapshot.paramMap.get('safetyCheckId') &&
            safetyCheck.deviceId ===
              this._route.snapshot.paramMap.get('deviceId') &&
            safetyCheck.siteId === this._route.snapshot.paramMap.get('siteId')
        ) ?? null
    )
  );
  readonly now = Date.now();
}
