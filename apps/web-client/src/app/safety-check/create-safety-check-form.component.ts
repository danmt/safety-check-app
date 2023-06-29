import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface CreateSafetyCheckModel {
  id: string;
  durationInDays: number;
}

export interface CreateSafetyCheckPayload {
  id: string;
  durationInDays: number;
}

@Component({
  selector: 'safety-check-app-create-safety-check-form',
  template: `
    <form
      (ngSubmit)="onCreateSafetyCheck()"
      #createSafetyCheckForm="ngForm"
      name="create-safety-check-form"
    >
      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Site ID"
          name="create-safety-check-form-site-id"
          #siteIdControl="ngModel"
          [ngModel]="siteId"
          required
          readonly
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            siteIdControl.invalid &&
            (siteIdControl.dirty || siteIdControl.touched)
          "
        >
          Site ID is required.
        </mat-error>
      </mat-form-field>

      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Device ID"
          name="create-safety-check-form-device-id"
          #deviceIdControl="ngModel"
          [ngModel]="deviceId"
          required
          readonly
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            deviceIdControl.invalid &&
            (deviceIdControl.dirty || deviceIdControl.touched)
          "
        >
          Device ID is required.
        </mat-error>
      </mat-form-field>

      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Safety Check ID"
          name="create-safety-check-form-safety-check-id"
          #safetyCheckIdControl="ngModel"
          [(ngModel)]="safetyCheck.id"
          required
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            safetyCheckIdControl.invalid &&
            (safetyCheckIdControl.dirty || safetyCheckIdControl.touched)
          "
          >Safety Check ID is required.</mat-error
        >
      </mat-form-field>

      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Duration in days"
          name="create-safety-check-form-safety-duration-in-days"
          #durationInDaysControl="ngModel"
          [(ngModel)]="safetyCheck.durationInDays"
          required
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            durationInDaysControl.invalid &&
            (durationInDaysControl.dirty || durationInDaysControl.touched)
          "
        >
          Duration is required.
        </mat-error>
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
          [disabled]="createSafetyCheckForm.invalid || disabled"
        >
          Create
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CreateSafetyCheckFormComponent {
  @Input() siteId = '';
  @Input() deviceId = '';
  @Input() disabled = false;
  @Output() createSafetyCheck = new EventEmitter<CreateSafetyCheckPayload>();
  @Output() cancel = new EventEmitter<void>();

  safetyCheck: CreateSafetyCheckModel = { id: '', durationInDays: 0 };

  onCreateSafetyCheck() {
    this.createSafetyCheck.emit(this.safetyCheck);
  }

  onCancel() {
    this.cancel.emit();
  }
}
