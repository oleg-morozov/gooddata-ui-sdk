// (C) 2007-2021 GoodData Corporation

import {
    SingleMeasureWithRowAttribute,
    SingleMeasureWithTwoRowAndTwoColumnAttributes,
} from "./table.fixture.js";
import { TableDescriptor } from "../tableDescriptor.js";
import { createColumnLocator } from "../colLocatorFactory.js";
import { ScopeCol } from "../tableDescriptorTypes.js";
import { describe, it, expect } from "vitest";

describe("createColumnLocator", () => {
    it("creates valid leaf column locator in table without column attributes", () => {
        const t = TableDescriptor.for(SingleMeasureWithRowAttribute, "empty value");

        expect(createColumnLocator(t.headers.leafDataCols[0])).toMatchSnapshot();
    });

    it("creates valid leaf column locator in table with column attributes", () => {
        const t = TableDescriptor.for(SingleMeasureWithTwoRowAndTwoColumnAttributes, "empty value");

        expect(createColumnLocator(t.headers.leafDataCols[0])).toMatchSnapshot();
    });

    it("creates valid group column locator for top-level group in table with column attributes", () => {
        const t = TableDescriptor.for(SingleMeasureWithTwoRowAndTwoColumnAttributes, "empty value");

        const topLevelGroup = t.headers.rootDataCols[0].children[0] as ScopeCol;

        expect(createColumnLocator(topLevelGroup)).toMatchSnapshot();
    });

    it("creates valid group column locator for second-level group in table with column attributes", () => {
        const t = TableDescriptor.for(SingleMeasureWithTwoRowAndTwoColumnAttributes, "empty value");

        const secondLevelGroup = t.headers.rootDataCols[0].children[0].children[0] as ScopeCol;

        expect(createColumnLocator(secondLevelGroup)).toMatchSnapshot();
    });
});
