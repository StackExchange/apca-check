import type { ConformanceThresholdFn } from "./index.js";

const silverPlusAPCALookupTable = [
    // See https://readtech.org/ARC/tests/visual-readability-contrast/?tn=criterion (May 22, 2022)
    // font size in px | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 weights
    [10, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [12, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [14, -1, -1, -1, 100, 100, 90, 75, -1, -1],
    [15, -1, -1, -1, 100, 100, 90, 70, -1, -1],
    [16, -1, -1, -1, 90, 75, 70, 60, 60, -1],
    [18, -1, -1, 100, 75, 70, 60, 55, 55, 55],
    [21, -1, -1, 90, 70, 60, 55, 50, 50, 50],
    [24, -1, -1, 75, 60, 55, 50, 45, 45, 45],
    [28, -1, 100, 70, 55, 50, 45, 43, 43, 43],
    [32, -1, 90, 65, 50, 45, 43, 40, 40, 40],
    [36, -1, 75, 60, 45, 43, 40, 38, 38, 38],
    [48, 90, 60, 55, 43, 40, 38, 35, 35, 35],
    [60, 75, 55, 50, 40, 38, 35, 33, 33, 33],
    [72, 60, 50, 45, 38, 35, 33, 30, 30, 30],
    [96, 50, 45, 40, 35, 33, 30, 25, 25, 25],
];

const APCASilverPlusConformanceThresholdFn: ConformanceThresholdFn = (
    fontSize,
    fontWeight,
) => {
    const size = parseFloat(fontSize);
    const weight = parseFloat(fontWeight);

    // Go over the table backwards to find the first matching font size and then the weight.
    // The value null is returned when the combination of font size and weight does not have
    // any elegible APCA luminosity silver compliant thresholds (represented by -1 in the table).
    const reversedTable = [...silverPlusAPCALookupTable].reverse();

    for (const [rowSize, ...rowWeights] of reversedTable) {
        if (size >= rowSize) {
            for (const [idx, keywordWeight] of [
                900, 800, 700, 600, 500, 400, 300, 200, 100,
            ].entries()) {
                if (weight >= keywordWeight) {
                    const threshold = rowWeights[rowWeights.length - 1 - idx];
                    return threshold === -1 ? null : threshold;
                }
            }
        }
    }

    return null;
};

export default APCASilverPlusConformanceThresholdFn;
