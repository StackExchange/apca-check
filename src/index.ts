import { calcAPCA } from "apca-w3";
import axe, { type Check, Rule } from "axe-core";
import APCABronzeConformanceThresholdFn from "./apca-bronze.js";
import APCASilverPlusConformanceThresholdFn from "./apca-silver-plus.js";

type ConformanceLevel = "bronze" | "silver" | "custom";

type ConformanceThresholdFn = (
    fontSize: string,
    fontWeight: string,
) => number | null;

// Augment Axe types to include the color utilities we use in this file
// https://github.com/dequelabs/axe-core/blob/develop/lib/commons/color/color.js
type Color = {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    toHexString: () => string;
};
declare module "axe-core" {
    interface Commons {
        color: {
            getForegroundColor: (
                node: HTMLElement,
                _: unknown,
                bgColor: Color | null,
            ) => Color | null;
            getBackgroundColor: (node: HTMLElement) => Color | null;
        };
    }
}

const generateColorContrastAPCAConformanceCheck = (
    conformanceLevel: string,
    conformanceThresholdFn: ConformanceThresholdFn,
): Check => ({
    id: `color-contrast-apca-${conformanceLevel}-conformance`,
    metadata: {
        impact: "serious",
        messages: {
            pass:
                "Element has sufficient APCA " +
                conformanceLevel +
                " level lightness contrast (Lc) of ${data.apcaContrast}Lc (foreground color: ${data.fgColor}, background color: ${data.bgColor}, font size: ${data.fontSize}, font weight: ${data.fontWeight}). Expected minimum APCA contrast of ${data.apcaThreshold}}",
            fail: {
                default:
                    "Element has insufficient APCA " +
                    conformanceLevel +
                    " level contrast of ${data.apcaContrast}Lc (foreground color: ${data.fgColor}, background color: ${data.bgColor}, font size: ${data.fontSize}, font weight: ${data.fontWeight}). Expected minimum APCA lightness contrast of ${data.apcaThreshold}Lc",
                increaseFont:
                    "Element has insufficient APCA " +
                    conformanceLevel +
                    " level contrast of ${data.apcaContrast}Lc (foreground color: ${data.fgColor}, background color: ${data.bgColor}, font size: ${data.fontSize}, font weight: ${data.fontWeight}). Increase font size and/or font weight to meet APCA conformance minimums",
            },
            incomplete: "Unable to determine APCA lightness contrast (Lc)",
        },
    },
    evaluate(n) {
        const node = n as HTMLElement;
        const nodeStyle = window.getComputedStyle(node);
        const fontSize = nodeStyle.getPropertyValue("font-size");
        const fontWeight = nodeStyle.getPropertyValue("font-weight");

        const bgColor: Color | null =
            axe.commons.color.getBackgroundColor(node);
        const fgColor: Color | null = axe.commons.color.getForegroundColor(
            node,
            false,
            bgColor,
        );

        // missing data to determine APCA contrast for this node
        if (!bgColor || !fgColor || !fontSize || !fontWeight) {
            return undefined;
        }

        const toRGBA = (color: Color) => {
            return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
        };

        const apcaContrast = Math.abs(
            calcAPCA(toRGBA(fgColor), toRGBA(bgColor)) as number,
        );
        const apcaThreshold = conformanceThresholdFn(fontSize, fontWeight);

        this.data({
            fgColor: fgColor.toHexString(),
            bgColor: bgColor.toHexString(),
            fontSize: `${((parseFloat(fontSize) * 72) / 96).toFixed(
                1,
            )}pt (${fontSize}px)`,
            fontWeight: fontWeight,
            apcaContrast: Math.round(apcaContrast * 100) / 100,
            apcaThreshold: apcaThreshold,
            messageKey: apcaThreshold === null ? "increaseFont" : "default",
        });

        return apcaThreshold ? apcaContrast >= apcaThreshold : false;
    },
});

const generateColorContrastAPCARule = (conformanceLevel: string): Rule => ({
    id: `color-contrast-apca-${conformanceLevel}`,
    impact: "serious",
    matches: "color-contrast-matches",
    metadata: {
        description: `Ensures the contrast between foreground and background colors meets APCA ${conformanceLevel} level conformance minimums thresholds`,
        help: "Elements must meet APCA conformance minimums thresholds",
        helpUrl:
            "https://readtech.org/ARC/tests/visual-readability-contrast/?tn=criterion",
    },
    all: [`color-contrast-apca-${conformanceLevel}-conformance`],
    tags: ["apca", "wcag3", `apca-${conformanceLevel}`],
});

const registerAxeAPCA = (
    conformanceLevel: ConformanceLevel,
    customConformanceThresholdFn?: ConformanceThresholdFn,
) => {
    if (
        conformanceLevel === "custom" &&
        typeof customConformanceThresholdFn !== "function"
    ) {
        throw new Error(
            "A custom conformance level requires a custom conformance threshold function",
        );
    }

    const conformanceThresholdFnMap = {
        bronze: APCABronzeConformanceThresholdFn,
        silver: APCASilverPlusConformanceThresholdFn,
        custom: customConformanceThresholdFn!,
    };

    axe.configure({
        rules: [generateColorContrastAPCARule(conformanceLevel)],
        checks: [
            generateColorContrastAPCAConformanceCheck(
                conformanceLevel,
                conformanceThresholdFnMap[conformanceLevel],
            ),
        ],
    });
};

export type { ConformanceLevel, ConformanceThresholdFn };
export default registerAxeAPCA;
