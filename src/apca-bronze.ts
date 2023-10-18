import type { ConformanceThresholdFn } from "./index.js";

// APCA Bronze Level Conformance
// https://readtech.org/ARC/tests/visual-readability-contrast/?tn=criterion

const APCABronzeConformanceThresholdFn: ConformanceThresholdFn = (fontSize) => {
    const size = parseFloat(fontSize);
    switch (true) {
        case size >= 32:
            return 45;
        case size >= 16:
            return 60;
        default:
            return 75;
    }
};

export default APCABronzeConformanceThresholdFn;
