import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DOMRect } from '../utils/domRect';
import JsonEditor from '.';

Range.prototype.getBoundingClientRect = jest.fn().mockReturnValue(new DOMRect(0, 0, 0, 0));
Range.prototype.getClientRects = jest.fn().mockReturnValue([new DOMRect(0, 0, 0, 0)]);
Element.prototype.getClientRects = jest.fn().mockReturnValue([new DOMRect(0, 0, 0, 0)]);

it('JsonEditor snapshot', (done) => {
  (async () => {
    const { asFragment } = render(<JsonEditor onChange={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});
