import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-header',
  imports: [ CommonModule ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})



export class Header {
    constructor(public themeService: ThemeService) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }
}