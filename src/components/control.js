import { labeledInput } from './labeledInput';
import { Observable } from '../lib/rxjs';
import { assign } from '../lib/util';

export const control = (sources) => {
  const startClick$ = sources.DOM.selectEvents('.start-btn', 'click');
  const pauseClick$ = sources.DOM.selectEvents('.pause-btn', 'click');

  const numStationsProps$ = Observable.of({
    className: 'number-of-stations',
    init: 10,
  });
  const numStationsSinks = labeledInput({ ...sources, props: numStationsProps$ });

  const timePerStationProps$ = Observable.of({
    className: 'time-per-station',
    init: 60,
  });
  const timePerStationSinks = labeledInput({ ...sources, props: timePerStationProps$ });

  const breakTimeProps$ = Observable.of({
    className: 'break-time',
    init: 10,
  });
  const breakTimeSinks = labeledInput({ ...sources, props: breakTimeProps$ });

  return {
    numStations: numStationsSinks.value,
    timePerStation: timePerStationSinks.value,
    breakTime: breakTimeSinks.value,
    onStart: startClick$,
    onPause: pauseClick$,
  };
};
