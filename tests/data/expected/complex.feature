Feature: Test

@Rule
Rule: Rule with rule1 tag

@current
Scenario: Another tag
    Given A scenario with another tag is created
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

@wip
Scenario Outline: One tag one examples
    Given A scenarioOutline with one tag is created
    When this Scenario Outline is compiled
    Then something should happen

    Examples:
        | one tag column |
        | one tag row    |

@current
Scenario Outline: Other tag one examples
    Given A scenarioOutline with other tags is created
    When this Scenario Outline is compiled
    Then something should happen

    Examples:
        | other tag column |
        | other tag row    |

Scenario Outline: Multiple tags in multiple examples
    Given A scenarioOutline with tags in multiple examples is created
    When this Scenario Outline is compiled
    Then something should happen

    Examples:
        | multiple examples no tag column |
        | multiple examples no tag row    | 
        
    @wip    
    Examples:
        | multiple examples one tag column |
        | multiple examples one tag row    |

    @current
    Examples:
        | multiple examples other tag column |
        | multiple examples other tag row    |