import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SafetyCheckListComponent } from '../safety-check';
import { DeviceApiService } from './device-api.service';

@Component({
  selector: 'safety-check-app-device-details',
  template: `
    <section *ngIf="device$ | async as device">
      <header
        class="w-full h-64 bg-[url('assets/images/device-details-hero.png')] bg-cover flex items-end"
      >
        <div class="w-full px-8 py-4 bg-black bg-opacity-50">
          <h2 class="text-4xl">Device Details</h2>
          <div class="flex gap-1 items-center">
            <a [routerLink]="['/']" class="underline"> Home </a>
            <mat-icon>chevron_right</mat-icon>
            <a [routerLink]="['/sites', device.siteId]" class="underline">
              {{ device.siteId }}
            </a>
            <mat-icon>chevron_right</mat-icon>
            <span>
              {{ device.id }}
            </span>
          </div>
        </div>
      </header>

      <div class="p-4">
        <mat-card class="p-4 mb-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Info
          </h2>

          <p>
            ID: {{ device.id }} (
            <span
              class="w-3 h-3 inline-block rounded-full"
              [ngClass]="{
                'bg-red-500':
                  !device.expiresAt || now >= device.expiresAt.getTime(),
                'bg-green-500':
                  device.expiresAt && now < device.expiresAt.getTime()
              }"
            ></span>
            <span class="uppercase">
              {{
                device.expiresAt && now < device.expiresAt.getTime()
                  ? 'safe'
                  : 'unsafe'
              }}
            </span>
            )
          </p>
          <p>Public Key: {{ device.publicKey.toBase58() }}</p>
          <p>Site ID: {{ device.siteId }}</p>
          <p>Inspector: {{ device.inspector?.toBase58() ?? '-' }}</p>
          <p>
            Last Safety Check Public Key:
            {{ device.lastSafetyCheck?.toBase58() ?? '-' }}
          </p>
          <p>
            Expires at:
            {{ device.expiresAt ? (device.expiresAt | date) : '-' }}
          </p>
        </mat-card>

        <safety-check-app-safety-check-list></safety-check-app-safety-check-list>
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
    SafetyCheckListComponent,
  ],
})
export class DeviceDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _deviceApiService = inject(DeviceApiService);

  readonly now = Date.now();
  readonly device$ = this._deviceApiService.devices$.pipe(
    map(
      (devices) =>
        devices.find(
          (device) =>
            device.siteId === this._route.snapshot.paramMap.get('siteId') &&
            device.id === this._route.snapshot.paramMap.get('deviceId')
        ) ?? null
    )
  );
}
