# AGENTS.md

Instructions for AI agents (and people) working on this repository.

## The project

A DevOps learning lab: a hello world app taken step by step from a local server to a production service on `https://devops-pipe.live`, through containers, CI, Kubernetes, and Helm. **Every tool solves a named, measured problem.** The repository is a lab notebook: its history is kept exactly as it happened.

## Read first

1. [docs/pipeline.md](docs/pipeline.md): every phase, and the plan ahead.
2. The latest phase's `result.md`: the ranked open limitations. The next work starts from them.
3. [docs/lessons-learned.md](docs/lessons-learned.md): past backtracks; don't repeat them.
4. [docs/conventions/](docs/conventions/): how work is done here.

## Non-negotiable rules

- **One problem per step:** name it, measure it, then add the simplest tool that solves it. Record the new costs and limitations.
- **Phase docs are history:** never rewritten, except to correct facts. No pointers forward; limitations only.
- **Docs come after implementation,** written from the verified final state, in the same PR as the change.
- **Diagrams first,** tables second, short lists third. No long paragraphs.
- **Pin everything:** images by digest, actions by commit SHA. Verify every download. 14-day cooldown unless it's a security release.
- **Secrets never** in Git, script text, logs, or printed configuration.
- **Infrastructure as Code first;** settings made in a web interface are documented as ordered steps until they become code.

## Working with the owner

- **One stage per message:** explain and decide, then implement, then document. Wait for decisions before continuing.
- **Explain before giving steps;** predict the expected output of every command.
- **Short, clear steps;** plain words; define a term before using it.
- **Recommend one option, with reasons;** the owner decides.
- **Be critical and honest.** Don't over-engineer. Never invent facts: verify versions and release notes, and say when unsure.
- **For existing files, give only the exact changed lines;** full content only for new files.

Details: [workflow](docs/conventions/workflow.md) · [documentation](docs/conventions/documentation.md) · [code and configuration](docs/conventions/code-and-configuration.md) · [security](docs/conventions/security.md) · [engineering principles](docs/conventions/engineering-principles.md) · [templates](docs/conventions/templates/)
