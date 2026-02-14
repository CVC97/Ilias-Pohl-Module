import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



declare global {
    interface Window {
        MathJax: any;
    }
}



@Component({
    selector: 'app-spring-constant',
    standalone: true,
    imports: [RouterLink],
	templateUrl: './spring-constant.html',
	styleUrl: './spring-constant.css',
})



export class SpringConstant implements OnInit {
    spring_constantText!: SafeHtml;
    spring_constantFormulaText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

	// bypassing math rendering errors
    ngOnInit() {        
        this.spring_constantText = this.sanitizer.bypassSecurityTrustHtml(`
			Die Federkonstante $D$ ist eine materialabhänigege Konstante, die umgangssprachlich Steifigkeit genannt wird. 
			Sie gibt das Verhätnis von einer wirkenden Kraft und der daraus resultierenden Verbiegung/Dehnung einer Feder an.
        `);

        this.spring_constantFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Beim Pohlschen Resonator wird statt der Federkonstante, die Winkelrichtgröße $D^*$ genutzt, 
			die das rücktriebende Drehmoment bestimmt:
			$$M_{\\text{Rück}} = D^* \\cdot \\varphi$$
        `);
        
        this.renderMath();
    }

    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.typesetPromise();
                }
            }, 100);
        }
    }
}