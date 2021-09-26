interface IPaginate {
  size: number,
  data: any[]
}

export class ArrayUtil {
  static paginate(array: any[], limit: number): IPaginate {
    const size = Math.ceil(array.length / limit)
    const data = []

    for (let i = 0; i < size; i++) {
      data.push(array.slice(i * limit, (i + 1) * limit > array.length ? array.length : (i + 1) * limit))
    }

    return { size, data }
  }

  static groupByKey(array, key: string) {
    return array.reduce((prev, curr) => {
      (prev[curr[key]] = prev[curr[key]] || []).push(curr)

      return prev
    }, {})
  }
}