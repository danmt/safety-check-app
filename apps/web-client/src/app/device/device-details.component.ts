import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceApiService } from './device-api.service';
import { Device } from './device.model';

@Component({
  selector: 'safety-check-app-device-details',
  template: `
    <h2>Device Details</h2>

    <div *ngIf="device">
      <p>ID: {{ device.id }}</p>
      <!-- Display other device properties -->
    </div>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf],
})
export class DeviceDetailsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _deviceApiService = inject(DeviceApiService);

  device: Device | null = null;

  ngOnInit(): void {
    const deviceId = this._route.snapshot.paramMap.get('deviceId');
    if (deviceId) {
      this.device = this._deviceApiService.getDeviceById(deviceId) ?? null;
    }
  }
}
