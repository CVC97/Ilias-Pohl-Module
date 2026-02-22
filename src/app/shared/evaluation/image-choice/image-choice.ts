import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



interface ImageOption {
    value: string;
    imageSrc: string;
    label?: string;
}



@Component({
    selector: 'app-image-choice',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-choice.html',
    styleUrl: './image-choice.css'
})


export class ImageChoice implements OnInit {
    @Input() question!: string;
    @Input() options!: ImageOption[];
    @Input() correctAnswers!: string[];
    @Input() containerId!: string;
    
    // Custom messages
    @Input() successMessage?: string;
    @Input() emptySelectionMessage?: string = '✗ Bitte wählen Sie mindestens eine Antwort aus.';
    @Input() incompleteMessage?: string = '✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.';
    @Input() incorrectMessage?: string = '✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.';
    
    @Output() onCorrectAnswer = new EventEmitter<void>();
    @Output() onAnswerEvaluated = new EventEmitter<boolean>();

    showResult = false;
    isCorrect = false;
    resultMessage: SafeHtml = '';
    selectedValues: Set<string> = new Set();

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {}

    toggleSelection(value: string) {
        if (this.isCorrect) return; // Disable if already correct
        
        if (this.selectedValues.has(value)) {
            this.selectedValues.delete(value);
        } else {
            this.selectedValues.add(value);
        }
    }

    isSelected(value: string): boolean {
        return this.selectedValues.has(value);
    }

    evaluateAnswer() {
        const selectedAnswers = Array.from(this.selectedValues);

        const allCorrectSelected = this.correctAnswers.every(answer =>
            selectedAnswers.includes(answer)
        );
        const noIncorrectSelected = selectedAnswers.every(answer =>
            this.correctAnswers.includes(answer)
        );

        this.isCorrect = allCorrectSelected && noIncorrectSelected;
        this.showResult = true;

        if (this.isCorrect) {
            this.onCorrectAnswer.emit();
        }
        
        this.onAnswerEvaluated.emit(this.isCorrect);
        this.updateResultMessage(selectedAnswers, allCorrectSelected);
    }

    updateResultMessage(selectedAnswers: string[], allCorrectSelected: boolean) {
        if (this.isCorrect) {
            const message = this.successMessage || '✓ Richtig!';
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);
        } else {
            if (selectedAnswers.length === 0) {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.emptySelectionMessage!);
            } else if (!allCorrectSelected) {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.incompleteMessage!);
            } else {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.incorrectMessage!);
            }
        }
    }
}