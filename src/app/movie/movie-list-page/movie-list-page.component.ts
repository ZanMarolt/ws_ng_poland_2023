import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  concat,
  exhaustMap,
  filter,
  map,
  Observable,
  shareReplay,
  Subject, switchMap, tap,
} from 'rxjs';
import { TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';
import { ElementVisibilityDirective } from '../../shared/cdk/element-visibility/element-visibility.directive';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'movie-list-page',
    templateUrl: './movie-list-page.component.html',
    styleUrls: ['./movie-list-page.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MovieListComponent,
        ElementVisibilityDirective,
        AsyncPipe,
    ],
})
export class MovieListPageComponent implements OnInit {
  movies$ = this.activatedRoute.params.pipe(switchMap(params => {
    if (params['category']) {
      return this.paginate((page) =>
      this.movieService.getMovieList(params['category'], page)
      );
    } else {
      return this.paginate((page) =>
      this.movieService.getMoviesByGenre(params['id'], page)
      );
    }
  }));
  movies = toSignal(this.movies$, { initialValue: JSON.parse(localStorage.getItem('movies')!) || []});

  readonly paginate$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {
    effect(() => {
      if (this.movies()) {
        localStorage.setItem('movies', JSON.stringify(this.movies()));
      }
    })
  }

  ngOnInit() {

  }

  private paginate(
    requestFn: (page: string) => Observable<TMDBMovieModel[]>
  ): Observable<TMDBMovieModel[]> {
    let movieCache: TMDBMovieModel[] = [];
    return concat(
      requestFn('1'),
      this.paginate$.pipe(
        filter(Boolean),
        exhaustMap((v, i) =>
          requestFn(`${i + 2}`).pipe(
            map((movies) => [...movieCache, ...movies])
          )
        )
      )
    ).pipe(tap(movies => movieCache = movies), shareReplay(10));
  }
}
