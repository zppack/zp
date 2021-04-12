# How to contribute to this project

## Discussions

You can freely create issues to discuss about features, bugs and code enhancements.

No restricted formats but make it more visible if you are to report a bug.

## Code contribution

At the current stage, you can only create a PR for existing features or codes. If you have a greate idea of a new feature, you can create an issue to discuss it. We will consider incorporating this into development plan if it fits zp's idea very well and is not in the current development plan.

You are to make the following things clear when creating PRs:

1. what kind of PR it is

1. what it is about or what problem it resolves

1. what your commits do or how your commits make sense to the problems

1. your test cases and testing results

## Commits

This project uses `standard-version`, which depends on `[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)` rules, for versions and change logs management.

In this case your commit message should be structured as follows:

``` vim
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common commit structural elements are:

1. **fix**: a commit of the type `fix` patches a bug in your codebase (this correlates with `PATCH` in semantic versioning).

1. **feat**: a commit of the type `feat` introduces a new feature to the codebase (this correlates with `MINOR` in semantic versioning).

1. **BREAKING CHANGE**: a commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with `MAJOR` in semantic versioning). A BREAKING CHANGE can be part of commits of any `type`.

1. `types` other than `fix:` and `feat:` are allowed, for example `[@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)` (based on the [the Angular convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)) recommends `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, and others.

1. `footers` other than `BREAKING CHANGE: <description>` may be provided and follow a convention similar to [git trailer format](https://git-scm.com/docs/git-interpret-trailers).

Here is some commit message [examples](https://www.conventionalcommits.org/en/v1.0.0/#examples).
