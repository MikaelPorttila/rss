export interface TestEntry<T> {
  name: string;
  getValue(arg0: T): any;
  assert: [{
    fn: any;
    expect: any;
  }];
}
