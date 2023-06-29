import { Injectable } from '@angular/core';
import { Device } from './device.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceApiService {
  private devices: Device[] = []; // Assuming you have an array to store devices

  getAllDevices(): Device[] {
    return this.devices;
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find((device) => device.id === id);
  }

  createDevice(device: Device): void {
    this.devices.push(device);
  }

  updateDevice(device: Device): void {
    const index = this.devices.findIndex((s) => s.id === device.id);
    if (index !== -1) {
      this.devices[index] = device;
    }
  }

  deleteDevice(id: string): void {
    const index = this.devices.findIndex((device) => device.id === id);
    if (index !== -1) {
      this.devices.splice(index, 1);
    }
  }
}
