export const getRectFromRef = <T extends HTMLElement>(ref: React.RefObject<T>): DOMRect => {
  const rect = ref.current?.getBoundingClientRect()

  if (!rect) return new DOMRect()

  return rect
}
