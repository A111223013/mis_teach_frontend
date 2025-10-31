import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(true); // 預設開啟
  private pendingQuestionSubject = new BehaviorSubject<string | null>(null);
  private widthSubject = new BehaviorSubject<number>(380); // 預設寬度
  
  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  public pendingQuestion$: Observable<string | null> = this.pendingQuestionSubject.asObservable();
  public width$: Observable<number> = this.widthSubject.asObservable();

  private readonly MIN_WIDTH = 300;
  private readonly MAX_WIDTH = 800;
  private readonly DEFAULT_WIDTH = 380;
  private readonly STORAGE_KEY = 'sidebar-width';

  constructor() {
    // 從 localStorage 讀取保存的寬度
    const savedWidth = localStorage.getItem(this.STORAGE_KEY);
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= this.MIN_WIDTH && width <= this.MAX_WIDTH) {
        this.widthSubject.next(width);
      }
    }
  }

  openSidebar(question?: string): void {
    this.isOpenSubject.next(true);
    if (question) {
      this.pendingQuestionSubject.next(question);
    }
  }

  closeSidebar(): void {
    this.isOpenSubject.next(false);
    this.pendingQuestionSubject.next(null);
  }

  toggleSidebar(): void {
    const currentState = this.isOpenSubject.value;
    this.isOpenSubject.next(!currentState);
    if (currentState) {
      this.pendingQuestionSubject.next(null);
    }
  }

  getIsOpen(): boolean {
    return this.isOpenSubject.value;
  }

  clearPendingQuestion(): void {
    this.pendingQuestionSubject.next(null);
  }

  setWidth(width: number): void {
    const clampedWidth = Math.max(this.MIN_WIDTH, Math.min(this.MAX_WIDTH, width));
    this.widthSubject.next(clampedWidth);
    localStorage.setItem(this.STORAGE_KEY, clampedWidth.toString());
  }

  getWidth(): number {
    return this.widthSubject.value;
  }

  resetWidth(): void {
    this.setWidth(this.DEFAULT_WIDTH);
  }

  getMinWidth(): number {
    return this.MIN_WIDTH;
  }

  getMaxWidth(): number {
    return this.MAX_WIDTH;
  }
}

