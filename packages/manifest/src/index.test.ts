import { packageName } from './index';

describe('@artisanpack-ui/manifest', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@artisanpack-ui/manifest');
  });
});
