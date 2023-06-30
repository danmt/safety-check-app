import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CreateInspectorModel {
  owner: string;
}

export interface CreateInspectorPayload {
  owner: string;
}

@Component({
  selector: 'safety-check-app-create-inspector-form',
  template: `
    <form
      (ngSubmit)="onCreateInspector(createInspectorForm)"
      #createInspectorForm="ngForm"
      name="create-inspector-form"
    >
      <mat-form-field class="w-full">
        <mat-label> Site ID </mat-label>
        <input
          matInput
          placeholder="Site ID"
          name="create-inspector-form-site-id"
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
        <mat-label> Inspector Owner </mat-label>
        <input
          matInput
          placeholder="Inspector Owner"
          name="create-inspector-form-inspector-owner"
          #inspectorIdControl="ngModel"
          [(ngModel)]="model.owner"
          required
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            inspectorIdControl.invalid &&
            (inspectorIdControl.dirty || inspectorIdControl.touched)
          "
        >
          Inspector Owner is required.
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
          [disabled]="createInspectorForm.invalid || disabled"
        >
          Create
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CreateInspectorFormComponent {
  private readonly _snackBar = inject(MatSnackBar);

  @Input() siteId = '';
  @Input() disabled = false;
  @Output() createInspector = new EventEmitter<CreateInspectorPayload>();
  @Output() cancel = new EventEmitter<void>();

  model: CreateInspectorModel = { owner: '' };

  onCreateInspector(form: NgForm) {
    if (form.invalid) {
      this._snackBar.open('⚠️ Invalid form!', undefined, {
        duration: 3000,
      });
    } else {
      this.createInspector.emit(this.model);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
