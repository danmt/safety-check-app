import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DeviceApiService, DeviceListComponent } from '../device';
import { InspectorListComponent } from '../inspector';
import { SiteApiService } from './site-api.service';

@Component({
  selector: 'safety-check-app-site-details',
  template: `
    <div class="p-4" *ngIf="site$ | async as site">
      <div class="flex gap-1 items-center mb-4">
        <span>{{ site.id }}</span>
      </div>

      <section class="flex flex-col gap-4">
        <div class="basis-full">
          <mat-card class="p-4">
            <h2
              class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
            >
              Site Details
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
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <safety-check-app-device-list></safety-check-app-device-list>
          </div>

          <div class="flex-1">
            <safety-check-app-inspector-list></safety-check-app-inspector-list>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: [],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatCardModule,
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
