import { html, fixture, expect } from "@open-wc/testing";
import axe from "axe-core";
import type { AxeResults } from "axe-core";
import registerAPCACheck from ".";

const runAxe = async (el: HTMLElement): Promise<AxeResults> => {
    return new Promise((resolve, reject) => {
        axe.run(el, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

describe("apca-check", () => {
    describe("custom conformance level", () => {
        beforeEach(() => {
            const customConformanceThresholdFn = (
                fontSize: string,
            ): number | null => {
                return parseFloat(fontSize) >= 32 ? 45 : 60;
            };

            registerAPCACheck("custom", customConformanceThresholdFn);
        });

        it("should throw an error if no custom conformance threshold function is provided", () => {
            expect(() => {
                registerAPCACheck("custom");
            }).to.throw(
                "A custom conformance level requires a custom conformance threshold function",
            );
        });

        it("should check for APCA accessibility contrast violations", async () => {
            const el: HTMLElement = await fixture(
                html`<p
                    style="background: white; color: black; font-size: 12px; font-weight: 400;"
                >
                    Some copy
                </p>`,
            );

            const results = await runAxe(el);

            const apcaPasses = results.passes.filter((violation) =>
                violation.id.includes("color-contrast-apca-custom"),
            );

            await expect(apcaPasses.length).to.equal(1);

            const passNode = apcaPasses[0].nodes[0];
            expect(passNode.all[0].message).to.include(
                "Element has sufficient APCA custom level lightness contrast",
            );
        });

        it("should detect APCA accessibility contrast violations", async () => {
            const el: HTMLElement = await fixture(
                html`<p
                    style="background: white; color: lightgray; font-size: 12px; font-weight: 400;"
                >
                    Some copy
                </p>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-custom"),
            );

            await expect(apcaViolations.length).to.equal(1);

            const violationNode = apcaViolations[0].nodes[0];
            expect(violationNode.failureSummary).to.include(
                "Element has insufficient APCA custom level contrast",
            );
        });

        it("should check nested nodes", async () => {
            const el: HTMLElement = await fixture(
                html`<div style="background: black;">
                    <h2>Some title</h2>
                    <p>Some copy</p>
                    <button style="background: black;">Some button</button>
                </div>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-custom"),
            );

            await expect(apcaViolations[0].nodes.length).to.equal(3);
        });
    });

    describe("bronze conformance level", () => {
        beforeEach(() => {
            registerAPCACheck("bronze");
        });

        it("should check for APCA accessibility contrast violations", async () => {
            const el: HTMLElement = await fixture(
                html`<p
                    style="background: white; color: black; font-size: 12px; font-weight: 400;"
                >
                    Some copy
                </p>`,
            );

            const results = await runAxe(el);

            const apcaPasses = results.passes.filter((violation) =>
                violation.id.includes("color-contrast-apca-bronze"),
            );

            await expect(apcaPasses.length).to.equal(1);

            const passNode = apcaPasses[0].nodes[0];
            expect(passNode.all[0].message).to.include(
                "Element has sufficient APCA bronze level lightness contrast",
            );
        });

        it("should detect APCA accessibility contrast violations", async () => {
            const el: HTMLElement = await fixture(
                html`<p
                    style="background: white; color: gray; font-size: 12px; font-weight: 400;"
                >
                    Some copy
                </p>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-bronze"),
            );

            await expect(apcaViolations.length).to.equal(1);

            const violationNode = apcaViolations[0].nodes[0];
            expect(violationNode.failureSummary).to.include(
                "Element has insufficient APCA bronze level contrast",
            );
        });

        it("should check nested nodes", async () => {
            const el: HTMLElement = await fixture(
                html`<div style="background: black;">
                    <h2>Some title</h2>
                    <p>Some copy</p>
                    <button style="background: black;">Some button</button>
                </div>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-bronze"),
            );

            await expect(apcaViolations[0].nodes.length).to.equal(3);
        });
    });

    describe("silver conformance level", () => {
        beforeEach(() => {
            registerAPCACheck("silver");
        });

        it("should check for APCA accessibility contrast violations", async () => {
            const el: HTMLElement = await fixture(
                html`<p
                    style="background: white; color: black; font-size: 14px; font-weight: 400;"
                >
                    Some copy
                </p>`,
            );

            const results = await runAxe(el);

            const apcaPasses = results.passes.filter((violation) =>
                violation.id.includes("color-contrast-apca-silver"),
            );

            await expect(apcaPasses.length).to.equal(1);

            const passNode = apcaPasses[0].nodes[0];
            expect(passNode.all[0].message).to.include(
                "Element has sufficient APCA silver level lightness contrast",
            );
        });

        it("should detect APCA accessibility contrast violations", async () => {
            const el: HTMLElement = await fixture(
                html`<p
                    style="background: white; color: black; font-size: 12px; font-weight: 400;"
                >
                    Some copy
                </p>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-silver"),
            );

            await expect(apcaViolations.length).to.equal(1);

            const violationNode = apcaViolations[0].nodes[0];
            expect(violationNode.failureSummary).to.include(
                "Element has insufficient APCA silver level contrast",
            );
        });

        it("should check nested nodes", async () => {
            const el: HTMLElement = await fixture(
                html`<div style="background: black;">
                    <h2>Some title</h2>
                    <p>Some copy</p>
                    <button style="background: black;">Some button</button>
                </div>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-silver"),
            );

            await expect(apcaViolations[0].nodes.length).to.equal(3);
        });

        it("should handle both valid code and violations", async () => {
            const el: HTMLElement = await fixture(
                html`<div style="background: white; color: black;">
                    <p style="font-size: 12px; font-weight: 400;">Some copy</p>
                    <p style="font-size: 16px; font-weight: 600;">Some copy</p>
                </div>`,
            );

            const results = await runAxe(el);

            const apcaViolations = results.violations.filter((violation) =>
                violation.id.includes("color-contrast-apca-silver"),
            );

            await expect(apcaViolations[0].nodes.length).to.equal(1);
        });
    });
});
