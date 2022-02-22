import { load, process } from "gherking";
import { Document, pruneID } from "gherkin-ast";
import Filter = require("../src");

const loadTestFeatureFile = async (folder: "input" | "expected", file: string): Promise<Document> => {
    const ast = pruneID(await load(`./tests/data/${folder}/${file}`)) as Document[];
    delete ast[0].uri;
    return ast[0];
}

describe("Filter", () => {
    let base: Document;

    beforeAll(async () => {
        base = await loadTestFeatureFile("input", "test.feature");
    });
    test("should work with default config", async () => {
        const expected = await loadTestFeatureFile("expected", "excludeWip.feature");
        const actual = pruneID(process(base, new Filter())) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });

    test("should work with logical not", async () => {
        const expected = await loadTestFeatureFile("expected", "excludeRule.feature");
        const actual = pruneID(process(base, new Filter({
            filter: "not @Rule"
        }))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });

    test("should work with logical and", async () => {
        const expected = await loadTestFeatureFile("expected", "includeCurrentAndWip.feature");
        const actual = pruneID(process(base, new Filter({
            filter: "@wip and @current"
        }))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });

    test("should work with logical or", async () => {
        const expected = await loadTestFeatureFile("expected", "includeRuleOrWip.feature");
        const actual = pruneID(process(base, new Filter({
            filter: "@Rule or @wip"
        }))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });

    test("should be able to filter out feature", async () => {
        const actual = pruneID(process(base, new Filter({
            filter: "@nonExistent"
        }))) as Document[];
        expect(actual).toHaveLength(0);
    });  
});