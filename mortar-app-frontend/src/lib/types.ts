
export interface Point {
    x : number;
    y : number;
}

export interface MapClickEvent {
    type : "click" | "double-click";
    position : Point;
}