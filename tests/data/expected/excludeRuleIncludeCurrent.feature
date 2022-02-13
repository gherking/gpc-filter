Feature: Test

@Rule
Rule: Rule with rule1 tag

@current
Scenario: Another tag
    Given A scenario with another tag is created
    When this Scenario is compiled
    Then something should happen

@wip @current
Scenario: Both tags
    Given A scenario both tags is created
    When this Scenario is compiled
    Then something should happen