
export interface Point {
    x : number;
    y : number;
}

export function createPoint(x : number, y : number) {
    return { x : x, y : y}
}

export function getDistance(p1 : Point, p2 : Point) {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt((dx * dx) + (dy * dy))
}