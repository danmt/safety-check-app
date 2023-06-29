import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CreateDeviceModalComponent } from './create-device-modal.component';
import { DeviceApiService } from './device-api.service';
import { Device } from './device.model';

@Component({
  selector: 'safety-check-app-device-list',
  template: `
    <section class="p-4">
      <h2>Devices</h2>

      <button
        mat-raised-button
        color="primary"
        (click)="openCreateDeviceModal()"
      >
        New
      </button>

      <ul>
        <li *ngFor="let device of devices" class="mb-4">
          <mat-card class="p-4">
            <p>
              {{ device.id }}
            </p>
            <p>
              <a
                [routerLink]="['/sites', siteId, 'devices', device.id]"
                class="text-blue-400 underline"
              >
                view details
              </a>
            </p>

            <div>
              <button
                (click)="deleteDevice(device.id)"
                mat-raised-button
                color="warn"
              >
                Delete
              </button>
            </div>
          </mat-card>
        </li>
      </ul>
    </section>
  `,
  standalone: true,
  imports: [NgFor, RouterLink, MatButtonModule, MatCardModule],
})
export class DeviceListComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _deviceApiService = inject(DeviceApiService);
  private readonly _dialog = inject(MatDialog);

  siteId = this._route.snapshot.paramMap.get('siteId');
  devices: Device[] = this._deviceApiService.getAllDevices();

  deleteDevice(id: string): void {
    this._deviceApiService.deleteDevice(id);
  }

  openCreateDeviceModal() {
    const dialogRef = this._dialog.open(CreateDeviceModalComponent);

    dialogRef.afterClosed().subscribe((newDevice: Device) => {
      if (newDevice) {
        this._deviceApiService.createDevice(newDevice);
      }
    });
  }
}
