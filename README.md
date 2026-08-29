# Claude + CodeGrid Knowledge Pack

This pack converts a large CodeGrid source archive into a retrieval-friendly knowledge layer.

Recommended Claude Project setup:

1. Put `00_CLAUDE_PROJECT_INSTRUCTIONS.md` into Project Instructions.
2. Upload `01_CODEGRID_INDEX.md`.
3. Upload the entire `02_PATTERN_CARDS/` folder if Claude accepts the folder structure, or upload the markdown cards.
4. Keep the original CodeGrid source archive separately as an implementation/reference archive.
5. When possible, use Claude's project knowledge/RAG to retrieve the relevant source files rather than stuffing every project into every prompt.

The key idea is progressive disclosure:
**global rules -> index -> small pattern cards -> exact source implementation.**

This is much more reliable for a website generator than giving the model a giant undifferentiated dump of source code.
