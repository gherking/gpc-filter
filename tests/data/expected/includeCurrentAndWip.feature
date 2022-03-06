Feature: Test

@Rule
Rule: Rule with rule1 tag

@wip @current
Scenario: Both tags
    Given A scenario both tags is created
    When this Scenario is compiled
    Then something should happen

@Rule2
Rule: Rule with rule2 tag

@wip @current
Scenario Outline: Both tags one examples
    Given A scenarioOutline with both tags is created
    When this Scenario Outline is compiled
    Then something should happen

    Examples:
        | both tags column |
        | both tags row    |


Scenario Outline: Multiple tags in multiple examples
    Given A scenarioOutline with tags in multiple examples is created
    When this Scenario Outline is compiled
    Then something should happen

    @wip @current
    Examples:
        | multiple examples both tags column |
        | multiple examples both tags row    |