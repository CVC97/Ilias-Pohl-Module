import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



declare global {
    interface Window {
        MathJax: any;
    }
}


@Component({
    selector: 'app-intro-experiment',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './intro-experiment.html',
    styleUrl: './intro-experiment.css',
})



export class IntroExperiment implements OnInit {
    introExperimentText!: SafeHtml;


    private _currentView: string = 'intro_exp1';
    
    get currentView(): string {
        return this._currentView;
    }
    
    set currentView(value: string) {
        this._currentView = value;
        // Render math after view changes
        if (value === 'intro_exp3') {
            setTimeout(() => this.renderMath(), 150);
        }
    }
    

    // QA 1 state (Schwungrad)
    showResult1 = false;
    isCorrect1 = false;
    resultMessage1: SafeHtml = '';
    private correctAnswers1 = ['answer3', 'answer4'];

    // QA 2 state (Feder)
    showResult2 = false;
    isCorrect2 = false;
    resultMessage2: SafeHtml = '';
    private correctAnswers2 = ['answer2'];

    // QA 3 state (Wirbelstrombremse)
    showResult3 = false;
    isCorrect3 = false;
    resultMessage3: SafeHtml = '';
    private correctAnswers3 = ['answer2'];


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}



    ngOnInit() {
        this.introExperimentText = this.sanitizer.bypassSecurityTrustHtml(`
            Das Schwungrad ist in dem Versuch im Schwerpunkt aufgehängt. Durch das Anbringen zusätzliche 
            Massestücke wirkt ein zusätzliches Drehmoment, über das die Feder näher charakterisiert werden kann. 
            Um diesen Zusammenhang nachzuvollziehen, betrachten wir zunächst das Schwungrad ohne den zusätzlichen 
            Antrieb (s. Abbildung).
            <br><br>
            Auf ein zusätzliches Massestück mit der Masse $m_{zm}$ wirkt die Kraft $\\vec{F}_{zm} = m_{zm}\\vec{g}$, 
            wodurch auf das Schwungrad das Drehmoment $\\vec{M}_{zm} = \\vec{r} \\times \\vec{F}_{zm}$, bzw. 
            $|\\vec{M}_{zm}| = m_{zm}gR\\sin(\\varphi)$ wirkt.
            <br><br>
            Im stationären Fall gleichen sich das zusätzliche Drehmoment und das rücktreibende Drehmoment der 
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




    // QA 1 evaluation (Schwungrad)
    evaluateAnswer1() {
        const checkboxes = document.querySelectorAll('.evaluation-container-1 input[type="checkbox"]');
        const selectedAnswers: string[] = [];

        checkboxes.forEach((checkbox: any) => {
            if (checkbox.checked) {
                selectedAnswers.push(checkbox.value);
            }
        });

        const allCorrectSelected = this.correctAnswers1.every(answer => 
            selectedAnswers.includes(answer)
        );
        const noIncorrectSelected = selectedAnswers.every(answer => 
            this.correctAnswers1.includes(answer)
        );

        this.isCorrect1 = allCorrectSelected && noIncorrectSelected;
        this.showResult1 = true;

        if (this.isCorrect1) {
            this.resultMessage1 = `✓ Völlig richtig.<br><br>
                Die Bewegung des Schwungrads wird untersucht, wenn es "von außen" angetrieben wird. 
                Der Schwungkörper muss kein Zylinder sein, wenn Sie sich das Bild des Versuchsaufbaus anschauen, dann ist auch dies kein Zylinder. 
                Der Schwungkörper muss nicht einmal rotationssymmetrisch sein. Wichtig ist aber, dass er im Schwerpunkt aufgehängt ist. 
                Wäre er nicht im Schwerpunkt aufgehängt, würde aufgrund der Schwerkraft ein zusätzliches Drehmoment auf den Schwungkörper wirken. 
                Dieses zusätzliche Drehmoment würde die Bewegung beeinflussen. 
                Unter Umständen führt das Hinzufügen zusätzlicher Massestücke an das Schwungrad bei diesem Versuchsaufbau zu chaotischem Verhalten.<br><br>

                Das zusätzliche Hinzufügen einer Masse kann man allerdings auch nutzen, um den Versuchsaufbau näher zu charakterisieren. 
                Hierzu erfahren Sie mehr auf den folgenden Seiten.`;
        } else {
            if (selectedAnswers.length === 0) {
                this.resultMessage1 = '✗ Bitte wählen Sie mindestens eine Antwort aus.';
            } else if (!allCorrectSelected) {
                this.resultMessage1 = `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>
                    Betrachten Sie noch einmal den Versuchsaufbau. Welche Rolle übernimmt das Schwungrad? Wie sieht das Schwungrad aus? 
                    Welche Eigenschaften erfüllt das Schwungrad und welche nicht?
                    Überlegen Sie sich, was die physikalischen Begründungen für dieses Aussehen sein könnten.`;
            } else {
                this.resultMessage1 = `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>
                    Betrachten Sie noch einmal den Versuchsaufbau. Welche Rolle übernimmt das Schwungrad? Wie sieht das Schwungrad aus? 
                    Welche Eigenschaften erfüllt das Schwungrad und welche nicht?
                    Überlegen Sie sich, was die physikalischen Begründungen für dieses Aussehen sein könnten.`;
            }
        }

        this.renderMath();
    }



    // QA 2 evaluation (Feder)
    evaluateAnswer2() {
        const checkboxes = document.querySelectorAll('.evaluation-container-2 input[type="checkbox"]');
        const selectedAnswers: string[] = [];

        checkboxes.forEach((checkbox: any) => {
            if (checkbox.checked) {
                selectedAnswers.push(checkbox.value);
            }
        });

        const allCorrectSelected = this.correctAnswers2.every(answer => 
            selectedAnswers.includes(answer)
        );
        const noIncorrectSelected = selectedAnswers.every(answer => 
            this.correctAnswers2.includes(answer)
        );

        this.isCorrect2 = allCorrectSelected && noIncorrectSelected;
        this.showResult2 = true;

        if (this.isCorrect2) {
            this.resultMessage2 = this.sanitizer.bypassSecurityTrustHtml(`
                ✓ Korrekt, die Feder bedingt ein rücktreibendes Drehmoment, das von der Auslenkung aus der Ruhelage abhängt. 
                Das rücktreibende Drehmoment $M$ kann mathematisch beschrieben werden als 
                $$M = -D^*\\varphi.$$
                Hierbei ist $D^*$ das Direktionsmoment (auch als Winkelrichtgröße bezeichnet) und $\\varphi$ 
                beschreibt die Auslenkung aus der Ruhelage.
            `);
        } else {
            if (selectedAnswers.length === 0) {
                this.resultMessage2 = this.sanitizer.bypassSecurityTrustHtml('✗ Bitte wählen Sie mindestens eine Antwort aus.');
            } else if (!allCorrectSelected) {
                this.resultMessage2 = this.sanitizer.bypassSecurityTrustHtml(`
                    ✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.
                `);
            } else {
                this.resultMessage2 = this.sanitizer.bypassSecurityTrustHtml(`
                    ✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.
                `);
            }
        }

        this.renderMath();
    }



    // QA 3 evaluation (Wirbelstrombremse)
    evaluateAnswer3() {
        const checkboxes = document.querySelectorAll('.evaluation-container-3 input[type="checkbox"]');
        const selectedAnswers: string[] = [];

        checkboxes.forEach((checkbox: any) => {
            if (checkbox.checked) {
                selectedAnswers.push(checkbox.value);
            }
        });

        const allCorrectSelected = this.correctAnswers3.every(answer => 
            selectedAnswers.includes(answer)
        );
        const noIncorrectSelected = selectedAnswers.every(answer => 
            this.correctAnswers3.includes(answer)
        );

        this.isCorrect3 = allCorrectSelected && noIncorrectSelected;
        this.showResult3 = true;

        if (this.isCorrect3) {
            this.resultMessage3 = this.sanitizer.bypassSecurityTrustHtml(`
                ✓ Genau richtig.<br><br>
                Damit die Wirbelstrombremse zu einer Dämpfung des Systems führen kann, muss das Schwungrad aus einem leitenden Material bestehen. 
                Die Wirbelstrombremse funktioniert über das Prinzip der Induktion --- je nach Stärke des Magnetfeldes der 
                Wirbelstrombremse wird das Schwungrad stärker abgedämpft in seiner Bewegung. 
                Die Dämpfung ist hierbei linear zur Bewegungsgeschwindigkeit des Rads durch das Magnetfeld. Die Wirbelstrombremse bewirkt also ein bremsendes Moment
                $$M=-\\rho\\varphi,$$
                wobei $\\rho$ der Reibungskoeffizient und $\\varphi$ die Winkelgeschwindigkeit sind.<br><br>
                Im Versuch ist die Wirbelstrombremse durch einen Magneten realisiert. 
                Sie können die Dämpfung des Rades variieren, indem Sie den Magneten weiter über das Rad schieben. 
                Je größer der Bereich der Rads, den das Magnetfeld beeinträchtigt, desto stärker ist die dämpfende Wirkung.<br><br>

                Wenn Sie mehr über die Funktionsweise der Wirbelstrombremse erfahren möchten, dann können Sie sich hier informieren.`
            );
        } else {
            if (selectedAnswers.length === 0) {
               this.resultMessage3 = this.sanitizer.bypassSecurityTrustHtml('✗ Bitte wählen Sie mindestens eine Antwort aus.');
            } else if (!allCorrectSelected) {
                this.resultMessage3 = this.sanitizer.bypassSecurityTrustHtml(`
                    ✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.
                `);
            } else {
                this.resultMessage3 = this.sanitizer.bypassSecurityTrustHtml(`
                    ✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.
                `);
            }
        }

        this.renderMath();
    }
}