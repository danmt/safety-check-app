import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateDeviceFormComponent } from './create-device-form.component';
import { DeviceApiService } from './device-api.service';
import { Device } from './device.model';

@Component({
  selector: 'safety-check-app-create-device-modal',
  template: `
    <div class="p-4 w-[320px]">
      <header class="mt-4 mb-2">
        <h2 class="text-xl text-center">Create Device</h2>
      </header>

      <safety-check-app-create-device-form
        (createDevice)="onCreateDevice($event)"
        (cancel)="closeDialog()"
      ></safety-check-app-create-device-form>
    </div>
  `,
  standalone: true,
  imports: [CreateDeviceFormComponent],
})
export class CreateDeviceModalComponent {
  private readonly _dialogRef = inject(
    MatDialogRef<CreateDeviceModalComponent>
  );
  private readonly _deviceApiService = inject(DeviceApiService);

  onCreateDevice(device: Device): void {
    this._deviceApiService.createDevice(device);
    this._dialogRef.close();
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
