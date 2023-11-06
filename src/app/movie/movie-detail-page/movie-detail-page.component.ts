import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { TMDBMovieCreditsModel } from '../../shared/model/movie-credits.model';
import { TMDBMovieDetailsModel } from '../../shared/model/movie-details.model';
import { MovieModel } from '../movie-model';
import { MovieService } from '../movie.service';
import { MovieImagePipe } from '../movie-image.pipe';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';
import { DetailGridComponent } from '../../ui/component/detail-grid/detail-grid.component';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'movie-detail-page',
    templateUrl: './movie-detail-page.component.html',
    styleUrls: ['./movie-detail-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        DetailGridComponent,
        StarRatingComponent,
        FastSvgComponent,
        MovieListComponent,
        MovieImagePipe,
    ],
})
export class MovieDetailPageComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly activatedRoute = inject(ActivatedRoute);

  recommendations$!: Observable<{ results: MovieModel[] }>;
  credits$!: Observable<TMDBMovieCreditsModel>;
  movie = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.movieService.getMovieById(id)),
      catchError(() => of(null))
    ),
    {
        initialValue: null // Specify that the developer set it
    }
  );

  constructor() {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.credits$ = this.movieService.getMovieCredits(params['id']);
      this.recommendations$ = this.movieService.getMovieRecommendations(
        params['id']
      );
    });
  }
}
