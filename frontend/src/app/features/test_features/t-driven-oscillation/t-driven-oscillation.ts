import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TestTracking } from '../../../core/services/test-tracking';
import { TestOrderImages } from '../../../shared/test/order-images/order-images';
import { TestSingleChoice } from '../../../shared/test/single-choice/single-choice';
import { TestMultipleChoice } from '../../../shared/test/multiple-choice/multiple-choice';
import { TestDragDrop } from '../../../shared/test/drag-and-drop/drag-and-drop';
import { EndPage } from '../../../shared/test/end-page/end-page';

@Component({
  selector: 'app-t-driven-oscillation',
  imports: [],
  templateUrl: './t-driven-oscillation.html',
  styleUrl: './t-driven-oscillation.css',
})

export class TDrivenOscillation implements OnInit, OnDestroy {

    // Custom thresholds for this test
    performanceThresholds = [
        {
            minPercentage: 0,
            maxPercentage: 79,
            level: 'low' as const,
            message: 'In Bezug auf getriebene Schwingungen fehlen Ihnen noch einige Aspekte. Entscheiden Sie selber, wie Sie fortfahren möchten. Sie können sich entweder zunächst mit den Bewegungsmustern anhand einer interaktiven Simulation vertraut machen, oder die theoretischen Grundlagen in einem interaktiven Lernmodul erarbeiten.',
            continueLink: '/experiment/intro',
            continueLinkText: 'Weiter zur Simulation',
            continueLink2: '/learning/resonance',
            continueLinkText2: 'Weiter zu den theoretischen Grundlagen'
        },
        {
            minPercentage: 80,
            maxPercentage: 100,
            level: 'high' as const,
            message: 'Sie haben ein gutes Grundlagenwissen zu gedämpften Schwingungen und werden nun mit einem <b>Test zu getriebenen Schwingungen</b> fortfahren.',
            continueLink: '/test/forced-oscillations',
            continueLinkText: 'Weiter zum Test'
        }
    ];

	
	// question 1 data
    question1 = {
		questionId: 'driven-osc-t-1-gesamtgleichung',
        question: `Die Gesamtlösung für den getriebenen, gedämpften harmonischen Oszillator kann in folgender Weise geschrieben werden:<br><br>
    \$\\varphi(t) = {\\varphi_0 \\cos(\\omega_e t + \\Phi) \\mathrm{e}^{-\\beta t}}+ { \\frac{N}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}} \\cos\\left(\\omega t - \\arctan\\left(\\frac{2\\beta\\omega}{\\omega_0^2 - \\omega^2}\\right) \\right)} ,\$<br><br>
    wobei $\\varphi(t)$ die Winkelauslenkung, $\\omega_0$ bzw. $\\omega_e$ die Eigenfrequenz des ungedämpften bzw. gedämpften Oszillators, $\\beta$ die Dämpfungskonstante, $N$ und $\\omega$ die Amplitude und Frequenz des Antriebs beschreiben. $\\varphi_0$ und $\\Phi$ sind Hilfsgrößen, die sich aus den Anfangsbedingungen ergeben.<br><br>
    Welche der Aussagen zu dieser Gesamtlösung sind korrekt? `,
		questionInstruction: 'Frage 1 von 4 (35 Punkte): Analyse der Gleichung',
		options: [
			{ value: 'first_ext', label: 'Der erste Summand beschreibt die Dynamik des Schwungrads ohne äußeren Antrieb.' },
			{ value: 'first_damp', label: 'Der erste Summand beschreibt die Dynamik des Schwungrads ohne Dämpfung.' },
      { value: 'first_time', label: 'Der erste Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' },
			{ value: 'second_time', label: 'Der zweite Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' },
			{ value: 'init_vel', label: 'Die Anfangsgeschwindigkeit bestimmt die maximale Auslenkung des Schwungrads zu allen Zeiten.' }
			{ value: 'damp_frequ', label: 'Die Dämpfung spielt für die Schwingungsfrequenz des gedämpft schwingenden Rades nach einer bestimmten Zeit keine Rolle mehr. Entscheidend ist nur, mit welcher Frequenz der Antrieb das Rad schwingen lässt.' }
			{ value: 'const', label: 'Aufgrund des äußeren Antriebs ist die Schwingung zu allen Zeiten gleichmäßig und periodisch.' }      
		],
		correctAnswers: ['first_ext','first_time','damp_frequ'],
        maxPoints: 20,
		pointsPerCorrectClick: 5
    };


	// question 2 data
    question2 = {
		questionId: 'damped-osc-2-federkonstante',
        question: `Bei einer gedämpften, getriebenen Schwingung, gibt es zunächst eine sogenannte Einschwingphase, bevor sich eine stationäre Schwingung stabilisiert. Wann die Einschwingphase abgeschlossen ist, kann man sehr gut an der Phasenraumdarstellung ablesen.
Im folgenden sind vier Phasenraumdiagramme für unterschiedliche Anfangsbedingungen und Einstellungen gezeigt. Der erste Messwert ist jeweils mit einem grauen, der letzte mit einem roten Kreuz markiert.<br><br>
Bei welcher der Graphen ist der Einschwingvorgang abgeschlossen?`,
		questionInstruction: 'Frage 2 von 4 (30 Punkte): Einschwingvorgang abgeschlossen?',
        images: [
			      { id: 'osc1', imageSrc: 'assets/images/driven_oscillation_t/Einschwingvorgang_JA.png', label: 'Schwingung A' },
            { id: 'osc2', imageSrc: 'assets/images/driven_oscillation_t/Einschwingvorgang_NEIN1.png', label: 'Schwingung B' },
            { id: 'osc3', imageSrc: 'assets/images/driven_oscillation_t/Einschwingvorgang_NEIN2.png', label: 'Schwingung C' }
        ],
        correctOrder: ['strong', 'medium', 'weak'],
        maxPoints: 30,
        containerId: 'test-question2-container'
    };


	// question 3 data
    question3 = {
		questionId: 'damped-osc-3-frequency-damping',
        question: `Sie haben in einer ersten Messung einer gedämpften Schwingung gesehen, dass das Schwungrad mit einer Frequenz von $\\omega_1=0.3$ Hz geschwungen ist.
			Nun hat ihr*e Praktikumspartner*in die Wirbelstrombremse weiter über das Schwungrad bewegt - sie erwarten also eine größere Dämpfung.
			Mit welcher Frequenz $\\omega_2$ erwarten Sie nun das Schwungrad zu schwingen?`,
		questionInstruction: 'Frage 3 von 5 (10 Punkte): Zusammenhang Frequenz und Dämpfungskonstante',
        options: [
            { value: 'answer1', label: '$\\omega_1<\\omega_2$.' },
            { value: 'answer2', label: '$\\omega_1>\\omega_2$.' },
            { value: 'answer3', label: 'Die Frequenz ist unanhängig von der Dämpfung.' },
        ],
		correctAnswer: 'answer2',
        maxPoints: 10,
        containerId: 'test-question3-container'
    };


	// question 4 data
    question4 = {
		questionId: 'damped-osc-4-log-decrement',
        question: `Das logarithmische Dekrement $\\Lambda$ ist eine Hilfsgröße, die man zur Beschreibung gedämpfter Schwingungen verwendet.
			Das logarithmische Dekrement ergibt sich hierbei in folgender Weise aus dem Verhältnis zwischen Amplituden einer gedämpften Schwingung, die zeitlich genau eine Schwingung auseinanderliegen: 
			$$\\Lambda = \\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right).$$
			Hierbei beschreibt $\\varphi(t)$ die Auslenkung aus der Ruhelage und $T$ die Periodendauer. 
			Was kann über das logarithmische Dekrement bestimmt werden? Markieren Sie alle physikalischen Größen, die direkt mit dem logarithmischen Dekrement zusammenhängen.`,
		questionInstruction: 'Frage 4 von 5 (20 Punkte): LogarithmischesDekrement',
		options: [
			{ value: 'eigenfrequency', label: 'Die Eigenfrequenz des schwingenden Systems $\\omega_0$.' },
			{ value: 'half_life', label: 'Die Halbwertszeit $t_{1/2}$.' },
			{ value: 'period', label: 'Die Periodendauer $T$.' },
			{ value: 'damping', label: 'Die Dämpfungskonstante $\\gamma$.' }
		],
		correctAnswers: ['half_life', 'damping'],
        maxPoints: 20,
		pointsPerCorrectClick: 5,
        containerId: 'test-question4-container'
    };

	// question 5 data
    question5 = {
        questionId: 'damped-osc-5-phase-space',
        question: `Der Phasenraum beschreibt mögliche Zustände, die ein System annehmen kann über die Angabe der Raum- und einer Geschwindigkeitskoordinate. 
		Für das Pohlsche Rad kann die Bewegung des Schwungrads angegeben werden über den Auslenkwinkel $\\phi$ und die Winkelgeschwindigkeit $\\dot{\\phi}$.

		Ordnen Sie den gezeigten Phasenraumdarstellungen die korrekten Anfangsbedingungen und Dämpfungskonstanten zu.`,
        questionInstruction: 'Frage 5 von 5 (60 Punkte): Zuordnung Phasenraum',
        containers: [
            { 
				id: 'spiral1', 
				imageSrc: 'assets/images/damped_oscillations/phase_space_spiral1_5.png', 
				imageAlt: 'Spirale 1', 
				correctAnswerIds: [ 'phi_gr_zero', 'phi_dot_eq_zero', 'gamma_weak' ], 
				assignedAnswerIds: [] 
			},
            { 
				id: 'spiral2', 
				imageSrc: 'assets/images/damped_oscillations/phase_space_spiral2_5.png', 
				imageAlt: 'Spirale 2', 
				correctAnswerIds: [ 'phi_sm_zero', 'phi_dot_gr_zero', 'gamma_medium' ],
				assignedAnswerIds: [] 
			},
            { 
				id: 'spiral3', 
				imageSrc: 'assets/images/damped_oscillations/phase_space_spiral3_5.png', 
				imageAlt: 'Spirale 3', 
				correctAnswerIds: [ 'phi_eq_zero', 'phi_dot_sm_zero', 'gamma_strong'], 
				assignedAnswerIds: [] }
        ],
        answers: [
			{ id: 'phi_sm_zero', label: '$\\phi(0)<0$' },
			{ id: 'phi_eq_zero', label: '$\\phi(0)=0$' },
			{ id: 'phi_gr_zero', label: '$\\phi(0)>0$' },
			{ id: 'phi_dot_sm_zero', label: '$\\dot{\\phi}(0)<0$' },
			{ id: 'phi_dot_eq_zero', label: '$\\dot{\\phi}(0)=0$' },
			{ id: 'phi_dot_gr_zero', label: '$\\dot{\\phi}(0)>0$' },
			{ id: 'gamma_weak', label: '$\\gamma=0.1$' },
			{ id: 'gamma_medium', label: '$\\gamma=0.4$' },
			{ id: 'gamma_strong', label: '$\\gamma=0.8$' },
        ],
        maxPoints: 60,
        containerId: 'test-question5-container'
    };


    // track submissions
    question1Submitted = false;
	question2Submitted = false;
	question3Submitted = false;
	question4Submitted = false;
	question5Submitted = false;


	// performance handling

    // results page data
    continueLink = '/';
    continueLinkText = 'Weiter';
    performanceLevel: 'low' | 'medium' | 'high' = 'low';

    // calculate results directly when navigating to results page
    private calculateResults() {
        const testProgress = this.testTracking.getTestResults('damped-oscillations');
        
        if (!testProgress) {
            console.warn('No test results found');
            return;
        }

        const totalPoints = testProgress.pointsEarned;
        const maxPoints = testProgress.maxPoints;
        const percentage = (totalPoints / maxPoints) * 100;

        // find matching threshold
        const threshold = this.performanceThresholds.find(t => 
            percentage >= t.minPercentage && percentage <= t.maxPercentage
        );

        if (threshold) {
            this.performanceLevel = threshold.level;
            this.continueLink = threshold.continueLink;
            this.continueLinkText = threshold.continueLinkText;
        }
    }

    // handle results calculated event
    onResultsCalculated(results: any) {
        this.performanceLevel = results.level;
        this.continueLink = results.continueLink;
        this.continueLinkText = results.continueLinkText;
    }

    getPerformanceClass(): string {
        if (this.currentView === 'damped_osc6') {
            return this.performanceLevel;
        }
        return '';
    }

	
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private testTracking: TestTracking,
    ) {}
	
	
    ngOnInit() {
		// start tracking this test
        this.testTracking.startTest('damped-oscillations', 5, 150); // 5 questions, 150 total points
        
        // restore completion state from previous session
        this.restoreCompletionState();
    }
	
	
    ngOnDestroy() {
		// end tracking when leaving
        this.testTracking.endTest();
    }
	
	
    private restoreCompletionState() {
		// check if question was already answered
        this.question1Submitted = this.testTracking.isQuestionAnswered(this.question1.questionId);
		this.question2Submitted = this.testTracking.isQuestionAnswered(this.question2.questionId);
		this.question3Submitted = this.testTracking.isQuestionAnswered(this.question3.questionId);
		this.question4Submitted = this.testTracking.isQuestionAnswered(this.question4.questionId);
		this.question5Submitted = this.testTracking.isQuestionAnswered(this.question5.questionId);
    }
	
	
    onQuestion1Submit(result: any) {
		this.question1Submitted = true;
		
        // track the result (only if not already tracked)
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

    onQuestion2Submit(result: any) {
		this.question2Submitted = true;

        // track the result (only if not already tracked)
        if (!this.testTracking.isQuestionAnswered(this.question2.questionId)) {
			this.testTracking.trackQuestionResult(
				this.question2.questionId,
                result.isCorrect,
                result.userAnswer,
                this.question2.correctOrder,
                result.pointsAwarded,
                this.question2.maxPoints
            );
        }
	}

    onQuestion3Submit(result: any) {
        this.question3Submitted = true;

        // Track the result (only if not already tracked)
        if (!this.testTracking.isQuestionAnswered(this.question3.questionId)) {
            this.testTracking.trackQuestionResult(
                this.question3.questionId,
                result.isCorrect,
                result.userAnswer,
                this.question3.correctAnswer,
                result.pointsAwarded,
                this.question3.maxPoints
            );
        }
    }

    onQuestion4Submit(result: any) {
        this.question4Submitted = true;

        // Track the result (only if not already tracked)
        if (!this.testTracking.isQuestionAnswered(this.question4.questionId)) {
            this.testTracking.trackQuestionResult(
                this.question4.questionId,
                result.isCorrect,
                result.userAnswer,
                this.question4.correctAnswers,
                result.pointsAwarded,
                this.question4.maxPoints
            );
        }
    }


    onQuestion5Submit(result: any) {
        this.question5Submitted = true;

        if (!this.testTracking.isQuestionAnswered(this.question5.questionId)) {
            this.testTracking.trackQuestionResult(
                this.question5.questionId,
                result.isCorrect,
                result.userAnswer,
                {},
                result.pointsAwarded,
                this.question5.maxPoints
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
	// get isLastPage(): boolean {
	// 	return this.currentView === 'damped_osc5';
	// }
    get isEndPage(): boolean {
        return (this.currentView === 'damped_osc5') || (this.currentView === 'damped_osc6');
    }



    get canProceed(): boolean {
		// can only proceed if all questions on current page are submitted
        if (this.currentView === 'damped_osc1') {
			// return this.question1Submitted;
            return true;
        } else if (this.currentView === 'damped_osc2') {
			// return this.question2Submitted;
            return true;
		} else if (this.currentView === 'damped_osc3') {
			// return this.question3Submitted;
            return true;
		} else if (this.currentView === 'damped_osc4') {
			// return this.question4Submitted;
            return true;
		} else if (this.currentView === 'damped_osc5') {
			return (
                this.question1Submitted && 
                this.question2Submitted &&
                this.question3Submitted &&
                this.question4Submitted &&
                this.question5Submitted) ;
		} else if (this.currentView === 'damped_osc6') {
			return true;
		}
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
            this.router.navigate(['/learning/intro-experiment'], { queryParams: { page: 4 } });
            return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
            this.renderMath();
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
            this.renderMath();
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc3';
            this.renderMath();
        } else if (this.currentView === 'damped_osc5') {
            this.currentView = 'damped_osc4';
            this.renderMath();
        } else if (this.currentView === 'damped_osc6') {
            this.currentView = 'damped_osc5';
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
            } else if (this.currentView === 'damped_osc4') {
				this.currentView = 'damped_osc5';
			} else if (this.currentView === 'damped_osc5') {
				this.calculateResults();
				this.currentView = 'damped_osc6';
			} else if (this.currentView === 'damped_osc6') {
                this.router.navigate([this.continueLink]);
			}
            this.renderMath();
        }
    }
}