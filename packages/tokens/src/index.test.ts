import { packageName } from './index';

describe('@artisanpack-ui/tokens', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@artisanpack-ui/tokens');
  });
});
