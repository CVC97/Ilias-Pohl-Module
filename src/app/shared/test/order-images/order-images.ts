import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';



interface ImageOption {
    id: string;
    imageSrc: string;
    label?: string;
}



@Component({
    selector: 'app-test-order-images',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    templateUrl: './order-images.html',
    styleUrl: './order-images.css'
})
export class TestOrderImages implements OnInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() images!: ImageOption[];
    @Input() correctOrder!: string[]; // Array of IDs in correct order
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    
    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: string[];
        pointsAwarded: number;
    }>();

    orderedImages: ImageOption[] = [];
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';

    ngOnInit() {
        // Shuffle images initially (optional)
        this.orderedImages = [...this.images];
    }

    drop(event: CdkDragDrop<ImageOption[]>) {
        if (this.isSubmitted) return; // Can't reorder after submission

        moveItemInArray(this.orderedImages, event.previousIndex, event.currentIndex);
    }

    submitAnswer() {
        if (this.isSubmitted) return; // Already submitted

        this.isSubmitted = true;

        // Get user's order
        const userOrder = this.orderedImages.map(img => img.id);

        // Check if correct
        this.isCorrect = this.arraysEqual(userOrder, this.correctOrder);

        // Award points
        this.pointsAwarded = this.isCorrect ? this.maxPoints : 0;

        // Feedback
        if (this.isCorrect) {
            this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
        } else {
            this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
        }

        // Emit result
        this.onSubmit.emit({
            isCorrect: this.isCorrect,
            userAnswer: userOrder,
            pointsAwarded: this.pointsAwarded
        });
    }

    private arraysEqual(a: string[], b: string[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}