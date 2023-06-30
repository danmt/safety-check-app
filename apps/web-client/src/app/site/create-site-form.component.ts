import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CreateSiteModel {
  id: string;
}

export interface CreateSitePayload {
  id: string;
}

@Component({
  selector: 'safety-check-app-create-site-form',
  template: `
    <form (ngSubmit)="onCreateSite(createSiteForm)" #createSiteForm="ngForm">
      <mat-form-field class="w-full">
        <mat-label> Site ID </mat-label>
        <input
          matInput
          placeholder="Site ID"
          name="siteId"
          #siteId="ngModel"
          [(ngModel)]="model.id"
          required
          [disabled]="disabled"
        />
        <mat-error *ngIf="siteId.invalid && (siteId.dirty || siteId.touched)">
          Site ID is required.
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
          [disabled]="createSiteForm.invalid || disabled"
        >
          Create
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CreateSiteFormComponent {
  private readonly _snackBar = inject(MatSnackBar);

  @Input() disabled = false;
  @Output() createSite = new EventEmitter<CreateSitePayload>();
  @Output() cancel = new EventEmitter<void>();

  model: CreateSiteModel = { id: '' };

  onCreateSite(form: NgForm) {
    if (form.invalid) {
      this._snackBar.open('⚠️ Invalid form!', undefined, {
        duration: 3000,
      });
    } else {
      this.createSite.emit(this.model);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
