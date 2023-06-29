import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
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
    <section *ngIf="devices$ | async as devices">
      <mat-card class="p-4">
        <header class="mb-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Devices List
          </h2>

          <div>
            <button
              mat-raised-button
              color="primary"
              (click)="openCreateDeviceModal()"
            >
              New
            </button>

            <button mat-raised-button (click)="onReloadDevices()">
              Reload
            </button>
          </div>
        </header>

        <ul>
          <li
            *ngFor="let device of devices; let last = last"
            class="mb-4 p-4 bg-black bg-opacity-10 border-l-4 "
            [ngClass]="{
              'border-red-500':
                !device.expiresAt || now >= device.expiresAt.getTime(),
              'border-green-500':
                device.expiresAt && now < device.expiresAt.getTime(),
              'mb-4': !last
            }"
          >
            <p>
              ID: {{ device.id }}

              (
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
            <p>
              Last Safety Check Public Key: {{ device.publicKey.toBase58() }}
            </p>
            <p>
              Expires at:
              {{ device.expiresAt ? (device.expiresAt | date) : '-' }}
            </p>
            <p>
              <a
                [routerLink]="['/sites', siteId, 'devices', device.id]"
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
    NgClass,
    NgFor,
    NgIf,
    RouterLink,
    MatButtonModule,
    MatCardModule,
  ],
})
export class DeviceListComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _deviceApiService = inject(DeviceApiService);
  private readonly _dialog = inject(MatDialog);

  readonly siteId = this._route.snapshot.paramMap.get('siteId');
  readonly devices$ = this._deviceApiService.devices$.pipe(
    map((devices) => devices.filter((device) => device.siteId === this.siteId))
  );
  readonly now = Date.now();

  onReloadDevices() {
    this._deviceApiService.reloadDevices();
  }

  openCreateDeviceModal() {
    this._dialog.open(CreateDeviceModalComponent, {
      data: { siteId: this.siteId },
    });
  }
}
