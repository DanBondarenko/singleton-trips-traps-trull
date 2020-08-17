import Position from "./position.js"

export default class Field {
    constructor(gameSize) {
        this.gameSize = gameSize;
        this.field = createEmptyArray(gameSize)
            .map(
                (_, outerIndex) => createEmptyArray(gameSize).map(
                    (_, innerIndex) => Position.createDefault(innerIndex, outerIndex)
                )
            );
    }

    getAllPositions() {
        return this.field.flat();
    }

    getPosition(xCoord, yCoord) {
        return this.field[yCoord][xCoord];
    }

    static createDefault(gameSize) {
        if (gameSize === undefined) {
            return new Field(3);
        }
        return new Field(gameSize);
    }

    getVictories() {
        return Field.removeDuplicates(
            ...this.getNonDiagonalVictories(),
            ...this.getDiagonalVictories()
        );
    }

    getNonDiagonalVictories() {
        const getNonDiagonalVictoriesByAxis = getElementByIndexes => {
                const lengthWiseVictories = [];
            for (let outerIndex = 0; outerIndex < this.gameSize; outerIndex++) {
                const filledPositionsByMarkingInLine = {}
                for (let innerIndex = 0; innerIndex < this.gameSize; innerIndex++) {
                    Field.countPositionIfMarked(filledPositionsByMarkingInLine, getElementByIndexes(outerIndex, innerIndex))
                }
                lengthWiseVictories.push(...this.calculateVictoriousMarkings(filledPositionsByMarkingInLine));
            }
            return lengthWiseVictories
        }

        return Field.removeDuplicates(
            ...getNonDiagonalVictoriesByAxis(
                (outerIndex, innerIndex) => this.field[outerIndex][innerIndex]
            ),
            ...getNonDiagonalVictoriesByAxis(
                (outerIndex, innerIndex) => this.field[innerIndex][outerIndex]
            )
        );
    }

    getDiagonalVictories() {
        const getDiagonalVictoriesByDiagonal = getElementByIndexes => {
            const filledPositioinsInDiagonal = {}
            this.getFilledPositionsByMarkingInDiagonals(getElementByIndexes, filledPositioinsInDiagonal);
            return this.calculateVictoriousMarkings(filledPositioinsInDiagonal);
        }

        return Field.removeDuplicates(
            ...(getDiagonalVictoriesByDiagonal(
                index => this.field[index][index]
            )),
            ...(getDiagonalVictoriesByDiagonal(
                index => this.field[this.gameSize - (index + 1)][index]
            ))
        );
    }

    getFilledPositionsByMarkingInDiagonals(getElementByIndexes, filledPositioinsInDiagonal) {
        for (let diagonalIndex = 0; diagonalIndex < this.gameSize; diagonalIndex++) {
            const position = getElementByIndexes(diagonalIndex);
            Field.countPositionIfMarked(filledPositioinsInDiagonal, position);
        }
    }

    static removeDuplicates(...array) {
        return array.reduce(
            (result, item) => result.includes(item) ? result : [...result, item], []
        )
    }

    static countPositionIfMarked(countingData, position) {
        if (position.isFilled()) {
            if (countingData.hasOwnProperty(position.getMarkingType())) {
                countingData[position.getMarkingType()] += 1;
            } else {
                countingData[position.getMarkingType()] = 1;
            }
        }
    }

    calculateVictoriousMarkings(countsOfMarkingsByType) {
        return Object.keys(countsOfMarkingsByType)
            .filter(markingType => countsOfMarkingsByType[markingType] === this.gameSize)
    }
};

function createEmptyArray(length) {
    return Array.from(Array(length));
}