import { safeReturnUrl } from './return-url';

describe('safeReturnUrl', () => {
  const origin = 'http://localhost:4200';

  it.each([
    ['/customer', '/customer'],
    ['/customer/1', '/customer/1'],
    ['/customer/1?tab=a', '/customer/1?tab=a'],
    ['http://localhost:4200/customer/2', '/customer/2']
  ])('should accept %s', (input, expected) => {
    expect(safeReturnUrl(input, origin)).toBe(expected);
  });

  it.each([
    ['https://evil.example/customer'],
    ['//evil.example/customer'],
    ['/\\evil.example'],
    ['javascript:alert(1)'],
    ['/login'],
    ['/customers'],
    ['/customerx/1'],
    ['/customer/../admin'],
    ['']
  ])('should reject %s', input => {
    expect(safeReturnUrl(input, origin)).toBeUndefined();
  });

  it('should reject missing values', () => {
    expect(safeReturnUrl(undefined, origin)).toBeUndefined();
    expect(safeReturnUrl(null, origin)).toBeUndefined();
  });
});
