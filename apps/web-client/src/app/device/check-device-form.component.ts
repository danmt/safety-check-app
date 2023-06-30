import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface CheckDeviceModel {
  siteId: string;
  deviceId: string;
}

export interface CheckDevicePayload {
  siteId: string;
  deviceId: string;
}

@Component({
  selector: 'safety-check-app-check-device-form',
  template: `
    <form
      (ngSubmit)="onCheckDevice()"
      #checkDeviceForm="ngForm"
      name="check-device-form"
    >
      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Site ID"
          name="check-device-form-site-id"
          #siteIdControl="ngModel"
          [(ngModel)]="model.siteId"
          required
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            siteIdControl.invalid &&
            (siteIdControl.dirty || siteIdControl.touched)
          "
          >Site ID is required.</mat-error
        >
      </mat-form-field>

      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Device ID"
          name="check-device-form-device-id"
          #deviceIdControl="ngModel"
          [(ngModel)]="model.deviceId"
          required
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            deviceIdControl.invalid &&
            (deviceIdControl.dirty || deviceIdControl.touched)
          "
          >Device ID is required.</mat-error
        >
      </mat-form-field>

      <div class="flex justify-end">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          [disabled]="disabled"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="checkDeviceForm.invalid || disabled"
        >
          Check
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CheckDeviceFormComponent {
  @Input() siteId = '';
  @Input() disabled = false;
  @Output() checkDevice = new EventEmitter<CheckDevicePayload>();
  @Output() cancel = new EventEmitter<void>();

  model: CheckDeviceModel = { siteId: '', deviceId: '' };

  onCheckDevice() {
    this.checkDevice.emit(this.model);
  }

  onCancel() {
    this.cancel.emit();
  }
}
