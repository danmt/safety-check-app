import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SafetyCheckApiService } from './safety-check-api.service';

@Component({
  selector: 'safety-check-app-safety-check-details',
  template: `
    <section *ngIf="safetyCheck$ | async as safetyCheck">
      <header
        class="w-full h-64 bg-[url('assets/images/safety-check-details-hero.png')] bg-cover flex items-end"
      >
        <div class="w-full px-8 py-4 bg-black bg-opacity-50">
          <h2 class="text-4xl">Safety Check Details</h2>
          <div class="flex gap-1 items-center">
            <a [routerLink]="['/']" class="underline"> Home </a>
            <mat-icon>chevron_right</mat-icon>
            <a [routerLink]="['/sites', safetyCheck.siteId]" class="underline">
              {{ safetyCheck.siteId }}
            </a>
            <mat-icon>chevron_right</mat-icon>
            <a
              [routerLink]="[
                '/sites',
                safetyCheck.siteId,
                'devices',
                safetyCheck.deviceId
              ]"
              class="underline"
            >
              {{ safetyCheck.deviceId }}
            </a>
            <mat-icon>chevron_right</mat-icon>
            <span>
              {{ safetyCheck.id }}
            </span>
          </div>
        </div>
      </header>

      <div class="p-4">
        <mat-card class="p-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Info
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
  imports: [
    NgIf,
    NgClass,
    AsyncPipe,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
  ],
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
