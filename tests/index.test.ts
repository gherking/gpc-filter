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

    test("should be able to filter out Feature", async () => {
        const actual = pruneID(process(base, new Filter("@nonExistent"))) as Document[];
        expect(actual).toHaveLength(0);
    });  

    test("should be able to filter out Rule", async () => {
        const expected = await loadTestFeatureFile("expected", "excludeRule.feature");
        const actual = pruneID(process(base, new Filter("not @Rule"))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });

    test("should be able to filter out scenarios", async () => {
        const expected = await loadTestFeatureFile("expected", "includeCurrentAndWip.feature");
        const actual = pruneID(process(base, new Filter("@wip and @current"))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });

    test("should work with complex filter", async () => {
        const expected = await loadTestFeatureFile("expected", "complex.feature");
        const actual = pruneID(process(base, new Filter("(@Rule and @current and not @wip) or (@Rule2 and not (@wip and @current))"))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    });
});