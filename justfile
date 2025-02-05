build:
    bun run cti
    bun run build

publish:
    just build
    bun publish --access=public