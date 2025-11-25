import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { ConfirmDialogComponent } from './task_confirm.component';
import { TaskFormDialogComponent } from './task_form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private readonly tasksService = inject(TasksService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  displayedColumns = ['title', 'status', 'dueDate', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;
  sort: Sort = { active: 'createdAt', direction: 'desc' };
  loading = false;

  filterForm = this.fb.group({
    status: ['' as '' | TaskStatus]
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sortRef!: MatSort;

  ngOnInit(): void {
    if (this.isBrowser) {
      this.load();
    }
  }

  load(page: number = this.pageIndex, size: number = this.pageSize, sort: Sort = this.sort): void {
    this.loading = true;
    const sortParam = sort.direction ? `${sort.active},${sort.direction}` : undefined;
    this.tasksService
      .list({
        status: this.filterForm.value.status || undefined,
        page,
        size,
        sort: sortParam
      })
      .subscribe({
        next: (resp) => {
          this.dataSource.data = resp.content;
          this.totalElements = resp.totalElements;
          this.pageIndex = resp.number;
          this.pageSize = resp.size;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onPage(event: PageEvent): void {
    this.load(event.pageIndex, event.pageSize, this.sort);
  }

  onSort(sort: Sort): void {
    this.sort = sort;
    this.load(this.pageIndex, this.pageSize, sort);
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.load(0, this.pageSize, this.sort);
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.applyFilter();
  }

  openCreate(): void {
    const ref = this.dialog.open(TaskFormDialogComponent, {
      width: '480px',
      data: null
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snack.open('Tarea creada', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openEdit(task: Task): void {
    const ref = this.dialog.open(TaskFormDialogComponent, {
      width: '480px',
      data: task
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snack.open('Tarea actualizada', 'Cerrar', { duration: 3000 });
        this.load(this.pageIndex, this.pageSize, this.sort);
      }
    });
  }

  confirmDelete(task: Task): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { title: 'Borrar tarea', message: `¿Eliminar "${task.title}"?` }
    });
    ref.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.tasksService.delete(task.id).subscribe(() => {
          this.snack.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
          this.load(this.pageIndex, this.pageSize, this.sort);
        });
      }
    });
  }
}
