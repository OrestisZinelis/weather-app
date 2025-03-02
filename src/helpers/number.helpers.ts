export const getAvg = (numArr: number[]) =>
  numArr.reduce((sum: number, val: number) => sum + val, 0) / numArr.length
