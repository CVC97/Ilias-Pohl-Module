import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme';
import { CommonModule } from '@angular/common';
import { Session } from '../../core/services/session';



@Component({
    selector: 'app-header',
    imports: [ CommonModule ],
    templateUrl: './header.html',
    styleUrl: './header.css',
})



export class Header {
    constructor(
        public themeService: ThemeService,
        public sessionService: Session
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }
}