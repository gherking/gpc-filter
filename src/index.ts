'use strict';

import { PreCompiler } from "gherking";
import { Scenario, ScenarioOutline, Examples, Tag, Rule, Element, Feature } from "gherkin-ast";
import { FilterConfig } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:filter");

const checkDuplication = (one: Array<string>, other: Array<string>) => {
    return one.filter((element: string) => other.includes(element));
}

const checkConfig = (config: FilterConfig) => {
    let invalidScenarioTags: Array<string> = [];
    let invalidRuleTags: Array<string> = []
    if (config.includeScenarioTags && config.excludeScenarioTags) {
        invalidScenarioTags = checkDuplication(config.includeScenarioTags, config.excludeScenarioTags)
    }
    if (config.includeRuleTags && config.excludeRuleTags) {
        invalidRuleTags = checkDuplication(config.includeRuleTags, config.excludeRuleTags)
    }
    if (invalidScenarioTags.length || invalidRuleTags.length) {
        throw new Error(`The following tag(s) are present as both inclusion and exclusion: ${invalidScenarioTags.concat(invalidRuleTags)}`);
    }
}

class Filter implements PreCompiler {
    private config: FilterConfig;
    constructor(config?: FilterConfig) {
        this.config = {
            ...(config || {}),
        };
        checkConfig(this.config);        
        debug("Intializing Filter, config: %o", config);
    }

    private checkMatch(tags: Array<Tag>, config: Array<string>) {
        debug("matching %o tags in %o", config, tags)
        return tags.some(tag => config.includes(tag.name))
    }

    onRule(rule: Rule): Rule {
        debug("processing rule: %s", rule.name)
        if (this.config.excludeRuleTags && this.config.excludeRuleTags.length) {
            debug("checking exclusion")
            if (this.checkMatch(rule.tags, this.config.excludeRuleTags)) {
                return null;
            }
        }
        if (this.config.includeRuleTags && this.config.includeRuleTags.length) {
            debug("checking inclusion")
            if (this.checkMatch(rule.tags, this.config.includeRuleTags)) {
                return rule;
            } else {
                return null;
            }    
        }
        return rule;
    }

    postRule(rule: Rule) {
        if (rule.elements.length && rule.elements.some((element: Element) => element.keyword === "Scenario" || element.keyword === "Scenario Outline")) {
            return true;
        }
        return false;
    }

    postFeature(feature: Feature) {        
        if (feature.elements.length && feature.elements.some((element: Element) => element.keyword === "Scenario" || element.keyword === "Scenario Outline" || element.keyword === "Rule")) {
            return true;
        }
        return false;
    }

    onScenario(scenario: Scenario): Scenario {
        debug("processing scenario: %s", scenario.name)
        if (this.config.excludeScenarioTags && this.config.excludeScenarioTags.length) {
            debug("checking exclusion on Scenario level")
            if (this.checkMatch(scenario.tags, this.config.excludeScenarioTags)) {
                return null;
            }
        }
        if (this.config.includeScenarioTags && this.config.includeScenarioTags.length) {
            debug("checking inclusion on Scenario level")
            if (this.checkMatch(scenario.tags, this.config.includeScenarioTags)) {
                return scenario;
            } else {
                return null;
            }    
        }
        return scenario;
    }

    onScenarioOutline(scenarioOutline: ScenarioOutline): ScenarioOutline {
        debug("processing Scenario Outline: %s", scenarioOutline.name)
        if (this.config.excludeScenarioTags && this.config.excludeScenarioTags.length) {            
            debug("checking exclusion on Scenario level")
            if (this.checkMatch(scenarioOutline.tags, this.config.excludeScenarioTags)) {
                return null;
            }
            debug("checking exclusion on examples level")
            scenarioOutline.examples = scenarioOutline.examples.filter((example: Examples) => !this.checkMatch(example.tags, this.config.excludeScenarioTags));
        }
        if (this.config.includeScenarioTags && this.config.includeScenarioTags.length) {
            debug("checking inclusion on Scenario level")
            if (this.checkMatch(scenarioOutline.tags, this.config.includeScenarioTags)) {
                return scenarioOutline;
            } else {
                debug("checking inclusion on examples level")                
                scenarioOutline.examples = scenarioOutline.examples.filter((example: Examples) => this.checkMatch(example.tags, this.config.includeScenarioTags));
            }    
        }
        if (!scenarioOutline.examples.length) {
            return null;
        }
        return scenarioOutline
    }
}

export = Filter;
