import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TestOrderImages } from '../../../shared/test/order-images/order-images';
import { TestTracking } from '../../../core/services/test-tracking';



declare global {
	interface Window {
		MathJax: any;
    }
}



@Component({
    selector: 'app-damped-oscillations',
    standalone: true,
    imports: [CommonModule, RouterLink, TestOrderImages],
    templateUrl: './damped-oscillations.html',
    styleUrl: './damped-oscillations.css'
})
export class DampedOscillations implements OnInit, OnDestroy {
	
	// Question 1 data
    question1 = {
		questionId: 'damped-osc-1-daempfungsstaerke',
        question: `Bei dem Versuch können Sie die Dämpfung darüber anpassen, dass Sie den Überlappbereich zwischen einem Magneten (eines Magnetfelds) und der Schwungscheibe variieren.
			Ziehen Sie die Bilder in die richtige Reihenfolge (stärkste Dämpfung oben, schwächste unten).`,
		questionInstruction: 'Frage 1 von 5 (30 Punkte): Sortierung Dämpfungskonstante',
        images: [
			{ id: 'weak', imageSrc: 'assets/images/tests/weak_damping.png', label: 'Schwingung A' },
            { id: 'medium', imageSrc: 'assets/images/tests/medium_damping.png', label: 'Schwingung B' },
            { id: 'strong', imageSrc: 'assets/images/tests/strong_damping.png', label: 'Schwingung C' }
        ],
        correctOrder: ['strong', 'medium', 'weak'],
        maxPoints: 30,
        containerId: 'test-question-1'
    };


    // Track submissions
    question1Submitted = false;

	
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private testTracking: TestTracking,
    ) {}
	
	
    ngOnInit() {
		// Start tracking this test
        this.testTracking.startTest('damped-oscillations', 5, 150); // 5 questions, 150 total points
        
        // Restore completion state from previous session
        this.restoreCompletionState();
    }
	
	
    ngOnDestroy() {
		// End tracking when leaving
        this.testTracking.endTest();
    }
	
	
    private restoreCompletionState() {
		// Check if question was already answered
        this.question1Submitted = this.testTracking.isQuestionAnswered(this.question1.questionId);
        
        console.log('Restored test completion state:', {
			q1: this.question1Submitted
        });
    }
	
	
    onQuestion1Submit(result: any) {
		this.question1Submitted = true;
		
        // Track the result (only if not already tracked)
        if (!this.testTracking.isQuestionAnswered(this.question1.questionId)) {
			this.testTracking.trackQuestionResult(
				this.question1.questionId,
                result.isCorrect,
                result.userAnswer,
                this.question1.correctOrder,
                result.pointsAwarded,
                this.question1.maxPoints
            );
        }
    }


    // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				if (window.MathJax) {
					// Clear all previous MathJax processing
					const elements = document.querySelectorAll('.MathJax');
					elements.forEach(el => el.remove());
					
					window.MathJax.typesetPromise();
				}
			}, 100);
		}
	}
	
	
	// +++ in-page navigation +++
	
    // navigation helpers
	currentView: string = 'damped_osc1';
    get isFirstPage(): boolean {
        return this.currentView === 'damped_osc1';
    }



    get canProceed(): boolean {
		// Can only proceed if all questions on current page are submitted
        if (this.currentView === 'damped_osc1') {
			return this.question1Submitted;
        }
        // Add more conditions for other pages
        return false;
    }


    // going back always enabled (for now at least)
    get canGoBack(): boolean {
		// if (this.currentView === 'damped_osc1') return false;
        return true;
    }
	
	
    // going back shows the previous subpage / home page
    goBack() {
		if (this.currentView === 'damped_osc1') {
            this.router.navigate(['learning/intro-experiment']);
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
            this.renderMath();
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
            this.renderMath();
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc2';
            this.renderMath();
        }
    }


    // go forward shows next subpage / page
    goForward() {
        if (this.canProceed) {
            if (this.currentView === 'damped_osc1') {
                this.currentView = 'damped_osc2';
            } else if (this.currentView === 'damped_osc2') {
                this.currentView = 'damped_osc3';
            } else if (this.currentView === 'damped_osc3') {
                this.currentView = 'damped_osc4';
            } else if (this.currentView = 'damped_osc4')
				this.router.navigate(['damped_osc2']);
            this.renderMath();
        }
    }
}