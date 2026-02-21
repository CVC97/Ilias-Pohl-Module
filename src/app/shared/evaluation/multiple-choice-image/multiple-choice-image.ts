import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


interface QuestionOption {
	value: string;
	label: string;
}



@Component({
	selector: 'app-multiple-choice-image',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './multiple-choice-image.html',
	styleUrl: './multiple-choice-image.css',
})



export class MultipleChoiceImage implements OnInit {
    @Input() imageSrc!: string;
    @Input() imageAlt!: string;
    @Input() question!: string;
    @Input() options!: QuestionOption[];
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

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {}


    evaluateAnswer() {
        const checkboxes = document.querySelectorAll(
            `.${this.containerId} input[type="checkbox"]`
        );
        const selectedAnswers: string[] = [];

        checkboxes.forEach((checkbox: any) => {
            if (checkbox.checked) {
                selectedAnswers.push(checkbox.value);
            }
        });

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