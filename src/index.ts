'use strict';

import { PreCompiler } from "gherking";
import { Scenario, ScenarioOutline, Examples, Rule, Element, Feature, Tag } from "gherkin-ast";
import { FilterConfig } from "./types";
import parse from 'cucumber-tag-expressions'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:filter");

const DEFAULT_CONFIG: FilterConfig = {
    filter: "not @wip"
}

const tagsToString = (tags: Tag[]) => {
    if (tags && tags.length) {
        return tags.map(tag => tag.toString())
    }
    return [];
}

class Filter implements PreCompiler {
    private config: FilterConfig;
    private parsedFilter;
    private featureTags: Tag[];
    private ruleTags: Tag[];
    constructor(config?: FilterConfig) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...(config || {}),
        };
        this.parsedFilter = parse(this.config.filter);
        debug("Intializing Filter, config: %o", config);
    }

    preFeature(feature: Feature) {
        this.featureTags = feature.tags;
        return true;
    }

    preRule(rule: Rule) {
        this.ruleTags = rule.tags;
        return true
    }

    preScenario(scenario: Scenario, parent: Feature | Rule): boolean {   
        let tags = tagsToString(scenario.tags)
                        .concat(tagsToString(this.featureTags));                       
        if (parent instanceof Rule) {
           tags = tags.concat(tagsToString(parent.tags));
        }

        return this.parsedFilter.evaluate(tags);
    }

    preScenarioOutline(scenarioOutline: ScenarioOutline, parent: Feature | Rule): boolean {
        scenarioOutline.examples = scenarioOutline.examples.filter((example: Examples) => {
            const exampleTags = tagsToString(example.tags)
                        .concat(tagsToString(scenarioOutline.tags))
                        .concat(tagsToString(this.ruleTags))
                        .concat(tagsToString(this.featureTags));
            return this.parsedFilter.evaluate(exampleTags);
        });
        if (!scenarioOutline.examples.length) {
            return false;
        }  
        let tags = tagsToString(scenarioOutline.tags)
                        .concat(tagsToString(this.featureTags));
        
        for (const example of scenarioOutline.examples) {
            tags = tags.concat(tagsToString(example.tags));
        }
        if (parent instanceof Rule) {
            tags = tags.concat(tagsToString(parent.tags));
        }

        return this.parsedFilter.evaluate(tags);
    }

    postRule(rule: Rule): boolean {
        if (rule.elements.length && rule.elements.some((element: Element) => element.keyword === "Scenario" || element.keyword === "Scenario Outline")) {
            return true;
        }
        return false;
    }

    postFeature(feature: Feature): boolean {
        if (feature.elements.length && feature.elements.some((element: Element) => 
         element.keyword === "Scenario"
         || element.keyword === "Scenario Outline"
         || element.keyword === "Rule")) {
            return true;
        }
        return false;
    }
}

export = Filter;
