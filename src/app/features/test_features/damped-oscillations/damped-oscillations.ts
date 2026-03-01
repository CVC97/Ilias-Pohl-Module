import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TestOrderImages } from '../../../shared/test/order-images/order-images';
import { TestTracking } from '../../../core/services/test-tracking';



@Component({
    selector: 'app-damped-oscillations',
    standalone: true,
    imports: [CommonModule, RouterLink, TestOrderImages],
    templateUrl: './damped-oscillations.html',
    styleUrl: './damped-oscillations.css'
})
export class DampedOscillations implements OnInit, OnDestroy {
    // Navigation
    currentPage = 1;
    totalPages = 5;

    // Question 1 data
    question1 = {
        questionId: 'damped-osc-1-order-damping',
        question: 'Ordnen Sie die folgenden Schwingungen nach ihrer Dämpfungsstärke.',
        images: [
            { id: 'weak', imageSrc: 'assets/images/tests/weak_damping.png', label: 'Schwingung A' },
            { id: 'medium', imageSrc: 'assets/images/tests/medium_damping.png', label: 'Schwingung B' },
            { id: 'strong', imageSrc: 'assets/images/tests/strong_damping.png', label: 'Schwingung C' }
        ],
        correctOrder: ['strong', 'medium', 'weak'], // IDs in correct order
        maxPoints: 30,
        containerId: 'test-question-1'
    };

    // Track submissions
    question1Submitted = false;

    constructor(
        private testTracking: TestTracking,
        private router: Router
    ) {}

    ngOnInit() {
        // Start tracking this test
        this.testTracking.startTest('damped-oscillations', 5, 150); // 5 questions, 150 total points
    }

    ngOnDestroy() {
        // End tracking when leaving
        this.testTracking.endTest();
    }

    onQuestion1Submit(result: any) {
        this.question1Submitted = true;

        // Track the result
        this.testTracking.trackQuestionResult(
            this.question1.questionId,
            result.isCorrect,
            result.userAnswer,
            this.question1.correctOrder,
            result.pointsAwarded,
            this.question1.maxPoints
        );
    }

    get canProceed(): boolean {
        // Can only proceed if all questions on current page are submitted
        if (this.currentPage === 1) {
            return this.question1Submitted;
        }
        // Add more conditions for other pages
        return false;
    }

    nextPage() {
        if (this.canProceed && this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
}