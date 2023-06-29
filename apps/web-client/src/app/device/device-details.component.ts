import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DeviceApiService } from './device-api.service';

@Component({
  selector: 'safety-check-app-device-details',
  template: `
    <h2>Device Details</h2>

    <div *ngIf="device$ | async as device">
      <p>ID: {{ device.id }}</p>
      <!-- Display other device properties -->
    </div>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, AsyncPipe],
})
export class DeviceDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _deviceApiService = inject(DeviceApiService);

  readonly device$ = this._deviceApiService.devices$.pipe(
    map(
      (devices) =>
        devices.find(
          (device) =>
            device.id === this._route.snapshot.paramMap.get('deviceId')
        ) ?? null
    )
  );
}
