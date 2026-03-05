import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestTracking, TestProgress } from '../../../core/services/test-tracking';



interface PerformanceThreshold {
    minPercentage: number;
    maxPercentage: number;
    level: 'low' | 'medium' | 'high';
    message: string;
    continueLink: string;
    continueLinkText: string;
}



@Component({
    selector: 'app-end-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './end-page.html',
    styleUrl: './end-page.css'
})
export class EndPage implements OnInit {
    @Input() testId!: string;
    @Input() testTitle: string = 'Test';
    @Input() thresholds: PerformanceThreshold[] = [
        {
            minPercentage: 0,
            maxPercentage: 25,
            level: 'low',
            message: 'Leider haben Sie den Test nicht bestanden. Bitte wiederholen Sie das Lernmaterial gründlich.',
            continueLink: '/learning/review',
            continueLinkText: 'Lernmaterial wiederholen'
        },
        {
            minPercentage: 25,
            maxPercentage: 80,
            level: 'medium',
            message: 'Gute Arbeit! Sie haben ein solides Verständnis gezeigt.',
            continueLink: '/learning/advanced',
            continueLinkText: 'Weiterführendes Material'
        },
        {
            minPercentage: 80,
            maxPercentage: 100,
            level: 'high',
            message: 'Hervorragend! Sie haben ein ausgezeichnetes Verständnis demonstriert.',
            continueLink: '/learning/next-topic',
            continueLinkText: 'Zum nächsten Thema'
        }
    ];

    totalPoints = 0;
    maxPoints = 0;
    percentage = 0;
    performanceLevel: 'low' | 'medium' | 'high' = 'low';
    performanceMessage = '';
    continueLink = '';
    continueLinkText = '';

    constructor(private testTracking: TestTracking) {}

    ngOnInit() {
        this.calculateResults();
    }

    private calculateResults() {
        const testProgress = this.testTracking.getTestResults(this.testId);
        
        if (!testProgress) {
            console.warn('No test results found for:', this.testId);
            return;
        }

        this.totalPoints = testProgress.pointsEarned;
        this.maxPoints = testProgress.maxPoints;
        this.percentage = (this.totalPoints / this.maxPoints) * 100;

        // Determine performance level based on thresholds
        const threshold = this.thresholds.find(t => 
            this.percentage >= t.minPercentage && this.percentage <= t.maxPercentage
        );

        if (threshold) {
            this.performanceLevel = threshold.level;
            this.performanceMessage = threshold.message;
            this.continueLink = threshold.continueLink;
            this.continueLinkText = threshold.continueLinkText;
        }
    }

    getPerformanceClass(): string {
        return this.performanceLevel;
    }
}