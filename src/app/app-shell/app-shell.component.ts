import { NavigationEnd, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { MovieService } from '../movie/movie.service';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';
import { DirtyChecksComponent } from '../shared/dirty-checks/dirty-checks.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SideDrawerComponent,
    RouterLinkActive,
    RouterLink,
    FastSvgComponent,
    NgFor,
    HamburgerButtonComponent,
    SearchBarComponent,
    FormsModule,
    DarkModeToggleComponent,
    AsyncPipe,
    DirtyChecksComponent,
  ],
})
export class AppShellComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  sideDrawerOpen = signal<boolean>(false);
  genresLoading = computed(() => { console.log(this.genres()); return this.genres().length === 0 });

  searchValue = signal('');
  readonly genres = toSignal(this.movieService.getGenres(), { initialValue: [] });


  constructor() {
    effect(() => {
      if(this.searchValue()) {
        this.router.navigate(['search', this.searchValue()]);
      }
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd && this.sideDrawerOpen()),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.sideDrawerOpen.set(false);
      });
  }

  toggle(): void {
    this.sideDrawerOpen.update((currentValue) => !currentValue);
  }

}
