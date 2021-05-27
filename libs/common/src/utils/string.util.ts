export class StringUtil {
  static snakeToCamel(str: string) {
    return str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    )
  }

  static camelToSnake(str: string) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .join('_')
      .toLowerCase()
  }
}
