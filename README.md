# github-action-resharper-inpsect-code

This action inspects code with the ReSharper Command Line Tool.

Inspection result is annotated to PR File Change Tab.

## Input

### solutionPath

**Required**

Inspection Target Solution File Path

### profilePath

The DotSettings profile to run against the profiler. If empty tries to use solution DotSettings. If that doesn't exist, uses the default.

### failOnIssue

Default is '1'.

Set this option '0', only annotation is enabled, action will not fail when issue is exists.

### minimumFailSeverity

- error
- warning
- notice (default)

Sets the level that will cause an action failure. (Lower severity issues are annotated only.)
### minimumReportSeverity

- error
- warning
- notice (default)

Sets the level that will be included in the report.

### exclude

Set this options to specified exclude path to ReSharper CLI.

### ignoreIssueType

Comma-separated list of ignore issue type.

```text
UnusedField.Compiler,UnusedMember.Global
```

References:  
[https://www.jetbrains.com/help/resharper/Reference__Code_Inspections_CSHARP.html#BestPractice](https://www.jetbrains.com/help/resharper/Reference__Code_Inspections_CSHARP.html#BestPractice)

### resharperCliVersion

Default is '2023.3.2'.

Set this option to change the version of the ReSharper CLI that's installed.
## Usage

```yaml
on: [push]

jobs:
  inspection:
    runs-on: ubuntu-latest # or macos-latest, windows-latest
    name: Inspection
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x' # or 3.1.x, 5.0.x
      - name: Restore
        run: dotnet restore
      - name: ReSharper CLI InspectCode
        uses: OnboardRS/github-action-resharper-inspect-code@1.0.0
        with:
          solutionPath: ./YourSolution.sln
          minimumFailSeverity: warning
          failOnIssue: 1
          minimumReportSeverity: warning
          
```