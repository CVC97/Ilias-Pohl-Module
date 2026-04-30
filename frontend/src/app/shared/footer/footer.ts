import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';



@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.html',
    styleUrl: './footer.css'
})
export class Footer implements OnInit {
    isAtBottom = false;

	
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}


    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.checkIfAtBottom();
        }
    }


    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.checkIfAtBottom();
    }


    @HostListener('window:resize', [])
    onWindowResize() {
        this.checkIfAtBottom();
    }


    private checkIfAtBottom() {
        if (isPlatformBrowser(this.platformId)) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            // Check if scrolled to bottom (with 5px tolerance)
            this.isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 5);
        }
    }
}