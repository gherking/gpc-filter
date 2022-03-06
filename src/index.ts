'use strict';

import { PreCompiler } from "gherking";
import { Scenario, ScenarioOutline, Examples, Rule, Element, Feature, Tag } from "gherkin-ast";
import parse from 'cucumber-tag-expressions'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:filter");

const DEFAULT_CONFIG: string = "not @wip";

const tagsToString = (tags: Tag[]) => {
    if (tags && tags.length) {
        return tags.map(tag => tag.toString())
    }
    return [];
}

class Filter implements PreCompiler {
    private filter;
    private featureTags: Tag[];
    constructor(config?: string) {
        this.filter = config? parse(config) : parse(DEFAULT_CONFIG);
        debug("Intializing Filter, config: %o", config);
    }

    preFeature(feature: Feature) {
        this.featureTags = feature.tags;
        debug("Storing feature tags: %o", this.featureTags)
        return true;
    }

    preScenario(scenario: Scenario, parent: Feature | Rule): boolean {
        debug("Gathering tags of Scenario: %s", scenario.name);   
        let tags = tagsToString(scenario.tags)
                        .concat(tagsToString(this.featureTags))
                        .concat(tagsToString(parent.tags));
        debug("The tags are: %o", tags)

        return this.filter.evaluate(tags);
    }

    preScenarioOutline(scenarioOutline: ScenarioOutline, parent: Rule | Feature): boolean {
        debug("Gathering tags of Scenario Outline: %s", scenarioOutline.name);
        scenarioOutline.examples = scenarioOutline.examples.filter((example: Examples) => {
            debug("Gathering tags of example: %o", example.header)
            const exampleTags = tagsToString(example.tags)
                        .concat(tagsToString(scenarioOutline.tags))
                        .concat(tagsToString(parent.tags))
                        .concat(tagsToString(this.featureTags));
            debug("The tags are: %o", exampleTags)
            return this.filter.evaluate(exampleTags);
        });
        
        return !!scenarioOutline.examples.length;
    }

    postRule(rule: Rule): boolean {
        debug("Checking remaining element of Rule %s", rule.name)
        return (rule.elements.length && rule.elements.some((element: Element) => 
            element instanceof Scenario || element instanceof ScenarioOutline)
        );
    }

    postFeature(feature: Feature): boolean {
        debug("Checking remaining elements of Feature %s", feature.name)
        return (feature.elements.length && feature.elements.some((element: Element) => 
         element instanceof Scenario
         || element instanceof ScenarioOutline
         || element instanceof Rule)) 
    }
}

export = Filter;
