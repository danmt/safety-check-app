import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SafetyCheckListComponent } from '../safety-check';
import { DeviceApiService } from './device-api.service';

@Component({
  selector: 'safety-check-app-device-details',
  template: `
    <section class="flex flex-wrap gap-4 p-4">
      <div class="basis-full">
        <h2>Device Details</h2>

        <mat-card class="p-4" *ngIf="device$ | async as device">
          <p>ID: {{ device.id }}</p>
          <p>Public Key: {{ device.publicKey.toBase58() }}</p>
          <p>Site ID: {{ device.siteId }}</p>
        </mat-card>
      </div>

      <div>
        <safety-check-app-safety-check-list></safety-check-app-safety-check-list>
      </div>
    </section>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, AsyncPipe, MatCardModule, SafetyCheckListComponent],
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
