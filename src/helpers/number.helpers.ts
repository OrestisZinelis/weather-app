export const customRound = (value: number) => {
  return value % 1 >= 0.45 ? Math.ceil(value) : Math.floor(value)
}
