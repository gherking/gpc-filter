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
    describe("Scenario", () => {
        test("should work with default config", async () => {
            const expected = await loadTestFeatureFile("input", "test.feature");
            const actual = pruneID(process(base, new Filter())) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });
    
        test("should work with empty config", async () => {
            const expected = await loadTestFeatureFile("input", "test.feature");
            const actual = pruneID(process(base, new Filter({
                includeScenarioTags: [],
                excludeScenarioTags: []
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });
    
        test("should work with custom inclusion", async () => {
            const expected = await loadTestFeatureFile("expected", "includeCurrent.feature");
            const actual = pruneID(process(base, new Filter({
                includeScenarioTags: ["current"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });
    
        test("should work with custom inclusion and exclusion", async () => {
            const expected = await loadTestFeatureFile("expected", "includeCurrentExcludeWip.feature");
            const actual = pruneID(process(base, new Filter({
                includeScenarioTags: ["current"],
                excludeScenarioTags: ["wip"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });
    
        test("should work with multiple exclusions", async () => {
            const expected = await loadTestFeatureFile("expected", "multipleExclude.feature");
            const actual = pruneID(process(base, new Filter({
                excludeScenarioTags: ["current","wip"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });
    
        test("should throw error when tag is present as inclusion and exclusion", async () => {
            expect(() => new Filter({
                includeScenarioTags: ["current", "wip", "empty"],
                excludeScenarioTags: ["current", "wip"],
            })).toThrow("The following tag(s) are present as both inclusion and exclusion: current,wip")
        });

        test("should be able to filter out feature", async () => {
            const actual = pruneID(process(base, new Filter({
                includeScenarioTags: ["nonExistent"],
            }))) as Document[];
            expect(actual).toHaveLength(0);
        });
    });

    describe("Rule", () => {
        test("should filter rule with scenarios", async () => {
            const expected = await loadTestFeatureFile("expected", "excludeRule.feature");
            const actual = pruneID(process(base, new Filter({
                excludeRuleTags: ["Rule"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });

        test("should work with combined exclusion",async () => {
            const expected = await loadTestFeatureFile("expected", "excludeRuleAndWip.feature");
            const actual = pruneID(process(base, new Filter({
                excludeRuleTags: ["Rule"],                
                excludeScenarioTags: ["wip"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });

        test("should work with rule exclusion and scenario inclusion",async () => {
            const expected = await loadTestFeatureFile("expected", "excludeRuleIncludeCurrent.feature");
            const actual = pruneID(process(base, new Filter({
                excludeRuleTags: ["Rule2"],
                includeScenarioTags: ["current"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });

        test("should work with rule inclusion and scenario exclusion",async () => {
            const expected = await loadTestFeatureFile("expected", "includeRuleExcludeWip.feature");
            const actual = pruneID(process(base, new Filter({
                includeRuleTags: ["Rule2"],
                excludeScenarioTags: ["wip"],
            }))) as Document[];
    
            expect(actual).toHaveLength(1);
            expect(actual[0]).toEqual(expected);
        });
            
        test("should throw error when tag is present as inclusion and exclusion", async () => {
            expect(() => new Filter({
                includeRuleTags: ["current", "wip", "empty"],
                excludeRuleTags: ["current", "wip"],
            })).toThrow("The following tag(s) are present as both inclusion and exclusion: current,wip")
        });
    });    
});