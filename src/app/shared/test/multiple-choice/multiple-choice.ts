import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTracking } from '../../../core/services/test-tracking';



interface ChoiceOption {
    value: string;
    label: string;
}



@Component({
    selector: 'app-test-multiple-choice',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './multiple-choice.html',
    styleUrl: './multiple-choice.css'
})
export class TestMultipleChoice implements OnInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() questionInstruction?: string;
    @Input() options!: ChoiceOption[];
    @Input() correctAnswers!: string[]; // Multiple correct answers
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    

    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: string[];
        pointsAwarded: number;
    }>();


    selectedAnswers: Set<string> = new Set();
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';


    constructor(private testTracking: TestTracking) {}


    ngOnInit() {
        // Check if this question was already answered
        this.restorePreviousAnswer();
    }


    private restorePreviousAnswer() {
        const previousResult = this.testTracking.getQuestionResult(this.questionId);
        
        if (previousResult) {
            // Question was already answered - restore state
            this.isSubmitted = true;
            this.isCorrect = previousResult.isCorrect;
            this.pointsAwarded = previousResult.pointsAwarded;
            this.selectedAnswers = new Set(previousResult.userAnswer as string[]);
            
            // Restore feedback message
            if (this.isCorrect) {
                this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
            } else {
                this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
            }
            
            // Notify parent that this question is already answered
            this.onSubmit.emit({
                isCorrect: this.isCorrect,
                userAnswer: Array.from(this.selectedAnswers),
                pointsAwarded: this.pointsAwarded
            });
            
            console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
        }
    }


    toggleOption(value: string) {
        if (this.isSubmitted) return; // Can't change after submission
        
        if (this.selectedAnswers.has(value)) {
            this.selectedAnswers.delete(value);
        } else {
            this.selectedAnswers.add(value);
        }
    }


    isSelected(value: string): boolean {
        return this.selectedAnswers.has(value);
    }


    isCorrectAnswer(value: string): boolean {
        return this.correctAnswers.includes(value);
    }
	

    submitAnswer() {
        if (this.isSubmitted) return; // Already submitted
        if (this.selectedAnswers.size === 0) {
            alert('Bitte wählen Sie mindestens eine Antwort aus.');
            return;
        }

        this.isSubmitted = true;

        const userAnswers = Array.from(this.selectedAnswers);

        // Check if correct (all correct selected AND no incorrect selected)
        const allCorrectSelected = this.correctAnswers.every(answer =>
            userAnswers.includes(answer)
        );
        const noIncorrectSelected = userAnswers.every(answer =>
            this.correctAnswers.includes(answer)
        );

        this.isCorrect = allCorrectSelected && noIncorrectSelected;

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
            userAnswer: userAnswers,
            pointsAwarded: this.pointsAwarded
        });
    }
}