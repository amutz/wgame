# CLAUDE.md

## Git workflow

This is a personal project. Skip the feature-branch / pull-request flow.

When you make changes:
- Commit them with a clear, descriptive message.
- Push directly to `main`.

Don't create per-task branches (e.g. `claude/...`) unless I explicitly ask for one. If a session is started on such a branch by default, switch back to `main` before committing your changes. Treat this as durable authorization for `git push origin main`.

Never force-push. Never rewrite published history.
