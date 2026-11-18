# Code and Configuration

How files read, so that each one explains itself.

## Names

- **Self-documenting, always:** files, workflows, jobs, branches, steps, variables. Never shorten at the cost of clarity.
  - `publish-image.yml`, not `publish.yml`; job `push-image-to-ghcr`, not `push`.
- **Name by purpose, not by tool or setting:** `build-and-test-main` says what the job checks, and doesn't depend on how merges are configured.
- **Name what is true:** a workflow that doesn't deploy isn't called "production."

## Comments

```yaml
# Header: what the file is, how it's used, and its security measures.
#   docker compose -f compose.yaml -f compose.production.yaml up -d
services:
  app:
    pull_policy: missing  # a digest's content never changes
```

- **Short and inline,** two spaces before `#`; above the line only when too long for inline.
- **Explain why,** not what the line literally says.
- **No claims about other files:** they drift. Link or name the file instead of describing its contents.
- **Usage in the header:** the commands that use the file.

## Configuration

- **Files over commands:** a setting lives in a reviewed file, not in a command someone has to remember.
- **Declarative over imperative:** describe the desired state (`compose.yaml`, manifests, charts) rather than steps.
- **Each value once:** when a value repeats across files, that's a limitation to record, and to remove when a tool allows it (Helm `values.yaml`).
- **Development and production are separate:** development builds from source; production runs a published image by digest and never builds.
- **Simulations are declared** in the code and the docs (for example, the app's simulated startup time).
