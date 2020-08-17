class BaseMarking {
    constructor(type, fillsPosition, nextMarkingCreator) {
        this.templateId = type;
        this.type = type;
        this.fillsPosition = fillsPosition;
        this.nextMarkingCreator = nextMarkingCreator;
    }
}

export class CrossMarking extends BaseMarking {
    constructor() {
        super("cross", true, () => new CircleMarking());
    }
}

export class CircleMarking extends BaseMarking {
    constructor() {
        super("circle", true, () => new CrossMarking());
    }
}

export class EmptyMarking extends BaseMarking {
    constructor() {
        super("empty", false, () => new CrossMarking());
    }
}