import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Evaluation } from '../../../shared/evaluation/evaluation';



declare global {
	interface Window {
		MathJax: any;
    }
}



@Component({
	selector: 'app-intro-experiment',
    standalone: true,
    imports: [CommonModule, RouterLink, Evaluation],
    templateUrl: './intro-experiment.html',
    styleUrl: './intro-experiment.css',
})



export class IntroExperiment implements OnInit {
    // question 1 data
    question1 = {
        imageSrc: 'assets/images/schwungrad_2.png',
        imageAlt: 'Schwungrad',
        question: 'Welche der Aussagen in Bezug auf das Schwungrad sind richtig?',
        options: [
            { value: 'answer1', label: 'Das Schwungrad setzt das System in Bewegung.' },
            { value: 'answer2', label: 'Die Form des Schwungkörpers beeinträchtigt den Versuch. Nur durch die zylinderförmige Form ist eine harmonische Bewegung möglich.' },
            { value: 'answer3', label: 'Solange der Schwungkörper sich um seinen Schwerpunkt dreht, spielt die exakte Form keine Rolle.' },
            { value: 'answer4', label: 'Das Schwungrad dient als träger Körper, dessen Bewegung untersucht wird.' }
        ],
        correctAnswers: ['answer3', 'answer4'],
        containerId: 'evaluation-container-1',
        successMessage: `✓ Völlig richtig.<br><br>
			Die Bewegung des Schwungrads wird untersucht, wenn es "von außen" angetrieben wird. 
			Der Schwungkörper muss kein Zylinder sein, wenn Sie sich das Bild des Versuchsaufbaus anschauen, dann ist auch dies kein Zylinder. 
			Der Schwungkörper muss nicht einmal rotationssymmetrisch sein. Wichtig ist aber, dass er im Schwerpunkt aufgehängt ist. 
			Wäre er nicht im Schwerpunkt aufgehängt, würde aufgrund der Schwerkraft ein zusätzliches Drehmoment auf den Schwungkörper wirken. 
			Dieses zusätzliche Drehmoment würde die Bewegung beeinflussen. 
			Unter Umständen führt das Hinzufügen zusätzlicher Massestücke an das Schwungrad bei diesem Versuchsaufbau zu chaotischem Verhalten.<br><br>

			Das zusätzliche Hinzufügen einer Masse kann man allerdings auch nutzen, um den Versuchsaufbau näher zu charakterisieren. 
			Hierzu erfahren Sie mehr auf den folgenden Seiten.`,
        incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>
			Betrachten Sie noch einmal den Versuchsaufbau. Welche Rolle übernimmt das Schwungrad? Wie sieht das Schwungrad aus? 
			Welche Eigenschaften erfüllt das Schwungrad und welche nicht?
			Überlegen Sie sich, was die physikalischen Begründungen für dieses Aussehen sein könnten.`,
        incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>
			Betrachten Sie noch einmal den Versuchsaufbau. Welche Rolle übernimmt das Schwungrad? Wie sieht das Schwungrad aus? 
			Welche Eigenschaften erfüllt das Schwungrad und welche nicht?
			Überlegen Sie sich, was die physikalischen Begründungen für dieses Aussehen sein könnten.`
    };


	// question 2 data
    question2 = {
        imageSrc: 'assets/images/feder_2.png',
        imageAlt: 'Feder',
        question: 'Welche Aussage über die Feder ist korrekt?',
        options: [
            { value: 'answer1', label: 'Die Feder ist für den Versuch nur notwendig, wenn man auch den externen Antrieb verwendet.' },
            { value: 'answer2', label: 'Die Feder sorgt für ein rücktreibendes Drehmoment.' },
            { value: 'answer3', label: 'Die Feder führt zu kontinuierlichen Dämpfung des Schwungrads.' },
        ],
        correctAnswers: ['answer2'],
        containerId: 'evaluation-container-1',
        successMessage: `✓ Korrekt, die Feder bedingt ein rücktreibendes Drehmoment, das von der Auslenkung aus der Ruhelage abhängt. 
			Das rücktreibende Drehmoment $M$ kann mathematisch beschrieben werden als 
			$$M = -D^*\\varphi.$$
			Hierbei ist $D^*$ das Direktionsmoment (auch als Winkelrichtgröße bezeichnet) und $\\varphi$ 
			beschreibt die Auslenkung aus der Ruhelage.`,
        incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.`,
        incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.`
    };


	// question 3 data
    question3 = {
        imageSrc: 'assets/images/wirbelstrombremse_2.png',
        imageAlt: 'Wirbelstrombremse',
        question: `Zur Dämpfung wird in diesem Versuchsaufbau ein Magnet verwendet, 
			der so verschoben werden kann, dass er das Rad (mit Abstand, also nicht wie eine Scheibenbremse) umschließt.
			Welche der Aussagen über die Wirbelstrombremse sind korrekt?`,
        options: [
            { value: 'answer1', label: 'Ohne die Wirbelstrombremse würde das Schwungrad unendlich lange weiterschwingen.' },
            { value: 'answer2', label: 'Das Material des Schwungrads bedingt die Wirkung der Wirbelstrombremse.' },
            { value: 'answer3', label: 'Die Wirbelstrombremse ist direkt von der Auslenkung des Schwungrads abhängig.' },
        ],
        correctAnswers: ['answer2'],
        containerId: 'evaluation-container-1',
        successMessage: `✓ Genau richtig.<br><br>
			Damit die Wirbelstrombremse zu einer Dämpfung des Systems führen kann, muss das Schwungrad aus einem leitenden Material bestehen. 
			Die Wirbelstrombremse funktioniert über das Prinzip der Induktion --- je nach Stärke des Magnetfeldes der 
			Wirbelstrombremse wird das Schwungrad stärker abgedämpft in seiner Bewegung. 
			Die Dämpfung ist hierbei linear zur Bewegungsgeschwindigkeit des Rads durch das Magnetfeld. Die Wirbelstrombremse bewirkt also ein bremsendes Moment
			$$M=-\\rho\\dot{\\varphi},$$
			wobei $\\rho$ der Reibungskoeffizient und $\\dot{\\varphi}$ die Winkelgeschwindigkeit sind.<br><br>
			Im Versuch ist die Wirbelstrombremse durch einen Magneten realisiert. 
			Sie können die Dämpfung des Rades variieren, indem Sie den Magneten weiter über das Rad schieben. 
			Je größer der Bereich der Rads, den das Magnetfeld beeinträchtigt, desto stärker ist die dämpfende Wirkung.<br><br>

			Wenn Sie mehr über die Funktionsweise der Wirbelstrombremse erfahren möchten, dann können Sie sich hier informieren.`,
		incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.`,
        incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.`
    };


    // track completion
    isCorrect1 = false;
    isCorrect2 = false;
    isCorrect3 = false;

	// page completion tracking
	page1Complete = true;
	// page2Complete = false;
	// page3Complete = false;

	// everything true for development purposes
	page2Complete = true;
	page3Complete = true;

	// QA states
	showResult1 = false;
	showResult2 = false;
	showResult3 = false;

	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
		this.updatePage2Completion();
		this.renderMath();
    }

    onQuestion2Answered(isCorrect: boolean) {
		this.isCorrect2 = isCorrect;
		this.updatePage2Completion();
		this.renderMath();
    }

    onQuestion3Answered(isCorrect: boolean) {
		this.isCorrect3 = isCorrect;
		this.updatePage2Completion();
		this.renderMath();
    }
	
	
	// rendering Math texts
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {}


	introExperimentText!: SafeHtml;


    ngOnInit() {
        this.introExperimentText = this.sanitizer.bypassSecurityTrustHtml(`
            Das Schwungrad ist in dem Versuch im Schwerpunkt aufgehängt. Durch das Anbringen zusätzliche 
            Massestücke wirkt ein zusätzliches <a target="_blank" rel="noopener noreferrer" href="/glossary/angular-momentum" class="glossary-link">Drehmoment</a>, 
            über das die Feder näher charakterisiert werden kann. 
            Um diesen Zusammenhang nachzuvollziehen, betrachten wir zunächst das Schwungrad ohne den zusätzlichen 
            Antrieb (s. Abbildung).
            <br><br>
            Auf ein zusätzliches Massestück mit der Masse $m_{zm}$ wirkt die Kraft $\\vec{F}_{zm} = m_{zm}\\vec{g}$, 
            wodurch auf das Schwungrad das <a target="_blank" rel="noopener noreferrer" href="/glossary/angular-momentum" class="glossary-link">Drehmoment</a> 
            $\\vec{M}_{zm} = \\vec{r} \\times \\vec{F}_{zm}$, bzw. 
            $|\\vec{M}_{zm}| = m_{zm}gR\\sin(\\varphi)$ wirkt.
            <br><br>
            Im stationären Fall gleichen sich das zusätzliche <a target="_blank" rel="noopener noreferrer" href="/glossary/angular-momentum" class="glossary-link">Drehmoment</a> 
            und das rücktreibende <a target="_blank" rel="noopener noreferrer" href="/glossary/angular-momentum" class="glossary-link">Drehmoment</a> der 
            Feder aus: $(M_{\\text{Feder}} = -D\\varphi)$.
        `);
    }


    // Trigger MathJax rendering
    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.typesetPromise();
                }
            });
        }
    }

	
    // navigation helpers
	currentView: string = 'intro_exp1';
    get isFirstPage(): boolean {
        return this.currentView === 'intro_exp1';
    }


    // ability to proceed in the module: depending on the Q+A performance (all questions have to be answered)
    get canProceed(): boolean {
        if (this.currentView === 'intro_exp1') return this.page1Complete;
        if (this.currentView === 'intro_exp2') return this.page2Complete;
        if (this.currentView === 'intro_exp3') return this.page3Complete;
        return false;
    }


    // going back always enabled (for now at least)
    get canGoBack(): boolean {
        return true;
    }


    // going back shows the previous subpage / home page
    goBack() {
        if (this.currentView === 'intro_exp1') {
            this.router.navigate(['/']);
        } else if (this.currentView === 'intro_exp2') {
            this.currentView = 'intro_exp1';
            this.renderMath();
        } else if (this.currentView === 'intro_exp3') {
            this.currentView = 'intro_exp2';
            this.renderMath();
        }
    }


    // go forward shows next subpage / page
    goForward() {
        if (this.canProceed) {
            if (this.currentView === 'intro_exp1') {
                this.currentView = 'intro_exp2';
            } else if (this.currentView === 'intro_exp2') {
                this.currentView = 'intro_exp3';
            }
            // nothing implemented beyond (3/3 so far)
            this.renderMath();
        }
    }


    // Check if page 2 is complete (all 3 questions correct)
    updatePage2Completion() {
        this.page2Complete = this.isCorrect1 && this.isCorrect2 && this.isCorrect3;
        // this.page2Complete = true;
    }
}