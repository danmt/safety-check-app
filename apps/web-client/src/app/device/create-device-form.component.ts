import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Device } from './device.model';

@Component({
  selector: 'safety-check-app-create-device-form',
  template: `
    <form (ngSubmit)="onCreateDevice()" #createDeviceForm="ngForm">
      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Device ID"
          name="deviceId"
          #deviceId="ngModel"
          [(ngModel)]="device.id"
          required
        />
        <mat-error
          *ngIf="deviceId.invalid && (deviceId.dirty || deviceId.touched)"
          >Device ID is required.</mat-error
        >
      </mat-form-field>
      <div class="flex justify-end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="createDeviceForm.invalid"
        >
          Create
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CreateDeviceFormComponent {
  @Output() createDevice = new EventEmitter<Device>();
  @Output() cancel = new EventEmitter<void>();

  device: Device = { id: '' };

  onCreateDevice() {
    this.createDevice.emit(this.device);
    this.resetForm();
  }

  onCancel() {
    this.cancel.emit();
  }

  private resetForm(): void {
    this.device = { id: '' }; // Reset the form
  }
}
