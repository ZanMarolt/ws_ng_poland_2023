import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
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
export class MovieDetailPageComponent {
  private readonly movieService = inject(MovieService);
  private readonly activatedRoute = inject(ActivatedRoute);

  movie = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.movieService.getMovieById(id)),
      catchError(() => of(null))
    ),
    {
        initialValue: null // Specify that the developer set it
    }
  );
  credits = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.movieService.getMovieCredits(id)),
      catchError(() => of(null))
    ),
    {
        initialValue: null // Specify that the developer set it
    }
  );
  recommendations = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.movieService.getMovieRecommendations(id)),
      catchError(() => of(null))
    ),
    {
        initialValue: null // Specify that the developer set it
    }
  );
}
