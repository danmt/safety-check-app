import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CreateDeviceModalComponent } from './create-device-modal.component';
import { DeviceApiService } from './device-api.service';

@Component({
  selector: 'safety-check-app-device-list',
  template: `
    <section>
      <header class="mb-4">
        <h2>Devices</h2>

        <button
          mat-raised-button
          color="primary"
          (click)="openCreateDeviceModal()"
        >
          New
        </button>

        <button mat-raised-button (click)="onReloadDevices()">Reload</button>
      </header>

      <ul>
        <li *ngFor="let device of devices$ | async" class="mb-4">
          <mat-card class="p-4">
            <p>ID: {{ device.id }}</p>
            <p>Public Key: {{ device.publicKey.toBase58() }}</p>
            <p>Site ID: {{ device.siteId }}</p>
            <p>
              <a
                [routerLink]="['/sites', siteId, 'devices', device.id]"
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
export class DeviceListComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _deviceApiService = inject(DeviceApiService);
  private readonly _dialog = inject(MatDialog);

  readonly siteId = this._route.snapshot.paramMap.get('siteId');
  readonly devices$ = this._deviceApiService.devices$.pipe(
    map((devices) => devices.filter((device) => device.siteId === this.siteId))
  );

  onReloadDevices() {
    this._deviceApiService.reloadDevices();
  }

  openCreateDeviceModal() {
    this._dialog.open(CreateDeviceModalComponent, {
      data: { siteId: this.siteId },
    });
  }
}
