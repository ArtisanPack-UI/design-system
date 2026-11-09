import { packageName } from './index';

describe('@artisanpack-ui/behavior', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@artisanpack-ui/behavior');
  });
});
