import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestTracking } from '../../../core/services/test-tracking';

declare global {
    interface Window {
        MathJax: any;
    }
}

interface ResultContainer {
    id: string;
    imageSrc: string;
    imageAlt?: string;
    correctAnswerIds: string[];
    assignedAnswerIds: string[];
}

interface DraggableAnswer {
    id: string;
    label: string;
}

@Component({
    selector: 'app-test-drag-and-drop',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    templateUrl: './drag-and-drop.html',
    styleUrl: './drag-and-drop.css'
})
export class TestDragDrop implements OnInit, AfterViewInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() questionInstruction?: string;
    @Input() containers!: ResultContainer[];
    @Input() answers!: DraggableAnswer[];
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    
    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: { [containerId: string]: string[] };
        pointsAwarded: number;
    }>();

    resultContainers: ResultContainer[] = [];
    availableAnswers: DraggableAnswer[] = [];
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';

    constructor(
        private testTracking: TestTracking,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        // Initialize containers and answers
        this.resultContainers = this.containers.map(c => ({
            ...c,
            assignedAnswerIds: []
        }));
        this.availableAnswers = JSON.parse(JSON.stringify(this.answers));
        
        // Check if this question was already answered
        this.restorePreviousAnswer();
    }

    ngAfterViewInit() {
        // Render MathJax after view is initialized
        this.renderMath();
    }

    private restorePreviousAnswer() {
        const previousResult = this.testTracking.getQuestionResult(this.questionId);
        
        if (previousResult) {
            // Question was already answered - restore state
            this.isSubmitted = true;
            this.isCorrect = previousResult.isCorrect;
            this.pointsAwarded = previousResult.pointsAwarded;
            
            const userAnswer = previousResult.userAnswer as { [key: string]: string[] };
            
            // Restore assignments
            const usedAnswerIds = new Set<string>();
            this.resultContainers.forEach(container => {
                const assignedIds = userAnswer[container.id] || [];
                container.assignedAnswerIds = [...assignedIds];
                assignedIds.forEach(id => usedAnswerIds.add(id));
            });
            
            // Remove used answers from available
            this.availableAnswers = this.availableAnswers.filter(a => !usedAnswerIds.has(a.id));
            
            // Restore feedback message
            if (this.isCorrect) {
                this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
            } else {
                this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
            }
            
            // Notify parent that this question is already answered
            this.onSubmit.emit({
                isCorrect: this.isCorrect,
                userAnswer: userAnswer,
                pointsAwarded: this.pointsAwarded
            });
            
            console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
            
            // Render math after restoration
            setTimeout(() => this.renderMath(), 100);
        }
    }

    // Render MathJax
    private renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.typesetPromise().catch((err: any) => {
                        console.error('MathJax rendering error:', err);
                    });
                }
            }, 100);
        }
    }

    // Get all connected drop lists (for CDK drag-drop)
    getConnectedLists(): string[] {
        const containerIds = this.resultContainers.map(c => `container-${c.id}`);
        return ['available-answers', ...containerIds];
    }

    // Handle drop event - FIXED VERSION
    drop(event: CdkDragDrop<DraggableAnswer[]>) {
        if (this.isSubmitted) return;

        console.log('Drop event:', {
            previousContainer: event.previousContainer.id,
            currentContainer: event.container.id,
            previousIndex: event.previousIndex,
            currentIndex: event.currentIndex
        });

        if (event.previousContainer === event.container) {
            // Same list - just reorder
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            // Different lists - transfer the answer
            const answer = event.previousContainer.data[event.previousIndex];
            const sourceListId = event.previousContainer.id;
            const targetListId = event.container.id;

            console.log('Moving answer:', answer);

            // Remove from source
            if (sourceListId === 'available-answers') {
                // Remove from available answers array
                const index = this.availableAnswers.findIndex(a => a.id === answer.id);
                if (index !== -1) {
                    this.availableAnswers.splice(index, 1);
                    console.log('Removed from available answers');
                }
            } else {
                // Remove from source container
                const sourceContainerId = sourceListId.replace('container-', '');
                const sourceContainer = this.resultContainers.find(c => c.id === sourceContainerId);
                if (sourceContainer) {
                    const index = sourceContainer.assignedAnswerIds.indexOf(answer.id);
                    if (index !== -1) {
                        sourceContainer.assignedAnswerIds.splice(index, 1);
                        console.log('Removed from source container:', sourceContainerId);
                    }
                }
            }

            // Add to target
            if (targetListId === 'available-answers') {
                // Add back to available answers
                this.availableAnswers.push(answer);
                console.log('Added to available answers');
            } else {
                // Add to target container
                const targetContainerId = targetListId.replace('container-', '');
                const targetContainer = this.resultContainers.find(c => c.id === targetContainerId);
                if (targetContainer) {
                    targetContainer.assignedAnswerIds.push(answer.id);
                    console.log('Added to target container:', targetContainerId, 'Answer ID:', answer.id);
                }
            }
        }

        // Re-render MathJax after drag-drop
        setTimeout(() => this.renderMath(), 50);
    }

    // Remove answer from container
    removeAnswer(container: ResultContainer, answerId: string) {
        if (this.isSubmitted) return;

        const index = container.assignedAnswerIds.indexOf(answerId);
        if (index !== -1) {
            container.assignedAnswerIds.splice(index, 1);
            
            // Return to available answers
            const answer = this.answers.find(a => a.id === answerId);
            if (answer) {
                this.availableAnswers.push(answer);
            }
        }

        // Re-render MathJax after removal
        setTimeout(() => this.renderMath(), 50);
    }

    // Get answer object by ID
    getAnswerById(id: string): DraggableAnswer | undefined {
        return this.answers.find(a => a.id === id);
    }

    // Get assigned answers for a container (returns full answer objects for display)
    getAssignedAnswersForDisplay(container: ResultContainer): DraggableAnswer[] {
        return container.assignedAnswerIds
            .map(id => this.getAnswerById(id))
            .filter(a => a !== undefined) as DraggableAnswer[];
    }

    // Check if container has correct answers
    isContainerCorrect(container: ResultContainer): boolean {
        if (container.assignedAnswerIds.length !== container.correctAnswerIds.length) {
            return false;
        }
        
        // Check all correct answers are present
        const allCorrectPresent = container.correctAnswerIds.every(id => 
            container.assignedAnswerIds.includes(id)
        );
        
        // Check no incorrect answers are present
        const noIncorrectPresent = container.assignedAnswerIds.every(id =>
            container.correctAnswerIds.includes(id)
        );
        
        return allCorrectPresent && noIncorrectPresent;
    }

    // Check if answer should be highlighted as correct/incorrect
    isAnswerCorrect(container: ResultContainer, answerId: string): boolean {
        return container.correctAnswerIds.includes(answerId);
    }

    submitAnswer() {
        if (this.isSubmitted) return;

        this.isSubmitted = true;

        // Build user answer object
        const userAnswer: { [key: string]: string[] } = {};
        this.resultContainers.forEach(container => {
            userAnswer[container.id] = [...container.assignedAnswerIds];
        });

        // Check if all containers correct
        this.isCorrect = this.resultContainers.every(c => this.isContainerCorrect(c));

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
            userAnswer: userAnswer,
            pointsAwarded: this.pointsAwarded
        });
    }
}