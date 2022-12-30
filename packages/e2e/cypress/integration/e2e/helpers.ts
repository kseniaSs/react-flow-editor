export const coordinatesFromMatrix = (matrixString: string) => matrixString.match(/([^ ]+), ([^ ]+)\)$/)!.slice(1)
