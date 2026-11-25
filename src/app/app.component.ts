import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Todo = { id: number; title: string; done: boolean; category: string };
type Exercise = { id: number; name: string; detail: string; duration: string; done: boolean; icon: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  today = new Date();
  selectedDate = this.dateKey(this.today);
  newTodo = '';
  newCategory = 'Personal';
  activeTab: 'overview' | 'todos' | 'workout' = 'overview';

  private readonly storageKey = 'fitday-data-v1';

  todos: Todo[] = [
    { id: 1, title: 'Drink water regularly', done: false, category: 'Health' },
    { id: 2, title: 'Eat protein with main meals', done: false, category: 'Nutrition' },
    { id: 3, title: 'Take a 20-minute walk', done: false, category: 'Fitness' },
    { id: 4, title: 'Prepare a balanced dinner', done: false, category: 'Nutrition' }
  ];

  exercises: Exercise[] = [
    { id: 11, name: 'Warm-up march', detail: 'March in place, arm circles and gentle leg movements', duration: '5 min', done: false, icon: '🚶' },
    { id: 12, name: 'Chair squats', detail: 'Sit back toward a sturdy chair, then stand', duration: '2 × 10 reps', done: false, icon: '🦵' },
    { id: 13, name: 'Wall push-ups', detail: 'Keep your body straight and move slowly', duration: '2 × 10 reps', done: false, icon: '💪' },
    { id: 14, name: 'Glute bridges', detail: 'Lift hips gently while lying on your back', duration: '2 × 12 reps', done: false, icon: '🌉' },
    { id: 15, name: 'Dead bugs', detail: 'Move opposite arm and leg while keeping your back comfortable', duration: '2 × 8 each side', done: false, icon: '🐞' },
    { id: 16, name: 'Brisk walk', detail: 'Walk at a pace where you can still talk', duration: '20 min', done: false, icon: '👟' }
  ];

  constructor() { this.load(); }

  get completedTodos(): number { return this.todos.filter(t => t.done).length; }
  get completedExercises(): number { return this.exercises.filter(e => e.done).length; }
  get todoProgress(): number { return this.todos.length ? Math.round(this.completedTodos / this.todos.length * 100) : 0; }
  get exerciseProgress(): number { return this.exercises.length ? Math.round(this.completedExercises / this.exercises.length * 100) : 0; }
  get dateLabel(): string {
    const d = new Date(this.selectedDate + 'T12:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }

  dateKey(d: Date): string {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  changeDay(offset: number): void {
    const d = new Date(this.selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    this.selectedDate = this.dateKey(d);
    this.load();
  }

  addTodo(): void {
    const title = this.newTodo.trim();
    if (!title) return;
    this.todos.unshift({ id: Date.now(), title, done: false, category: this.newCategory });
    this.newTodo = '';
    this.save();
  }

  removeTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
  }

  toggleTodo(todo: Todo): void { todo.done = !todo.done; this.save(); }
  toggleExercise(exercise: Exercise): void { exercise.done = !exercise.done; this.save(); }

  resetWorkout(): void {
    this.exercises = this.exercises.map(e => ({ ...e, done: false }));
    this.save();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(this.storageKey + '-' + this.selectedDate);
      if (raw) {
        const data = JSON.parse(raw);
        this.todos = data.todos ?? this.todos;
        this.exercises = data.exercises ?? this.exercises;
      } else {
        this.todos = this.todos.map(t => ({ ...t, done: false }));
        this.exercises = this.exercises.map(e => ({ ...e, done: false }));
      }
    } catch { /* keep starter data if local storage is unavailable */ }
  }

  private save(): void {
    try {
      localStorage.setItem(this.storageKey + '-' + this.selectedDate, JSON.stringify({
        todos: this.todos, exercises: this.exercises
      }));
    } catch { /* app remains usable if storage is unavailable */ }
  }
}
