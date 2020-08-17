import {EmptyMarking} from "./markings.js"

export default class Position {
    constructor(xCoord, yCoord, mark) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.mark = mark;
    }

    static createDefault(xCoord, yCoord) {
        return new Position(xCoord, yCoord, new EmptyMarking());
    }

    markAs(element) {
        if (this.isFilled()) {
            throw "That position is already filled!";
        }

        this.mark = element;
    }

    isFilled() {
        return this.mark.fillsPosition;
    }

    getMarkingType() {
        return this.mark.type;
    }

    getMarkingTemplateId() {
        return this.mark.templateId;
    }
};