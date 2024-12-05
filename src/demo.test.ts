import {demo} from './demo';

test('Demo', () => {
    const d = demo();
    expect(d).toEqual('hi');
})