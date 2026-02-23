import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Analytics } from './analytics';



export interface QuestionResult {
    questionId: string;
    moduleId: string;
    isCorrect: boolean;
    selectedAnswers: string[];
    correctAnswers: string[];
    timestamp: number;
    timestampISO: string;
    attemptCount: number;
    sessionId: string; // NEW: Link to analytics session
}



export interface ModuleProgress {
    moduleId: string;
    startTime: number;
    endTime?: number;
    totalTimeSpent: number;
    totalTimeSpent_s?: number;
    questionsAnswered: number;
    questionsCorrect: number;
    results: QuestionResult[];
    sessionId: string; // NEW: Link to analytics session
}




@Injectable({
    providedIn: 'root'
})



export class ResultsTracking {
    private isBrowser: boolean;
    private currentModuleId: string = '';
    private moduleStartTime: number = 0;
    private results: Map<string, ModuleProgress> = new Map();

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private analyticsService: Analytics // NEW: Inject Analytics
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.loadFromStorage();
        }
    }

    // Start tracking a module
    startModule(moduleId: string) {
        this.currentModuleId = moduleId;
        this.moduleStartTime = Date.now();

        // Get current session ID from Analytics
        const sessionData = this.analyticsService.getSessionData();
        const sessionId = sessionData.sessionId;

        if (!this.results.has(moduleId)) {
            this.results.set(moduleId, {
                moduleId,
                startTime: this.moduleStartTime,
                totalTimeSpent: 0,
                questionsAnswered: 0,
                questionsCorrect: 0,
                results: [],
                sessionId: sessionId
            });
        }

        console.log(`Started tracking module: ${moduleId} in session: ${sessionId}`);
    }

    // Track a question result
    trackQuestionResult(
        questionId: string,
        isCorrect: boolean,
        selectedAnswers: string[],
        correctAnswers: string[]
    ) {
        if (!this.currentModuleId) {
            console.warn('No module started. Call startModule() first.');
            return;
        }

        const moduleProgress = this.results.get(this.currentModuleId);
        if (!moduleProgress) return;

        // Get current session ID
        const sessionData = this.analyticsService.getSessionData();
        const sessionId = sessionData.sessionId;

        // Check if question was already answered
        const existingResult = moduleProgress.results.find(r => r.questionId === questionId);
        
        if (existingResult) {
            // Update existing result (re-attempt)
            existingResult.attemptCount++;
            existingResult.isCorrect = isCorrect;
            existingResult.selectedAnswers = selectedAnswers;
            existingResult.timestamp = Date.now();
            existingResult.timestampISO = new Date().toISOString();
            
            console.log(`RESLOG ${sessionId}: ${questionId} (Re-)Attempt: ${existingResult.attemptCount}, Correct: ${isCorrect}`);
        } else {
            // Add new result (first attempt)
            const result: QuestionResult = {
                questionId,
                moduleId: this.currentModuleId,
                isCorrect,
                selectedAnswers,
                correctAnswers,
                timestamp: Date.now(),
                timestampISO: new Date().toISOString(),
                attemptCount: 1,
                sessionId: sessionId
            };
            moduleProgress.results.push(result);
            moduleProgress.questionsAnswered++;
            
            console.log(`RESLOG: ${questionId}, Correct: ${isCorrect}`);
        }

        if (isCorrect) {
            moduleProgress.questionsCorrect++;
        }

        // this.saveToStorage();
    }

    // End tracking for current module
    endModule() {
        if (!this.currentModuleId) return;

        const moduleProgress = this.results.get(this.currentModuleId);
        if (moduleProgress) {
            moduleProgress.endTime = Date.now();
            moduleProgress.totalTimeSpent = moduleProgress.endTime - moduleProgress.startTime;
            moduleProgress.totalTimeSpent_s = moduleProgress.totalTimeSpent / 1000;
            
            console.log(`Module completed: ${this.currentModuleId}`);
            console.log(`Time spent: ${moduleProgress.totalTimeSpent_s}s`);
            console.log(`Questions correct: ${moduleProgress.questionsCorrect}/${moduleProgress.questionsAnswered}`);
            
            // this.saveToStorage();
        }
    }

    // Get results for a specific module
    getModuleResults(moduleId: string): ModuleProgress | undefined {
        return this.results.get(moduleId);
    }

    // Get all results
    getAllResults(): ModuleProgress[] {
        return Array.from(this.results.values());
    }

    // Get results for current session
    getSessionResults(): ModuleProgress[] {
        const sessionData = this.analyticsService.getSessionData();
        const currentSessionId = sessionData.sessionId;
        
        return Array.from(this.results.values())
            .filter(module => module.sessionId === currentSessionId);
    }

    // Export results as JSON
    exportResults(): string {
        return JSON.stringify(Array.from(this.results.values()), null, 2);
    }

    // Export combined data (analytics + results)
    exportCombinedData(): string {
        const analyticsData = this.analyticsService.getSessionData();
        const resultsData = this.getAllResults();
        
        return JSON.stringify({
            analytics: analyticsData,
            results: resultsData,
            exportTime: new Date().toISOString()
        }, null, 2);
    }

    // Send to backend (combine with analytics)
    async sendToBackend() {
        if (!this.isBrowser) return;

        try {
            const combinedData = {
                analytics: this.analyticsService.getSessionData(),
                results: this.getAllResults(),
                timestamp: new Date().toISOString()
            };

            const response = await fetch('http://localhost:3000/api/combined-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(combinedData)
            });

            const result = await response.json();
            console.log('Combined data sent to backend:', result);
        } catch (error) {
            console.error('Failed to send combined data:', error);
        }
    }

    // Clear all results
    clearResults() {
        this.results.clear();
        if (this.isBrowser) {
            localStorage.removeItem('module-results');
        }
    }

    // Save to localStorage
    private saveToStorage() {
        if (this.isBrowser) {
            const data = Array.from(this.results.entries());
            localStorage.setItem('module-results', JSON.stringify(data));
        }
    }

    // Load from localStorage
    private loadFromStorage() {
        if (this.isBrowser) {
            const stored = localStorage.getItem('module-results');
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    this.results = new Map(data);
                } catch (e) {
                    console.error('Failed to load results from storage', e);
                }
            }
        }
    }
}