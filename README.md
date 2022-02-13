# gpc-filter

![Downloads](https://img.shields.io/npm/dw/gpc-filter?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/gpc-filter?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/gherking/gpc-filter/master?label=version%40git&style=flat-square)
![CI](https://img.shields.io/github/workflow/status/gherking/gpc-filter/CI/master?label=ci&style=flat-square)
![Docs](https://img.shields.io/github/workflow/status/gherking/gpc-filter/Docs/master?label=docs&style=flat-square)

The Filter precompiler is responsible for including or excluding the elements of a feature file in the result, which match a cucumber-tag-expression (e.g., has a given tag, does not have a given tag)

## Usage

```javascript
'use strict';
const compiler = require('gherking');
const Filter = require('gpc-filter');

let ast = await compiler.load('./features/src/login.feature');
ast = compiler.process(
    ast,
    new Filter({
        // config
    })
);
await compiler.save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

```typescript
'use strict';
import {load, process, save} from "gherking";
import Filter = require("gpc-filter");

let ast = await load("./features/src/login.feature");
ast = process(
    ast,
    new Filter({
        // config
    })
);
await save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

## Configuration

The precompiler accepts the following configuration:

| Option | Type | Description | Necessity |
|:------:|:----:|:------------|:----------|
| `includeScenarioTags` | `Array` | Scenarios with the given tag will be included in the result | Optional |
| `excludeScenarioTags` | `Array` | Scenarios with the given tag will be excluded from the result | Optional |
| `includeRuleTags` | `Array` | Rules with the given tag will be included in the result | Optional |
| `excludeRuleTags` | `Array` | Rules with the given tag and all their elements will be excluded from the result | Optional |

## Example
Excluding scenarios with @wip tag

```@wip
Scenario: One tag
    Given A scenario with one tag is created
    When this Scenario is compiled
    Then something should happen

@current
Scenario: Another tag
    Given A scenario with another tag is created
    When this Scenario is compiled
    Then something should happen
```

Will be processed into:

```
@current
Scenario: Another tag
    Given A scenario with another tag is created
    When this Scenario is compiled
    Then something should happen
```

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gpc:filter` :

```shell
DEBUG=gpc:filter* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gpc-filter/).