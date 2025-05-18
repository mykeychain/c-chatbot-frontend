export function toCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  export function keysToCamel<T>(input: any): T {
    if (Array.isArray(input)) {
      return input.map(item => keysToCamel(item)) as any;
    }
    else if (input !== null && typeof input === 'object') {
      return Object.entries(input).reduce((acc, [key, val]) => {
        (acc as any)[ toCamel(key) ] = keysToCamel(val);
        return acc;
      }, {} as any) as T;
    }
    
    return input;
  }
  