export const getDOMRect = (element: Element | null): DOMRect => {
  const rect = element?.getBoundingClientRect()

  if (!rect) return new DOMRect()

  return rect
}
