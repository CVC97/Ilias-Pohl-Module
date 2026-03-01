import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';



export interface TestQuestionResult {
    questionId: string;
    testId: string;
    isCorrect: boolean;
    userAnswer: any;
    correctAnswer: any;
    pointsAwarded: number;
    maxPoints: number;
    timestamp: number;
    timestampISO: string;
    sessionId: string;
}



export interface TestProgress {
    testId: string;
    sessionId: string;
    startTime: number;
    endTime?: number;
    totalTimeSpent?: number;
    totalTimeSpent_s?: number;
    questionsAnswered: number;
    totalQuestions: number;
    pointsEarned: number;
    maxPoints: number;
    percentageScore?: number;
    results: TestQuestionResult[];
}



@Injectable({
    providedIn: 'root'
})
export class TestTracking {
    private isBrowser: boolean;
    private currentTestId: string = '';
    private testStartTime: number = 0;
    private tests: Map<string, TestProgress> = new Map();
    private readonly STORAGE_KEY = 'test-results';


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.loadFromStorage();
        }
    }


    // Start tracking a test
    startTest(testId: string, totalQuestions: number, maxPoints: number) {
        const sessionId = this.sessionService.getSessionId();
        if (!sessionId) {
            console.warn('No session ID available for test tracking');
            return;
        }

        this.currentTestId = testId;
        this.testStartTime = Date.now();

        if (!this.tests.has(testId)) {
            this.tests.set(testId, {
                testId,
                sessionId,
                startTime: this.testStartTime,
                questionsAnswered: 0,
                totalQuestions,
                pointsEarned: 0,
                maxPoints,
                results: []
            });
        }

        console.log(`Started tracking test: ${testId} with ${totalQuestions} questions (${maxPoints} points)`);
    }


    // Track a question result (can only be submitted once)
    trackQuestionResult(
        questionId: string,
        isCorrect: boolean,
        userAnswer: any,
        correctAnswer: any,
        pointsAwarded: number,
        maxPoints: number
    ) {
        if (!this.currentTestId) {
            console.warn('No test started. Call startTest() first.');
            return;
        }

        const sessionId = this.sessionService.getSessionId();
        if (!sessionId) {
            console.warn('No session ID available');
            return;
        }

        const testProgress = this.tests.get(this.currentTestId);
        if (!testProgress) return;

        // Check if question was already answered (should not happen in tests)
        const existingResult = testProgress.results.find(r => r.questionId === questionId);
        
        if (existingResult) {
            console.warn(`Question ${questionId} already answered. Tests allow only one submission.`);
            return;
        }

        // Add new result
        const result: TestQuestionResult = {
            questionId,
            testId: this.currentTestId,
            isCorrect,
            userAnswer,
            correctAnswer,
            pointsAwarded,
            maxPoints,
            timestamp: Date.now(),
            timestampISO: new Date().toISOString(),
            sessionId
        };

        testProgress.results.push(result);
        testProgress.questionsAnswered++;
        testProgress.pointsEarned += pointsAwarded;

        console.log(`Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'} (${pointsAwarded}/${maxPoints} points)`);
        console.log('TESTLOG:', result);

        this.saveToStorage();
    }


    // End tracking for current test
    endTest() {
        if (!this.currentTestId) return;

        const testProgress = this.tests.get(this.currentTestId);
        if (testProgress) {
            testProgress.endTime = Date.now();
            testProgress.totalTimeSpent = testProgress.endTime - testProgress.startTime;
            testProgress.totalTimeSpent_s = testProgress.totalTimeSpent / 1000;
            testProgress.percentageScore = (testProgress.pointsEarned / testProgress.maxPoints) * 100;

            this.saveToStorage();

            console.log(`Test ${this.currentTestId} completed`);
            console.log(`Score: ${testProgress.pointsEarned}/${testProgress.maxPoints} (${testProgress.percentageScore.toFixed(1)}%)`);
            console.log(`Time: ${testProgress.totalTimeSpent_s}s`);
        }
    }


    // Query methods - NEW: Restoration support
    isQuestionAnswered(questionId: string): boolean {
        if (!this.currentTestId) return false;

        const testProgress = this.tests.get(this.currentTestId);
        if (!testProgress) return false;

        return testProgress.results.some(r => r.questionId === questionId);
    }


    getQuestionResult(questionId: string): TestQuestionResult | undefined {
        if (!this.currentTestId) return undefined;

        const testProgress = this.tests.get(this.currentTestId);
        if (!testProgress) return undefined;

        return testProgress.results.find(r => r.questionId === questionId);
    }


    getTestResults(testId: string): TestProgress | undefined {
        return this.tests.get(testId);
    }


    getAllTests(): TestProgress[] {
        return Array.from(this.tests.values());
    }


    getSessionTests(): TestProgress[] {
        const currentSessionId = this.sessionService.getSessionId();
        if (!currentSessionId) return [];

        return Array.from(this.tests.values())
            .filter(test => test.sessionId === currentSessionId);
    }


    // Export methods
    exportTests(): string {
        return JSON.stringify(this.getAllTests(), null, 2);
    }

    // Storage methods
    private saveToStorage() {
        if (this.isBrowser) {
            const data = Array.from(this.tests.entries());
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        }
    }


    private loadFromStorage() {
        if (this.isBrowser) {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    this.tests = new Map(data);
                } catch (e) {
                    console.error('Failed to load test results from storage', e);
                }
            }
        }
    }


    // Backend communication
    async sendToBackend(endpoint: string = 'http://localhost:3000/api/tests') {
        if (!this.isBrowser) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionService.getSessionId(),
                    tests: this.getAllTests(),
                    timestamp: new Date().toISOString()
                })
            });

            const result = await response.json();
            console.log('Test results sent to backend:', result);
        } catch (error) {
            console.error('Failed to send test results:', error);
        }
    }


    // Cleanup
    clearTests() {
        this.tests.clear();
        if (this.isBrowser) {
            localStorage.removeItem(this.STORAGE_KEY);
        }
        console.log('All test results cleared');
    }
}