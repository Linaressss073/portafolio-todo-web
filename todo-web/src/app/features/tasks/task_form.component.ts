import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TasksService } from '../../services/tasks.service';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar tarea' : 'Nueva tarea' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>Título</mat-label>
        <input matInput formControlName="title" />
        <mat-error *ngIf="form.controls.title.hasError('required')">Título requerido</mat-error>
        <mat-error *ngIf="form.controls.title.hasError('maxlength')">Máx 120 caracteres</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="status">
          <mat-option value="OPEN">OPEN</mat-option>
          <mat-option value="DONE">DONE</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Fecha límite</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="dueDate" />
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-hint>Opcional</mat-hint>
      </mat-form-field>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data ? 'Guardar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form {
        display: grid;
        gap: 12px;
        margin-top: 8px;
      }
    `
  ]
})
export class TaskFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    status: ['OPEN' as TaskStatus],
    dueDate: [null as Date | null]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task | null,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        title: this.data.title,
        status: this.data.status,
        dueDate: this.data.dueDate ? new Date(this.data.dueDate) : null
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { title, status, dueDate } = this.form.value;
    const payload = {
      title: title!,
      status: (status as TaskStatus) || undefined,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null
    };

    const request$ = this.data
      ? this.tasksService.update(this.data.id, payload)
      : this.tasksService.create({ title: payload.title, dueDate: payload.dueDate });

    request$.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
