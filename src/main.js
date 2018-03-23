import { Observable } from './lib/rxjs';

const initialTime = 7 * 60; // 7 minutes

const startClick$ = Observable
  .fromEvent(document.querySelector('.start-btn'), 'click');
const isRunning$ = startClick$
  .startWith(false)
  .scan((isRunning, __) => !isRunning)
  .share();
const start$ = isRunning$.filter((isRunning) => !!isRunning);
const pause$ = isRunning$.filter((isRunning) => !isRunning);

const render = (time) => {
  const elem = document.querySelector('.overall-time-remaining');
  elem.innerHTML = time;
};

start$
  .mapTo(Observable.interval(1000).takeUntil(pause$))
  .switch()
  .startWith(initialTime)
  .scan((seconds, __) => seconds - 1)
  .subscribe(render);
