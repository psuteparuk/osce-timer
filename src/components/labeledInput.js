import { toNumber } from '../lib/util';

export const labeledInput = (sources) => {
  const changeValue$ = sources.props
    .map((props) => sources.DOM
      .selectEvents(`.${props.className} .config-input`, 'input')
      .map((event) => toNumber(event.target.value))
    )
    .switch();

  const state$ = sources.props
    .map((props) => changeValue$
      .startWith(props.init)
      .map((value) => ({ ...props, value }))
    )
    .switch();

  return {
    value: state$.map((state) => state.value),
  };
};
