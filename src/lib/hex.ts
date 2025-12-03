export type Axial = { q: number, r: number }

// Default hex size constants (kept for backwards compatibility)
export const HEX_SIZE = 96  // pixel size (width) - pick sane value and be consistent
export const HEX_WIDTH = HEX_SIZE
export const HEX_HEIGHT = Math.sqrt(3) / 2 * HEX_WIDTH // for pointy-top; adapt if flat-top

// For pointy top hex axial -> pixel (pointy-top)
// Now accepts dynamic hex dimensions
export function axialToPixel(
    { q, r }: Axial,
    originX: number,
    originY: number,
    hexWidth: number = HEX_WIDTH,
    hexHeight: number = HEX_HEIGHT
) {
    const x = hexWidth * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r) / 2
    const y = hexHeight * (3 / 2 * r) / 2
    return { x: Math.round(originX + x), y: Math.round(originY + y) }
}

// Inverse, if needed: pixelToAxial (approx) - useful for clicks
