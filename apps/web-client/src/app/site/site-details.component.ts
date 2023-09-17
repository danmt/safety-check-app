import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DeviceApiService, DeviceListComponent } from '../device';
import { InspectorListComponent } from '../inspector';
import { SiteApiService } from './site-api.service';

@Component({
  selector: 'safety-check-app-site-details',
  template: `
    <section *ngIf="site$ | async as site">
      <header
        class="w-full h-64 bg-[url('assets/images/site-details-hero.png')] bg-cover flex items-end"
      >
        <div class="w-full px-8 py-4 bg-black bg-opacity-50">
          <h2 class="text-4xl">Site Details</h2>
          <div class="flex gap-1 items-center">
            <a [routerLink]="['/']" class="underline"> Home </a>
            <mat-icon>chevron_right</mat-icon>
            <span>
              {{ site.id }}
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

          <p>ID: {{ site.id }}</p>
          <p>Public Key: {{ site.publicKey.toBase58() }}</p>
          <p>Authority: {{ site.authority.toBase58() }}</p>
          <p>
            Devices Status: {{ safeDevicesCount$ | async }}/{{
              devicesCount$ | async
            }}
          </p>
          <p>Warnings: {{ unsafeDevicesCount$ | async }}</p>
        </mat-card>

        <div class="flex gap-4">
          <div class="flex-1">
            <safety-check-app-device-list></safety-check-app-device-list>
          </div>

          <div class="flex-1">
            <safety-check-app-inspector-list></safety-check-app-inspector-list>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: [],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    RouterLink,
    MatCardModule,
    MatIconModule,
    DeviceListComponent,
    InspectorListComponent,
  ],
})
export class SiteDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _siteApiService = inject(SiteApiService);
  private readonly _deviceApiService = inject(DeviceApiService);

  readonly site$ = this._siteApiService.sites$.pipe(
    map(
      (sites) =>
        sites.find(
          (site) => site.id === this._route.snapshot.paramMap.get('siteId')
        ) ?? null
    )
  );
  readonly devicesCount$ = this._deviceApiService.devices$.pipe(
    map(
      (devices) =>
        devices.filter(
          (device) =>
            device.siteId === this._route.snapshot.paramMap.get('siteId')
        ).length
    )
  );
  readonly safeDevicesCount$ = this._deviceApiService.devices$.pipe(
    map(
      (devices) =>
        devices.filter(
          (device) =>
            device.siteId === this._route.snapshot.paramMap.get('siteId') &&
            device.expiresAt &&
            new Date().getTime() < device.expiresAt.getTime()
        ).length
    )
  );
  readonly unsafeDevicesCount$ = this._deviceApiService.devices$.pipe(
    map(
      (devices) =>
        devices.filter(
          (device) =>
            device.siteId === this._route.snapshot.paramMap.get('siteId') &&
            (!device.expiresAt ||
              new Date().getTime() >= device.expiresAt.getTime())
        ).length
    )
  );
}
