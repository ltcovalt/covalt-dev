# Check

Input validation and error handling library that that uses a fluent, chainable API.
Leverages a standard JavaScript class and public factory function rather than Prototype.js.
Multiple validations can be chained together and a validation chain can be configured to
throw an error or simply return a result object containing details on the checks performed.
Leverages a standard JavaScript class instead of Prototype.js.

## Classes

| Class | Description |
| ------ | ------ |
| [Checker](classes/Checker.md) | Performs runtime type validation and error handling |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CheckDetail](interfaces/CheckDetail.md) | details the results of each predicate check performed |

## Functions

| Function | Description |
| ------ | ------ |
| [Check](functions/Check.md) | Factory function for the Checker class |
