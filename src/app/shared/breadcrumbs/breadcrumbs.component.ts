import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription  } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{
  public breadcrumbTitle!: string;
  public breadcrumbSubs$: Subscription;

  constructor(private router: Router) {
    this.breadcrumbSubs$ = this.getcurrentRoute()
      .subscribe(({ title }) => {
        this.breadcrumbTitle = title
        document.title = ` The Clinic - ${title}`
      });
  }
  ngOnDestroy() {
    this.breadcrumbSubs$.unsubscribe()
  }

  getcurrentRoute() {
    return this.router.events
    .pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map(({ snapshot }) => snapshot.data)
    )
    
  }
}
