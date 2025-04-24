import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ButtonDirective, ButtonGroupComponent,
  CardBodyComponent, CardComponent, CardHeaderComponent
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { 
  cilTrash, cilSave, cilPaintBucket,
  cilActionUndo, cilActionRedo,
  cilImagePlus, cilBan 
} from '@coreui/icons';

@Component({
  selector: 'app-whiteboard-view',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IconDirective, 
    ButtonDirective, 
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent
  ],
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit, AfterViewInit {

  // --- Whiteboard Properties ---
  @ViewChild('whiteboardCanvas') whiteboardCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  currentColor: string = '#000';
  brushSize: number = 5;
  private lastX: number = 0;
  private lastY: number = 0;
  currentMode: 'draw' | 'erase' = 'draw';

  // Undo/Redo Stacks
  public undoStack: string[] = [];
  public redoStack: string[] = [];
  private readonly MAX_HISTORY_SIZE = 30; 

  // Background Image
  public backgroundImage: HTMLImageElement | null = null;

  constructor(private iconSetService: IconSetService) { 
    // Register Whiteboard Icons
    iconSetService.icons = { 
      cilTrash, cilSave, cilPaintBucket,
      cilActionUndo, cilActionRedo,
      cilImagePlus, cilBan
    };
  }

  ngOnInit(): void { } // Keep empty or add whiteboard specific init logic if needed

  ngAfterViewInit(): void {
    this.initCanvas();
    this.saveCanvasState(); 
  }

  // --- Canvas Initialization and Resizing ---
  private initCanvas(): void {
    const canvas = this.whiteboardCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  private resizeCanvas(): void {
    if (!this.whiteboardCanvas || !this.ctx) return;
    const canvas = this.whiteboardCanvas.nativeElement;
    const container = canvas.parentElement!;
    const currentDataUrl = this.undoStack[this.undoStack.length - 1]; 

    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    const newWidth = container.clientWidth;
    const newHeight = 500;

    if (newWidth === originalWidth && newHeight === originalHeight) {
      this.applyCurrentStyles();
      return;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    this.drawBackground(true); 

    if (currentDataUrl) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
        this.applyCurrentStyles();
      };
      img.onerror = (err) => {
        console.error("Error loading canvas state after resize:", err);
         this.applyCurrentStyles();
      };
      img.src = currentDataUrl;
    } else {
        this.applyCurrentStyles();
    }
  }

  private drawBackground(clearFirst: boolean = true): void {
    if (!this.ctx || !this.whiteboardCanvas) return;
    const canvas = this.whiteboardCanvas.nativeElement;
    if (clearFirst) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    }
  }

  // --- Drawing Logic ---
  startDrawing(event: MouseEvent): void {
    if (!this.ctx) return;
    this.isDrawing = true;
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    this.lastX = event.clientX - rect.left;
    this.lastY = event.clientY - rect.top;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.ctx) return;
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
  }

  startDrawingTouch(event: TouchEvent): void {
    if (!this.ctx) return;
    event.preventDefault();
    this.isDrawing = true;
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    this.lastX = event.touches[0].clientX - rect.left;
    this.lastY = event.touches[0].clientY - rect.top;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
  }

  drawTouch(event: TouchEvent): void {
    event.preventDefault();
    if (!this.isDrawing || !this.ctx) return;
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    const currentX = event.touches[0].clientX - rect.left;
    const currentY = event.touches[0].clientY - rect.top;
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
  }

  stopDrawing(): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    if (this.ctx) {
      this.ctx.closePath();
    }
    this.saveCanvasState(); 
  }

  // --- Style and Mode ---
  setMode(mode: 'draw' | 'erase'): void {
    this.currentMode = mode;
    this.applyCurrentStyles(); 
  }

  setColor(color: string): void {
    this.currentColor = color;
    this.setMode('draw'); 
  }

  updateCtxBrushSize(newSize: number): void {
    this.applyCurrentStyles(); 
  }

  private applyCurrentStyles(): void {
    if (!this.ctx) return;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalCompositeOperation = this.currentMode === 'erase' ? 'destination-out' : 'source-over';
  }

  // --- Canvas Actions ---
  clearCanvas(): void {
    if (!this.ctx || !this.whiteboardCanvas) return;
    this.drawBackground(true); 
    this.undoStack = []; 
    this.redoStack = [];
    this.saveCanvasState(); 
  }

  saveImage(): void {
    if (!this.whiteboardCanvas) return;
    const canvas = this.whiteboardCanvas.nativeElement;
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `whiteboard_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Undo/Redo ---
  private saveCanvasState(): void {
    if (!this.whiteboardCanvas || !this.ctx) return;
    const canvas = this.whiteboardCanvas.nativeElement;
    setTimeout(() => {
      const dataUrl = canvas.toDataURL();
      if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1] === dataUrl) {
        return;
      }
      this.redoStack = []; 
      this.undoStack.push(dataUrl);
      if (this.undoStack.length > this.MAX_HISTORY_SIZE) {
        this.undoStack.shift(); 
      }
    }, 50);
  }

  private loadImageOntoCanvas(dataUrl: string, clearFirst: boolean = true): void {
    if (!this.ctx || !this.whiteboardCanvas) return;
    const canvas = this.whiteboardCanvas.nativeElement;
    const img = new Image();
    img.onload = () => {
      if (clearFirst) {
          this.drawBackground(true); 
      } 
      this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height); 
      this.applyCurrentStyles();
    };
    img.onerror = (err) => {
      console.error("Error loading canvas state:", err);
    };
    img.src = dataUrl;
  }

  undo(): void {
    if (this.undoStack.length > 1) { 
      const lastState = this.undoStack.pop()!;
      this.redoStack.push(lastState);
      const prevState = this.undoStack[this.undoStack.length - 1];
      this.loadImageOntoCanvas(prevState, true); 
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.loadImageOntoCanvas(nextState, true); 
    }
  }

  // --- Background Image Handling ---
  handleBackgroundImageLoad(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        const img = new Image();
        img.onload = () => {
          this.backgroundImage = img; 
          this.clearCanvas(); 
        };
        img.onerror = (err) => {
            console.error("Error reading background image:", err);
            alert("無法讀取背景圖片檔案"); 
        };
        img.src = e.target.result as string;
      };
      reader.onerror = (err) => {
        console.error("Error reading file:", err);
        alert("讀取檔案時發生錯誤");
      };
      reader.readAsDataURL(file);
    }
    input.value = ''; 
  }

  removeBackgroundImage(): void {
    if (!this.backgroundImage) return; 
    this.backgroundImage = null; 
    this.clearCanvas(); 
  }
}
