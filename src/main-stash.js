import { control } from './components/control';
import { Observable, Subject } from './lib/rxjs';
import {
  assign,
  forEach,
  get,
  isNil,
  keys,
  mapValues,
  mapValuesWithKey,
} from './lib/util';

const main = (sources) => {
  const controlSinks = control(sources);

  const controlInput$ = Observable
    .merge(
      controlSinks.numStations.map((numStations) => ({ numStations })),
      controlSinks.timePerStation.map((timePerStation) => ({ timePerStation })),
      controlSinks.breakTime.map((breakTime) => ({ breakTime })),
    )
    .scan((accObj, obj) => assign(accObj, obj), {});

  const initialOverallTimeRemainingSubject = new Subject();

  const initialOverallTimeRemaining$ = Observable
    .merge(
      initialOverallTimeRemainingSubject.map((initialOverallTimeRemaining) => ({ initialOverallTimeRemaining })),
      controlInput$,
    )
    .map(({ initialOverallTimeRemaining, numStations, timePerStation, breakTime }) =>
      isNil(initialOverallTimeRemaining)
        ? numStations*(timePerStation+breakTime) - breakTime
        : initialOverallTimeRemaining,
    );

  const overallTimeRemaining$ = Observable
    .merge(
      initialOverallTimeRemaining$.map((initialOverallTimeRemaining) => ({
        initialOverallTimeRemaining,
        running: false,
      })),
      controlSinks.onStart.mapTo({ running: true }),
    )
    .scan((accObj, obj) => assign(accObj, obj), {})
    .map(({ initialOverallTimeRemaining, running }) => running
      ? Observable
          .interval(1000)
          .takeUntil(controlSinks.onPause)
          .scan((count, __) => count - 1, initialOverallTimeRemaining)
          .startWith(initialOverallTimeRemaining)
      : Observable.of(initialOverallTimeRemaining)
    )
    .switch();

  controlSinks.onPause
    .withLatestFrom(
      overallTimeRemaining$,
      (__, overallTimeRemaining) => overallTimeRemaining,
    )
    .subscribe(initialOverallTimeRemainingSubject);

  return {
    overallTimeRemaining: overallTimeRemaining$,
  };
};

const domDriver = (sink$) => {
  const domSource = {
    selectEvents: (selector, eventType) => Observable
      .fromEvent(document.querySelector(selector), eventType),
  };
  return domSource;
};

const overallTimeRemainingDriver = (sink$) => {
  sink$.subscribe((value) => {
    const elem = document.querySelector('.overall-time-remaining');
    elem.textContent = value;
  });
};

const run = (mainFn, drivers) => {
  const fakeSinks = mapValues(() => new Subject(), drivers);
  const sources = mapValuesWithKey((driver, key) => driver(fakeSinks[key]), drivers);
  const sinks = mainFn(sources);
  forEach((key) => {
    if (!isNil(sinks[key])) sinks[key].subscribe(fakeSinks[key]);
  }, keys(drivers));
};

const drivers = {
  DOM: domDriver,
  overallTimeRemaining: overallTimeRemainingDriver,
};

run(main, drivers);
