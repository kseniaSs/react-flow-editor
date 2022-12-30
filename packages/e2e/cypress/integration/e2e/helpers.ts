export const coordinatesFromMatrix = (matrixString: string): [string, string] =>
  matrixString.match(/([^ ]+), ([^ ]+)\)$/)!.slice(1) as [string, string]

export const coordinatesFromPath = (pathString: string) =>
  pathString
    .split(" ")
    .map((item) => Math.round(parseInt(item)))
    .filter((item) => !isNaN(Number(item)))
