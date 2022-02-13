Feature: Test

@Rule
Rule: Rule with rule1 tag

Scenario: No tags
    Given A scenario without tags is created
    When this Scenario is compiled
    Then something should happen

@Rule2
Rule: Rule with rule2 tag

Scenario Outline: No tags one examples
    Given A scenarioOutline without tags is created
    When this Scenario Outline is compiled
    Then something should happen

    Examples:
        | no tag column |
        | no tag row    |

Scenario Outline: Multiple tags in multiple examples
    Given A scenarioOutline with tags in multiple examples is created
    When this Scenario Outline is compiled
    Then something should happen

    Examples:
        | multiple examples no tag column |
        | multiple examples no tag row    |