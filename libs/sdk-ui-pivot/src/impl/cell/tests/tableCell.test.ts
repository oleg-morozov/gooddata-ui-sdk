// (C) 2007-2023 GoodData Corporation
import { render } from "@testing-library/react";
import { identity } from "lodash";
import { getCellClassNames, getMeasureCellFormattedValue, getMeasureCellStyle } from "../cellUtils.js";
import { createCellRenderer } from "../cellRenderer.js";
import { describe, it, expect } from "vitest";

describe("cellRenderer", () => {
    it("should escape value", () => {
        const fakeParams: any = {
            formatValue: identity,
            value: "<button>xss</button>",
            node: {
                rowPinned: false,
            },
        };

        const { container } = render(createCellRenderer()(fakeParams));

        expect(container).toMatchSnapshot();
    });
});

describe("Table utils - Cell", () => {
    describe("getCellClassNames", () => {
        it("should get class names for non drillable cell", () => {
            expect(getCellClassNames(3, 9, false)).toEqual("gd-cell s-cell-3-9 s-table-cell");
        });

        it("should get class names for drillable cell", () => {
            expect(getCellClassNames(3, 9, true)).toEqual(
                "gd-cell-drillable gd-cell s-cell-3-9 s-table-cell",
            );
        });
    });

    describe("getMeasureCellFormattedValue", () => {
        it("should get '-' when cellContent=null", () => {
            expect(getMeasureCellFormattedValue(null, "[red]$#,##0.00", undefined)).toEqual("–");
        });

        it("should NOT get 'NaN' when cellContent=''", () => {
            expect(getMeasureCellFormattedValue("", "[red]$#,##0.00", undefined)).toEqual("NaN");
        });

        it("should get formatted value for number", () => {
            expect(
                getMeasureCellFormattedValue("123456789", "[red]$#,##0.00", { thousand: ".", decimal: "," }),
            ).toEqual("$123.456.789,00");
        });
    });

    describe("getMeasureCellStyle", () => {
        it("should get empty value style when cellContent=null", () => {
            expect(getMeasureCellStyle(null, "[red]$#,##0.00", undefined, true)).toEqual({
                color: "var(--gd-table-nullValueColor, var(--gd-palette-complementary-6, #94a1ad))",
                fontWeight: "bold",
                textAlign: "right",
            });
        });

        it("should get just alignment style when cellContent=''", () => {
            expect(getMeasureCellStyle("", "[red]$#,##0.00", undefined, true)).toEqual({
                textAlign: "right",
            });
        });

        it("should get style for number with color in format when applyColor=true", () => {
            expect(getMeasureCellStyle("123456789", "[red]$#,##0.00", undefined, true).color).toEqual(
                "#FF0000",
            );
        });

        it("should get style for number with backgroundColor in format when applyColor=true", () => {
            expect(
                getMeasureCellStyle("123456789", "[backgroundColor=ffff00]$#,##0.00", undefined, true)
                    .backgroundColor,
            ).toEqual("#ffff00");
        });

        it("should get style for number with color and backgroundColor in format when applyColor=true", () => {
            expect(
                getMeasureCellStyle("123456789", "[backgroundColor=ffff00][red]$#,##0.00", undefined, true),
            ).toMatchObject({
                backgroundColor: "#ffff00",
                color: "#FF0000",
            });
        });

        it("should NOT get style for number with color in format when applyColor=false", () => {
            expect(
                getMeasureCellStyle("123456789", "[red]$#,##0.00", undefined, false).color,
            ).toBeUndefined();
        });

        it("should NOT get style for number with backgroundColor in format when applyColor=false", () => {
            expect(
                getMeasureCellStyle("123456789", "[backgroundColor=ffff00]$#,##0.00", undefined, false)
                    .backgroundColor,
            ).toBeUndefined();
        });

        it("should NOT get style for number without color or backgroundColor in format when applyColor=true", () => {
            const style = getMeasureCellStyle("123456789", "$#,##0.00", undefined, true);
            expect(style.color).toBeUndefined();
            expect(style.backgroundColor).toBeUndefined();
        });
    });
});
