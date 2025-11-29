import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
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

  displayedColumns = ['title', 'status', 'dueDate', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;
  sort: Sort = { active: 'createdAt', direction: 'desc' };
  loading = false;
  error = false;
  readonly skeletonRows = Array.from({ length: 4 });
  readonly statusOptions: { label: string; value: TaskStatus | '' }[] = [
    { label: 'Todos', value: '' },
    { label: 'Abiertas', value: 'OPEN' },
    { label: 'En progreso', value: 'IN_PROGRESS' },
    { label: 'Bloqueadas', value: 'BLOCKED' },
    { label: 'Completadas', value: 'DONE' }
  ];

  filterForm = this.fb.group({
    status: ['OPEN' as '' | TaskStatus],
    search: ['']
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sortRef!: MatSort;

  ngOnInit(): void {
    this.load();
  }

  load(page: number = this.pageIndex, size: number = this.pageSize, sort: Sort = this.sort): void {
    this.loading = true;
    this.error = false;
    const sortParam = sort.direction ? `${sort.active},${sort.direction}` : undefined;
    const status = this.filterForm.value.status || undefined;
    const search = this.filterForm.value.search?.trim() || undefined;

    this.tasksService
      .list({
        status,
        title: search,
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
          this.error = false;
        },
        error: () => {
          this.error = true;
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

  clearFilter(key: 'status' | 'search'): void {
    const nextValue = { ...this.filterForm.value };
    if (key === 'status') {
      nextValue.status = '' as '' | TaskStatus;
    }
    if (key === 'search') {
      nextValue.search = '';
    }
    this.filterForm.setValue({
      status: nextValue.status ?? ('' as '' | TaskStatus),
      search: nextValue.search ?? ''
    });
    this.applyFilter();
  }

  clearFilters(): void {
    this.filterForm.setValue({ status: '' as '' | TaskStatus, search: '' });
    this.applyFilter();
  }

  get activeFilters(): { key: 'status' | 'search'; label: string }[] {
    const filters: { key: 'status' | 'search'; label: string }[] = [];
    const status = this.filterForm.value.status;
    const search = this.filterForm.value.search;
    if (status) {
      filters.push({ key: 'status', label: `Estado: ${this.statusLabel(status)}` });
    }
    if (search?.trim()) {
      filters.push({ key: 'search', label: `Título: "${search.trim()}"` });
    }
    return filters;
  }

  get stats() {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    const open = this.dataSource.data.filter((t) => t.status === 'OPEN').length;
    const dueToday = this.dataSource.data.filter(
      (t) => t.dueDate && t.dueDate.startsWith(todayISO)
    ).length;
    const overdue = this.dataSource.data.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      const isPast = due < new Date(todayISO);
      return isPast && t.status !== 'DONE';
    }).length;
    return {
      total: this.totalElements,
      open,
      dueToday,
      overdue
    };
  }

  statusClass(status: TaskStatus): string {
    switch (status) {
      case 'DONE':
        return 'status-chip done';
      case 'IN_PROGRESS':
        return 'status-chip progress';
      case 'BLOCKED':
        return 'status-chip blocked';
      default:
        return 'status-chip open';
    }
  }

  statusLabel(status: TaskStatus): string {
    switch (status) {
      case 'DONE':
        return 'Completada';
      case 'IN_PROGRESS':
        return 'En progreso';
      case 'BLOCKED':
        return 'Bloqueada';
      default:
        return 'Abierta';
    }
  }

  onRetry(): void {
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
