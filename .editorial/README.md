# Curvy& Editorial Queue

Automated research runs place unpublished article drafts in `drafts/` as JSON files. Open the local review dashboard at `http://localhost:3000/editorial-review` to preview, reject, or publish them.

Publishing is deliberately a human-confirmed action. The local server validates the article, adds it to `src/editorialPosts.ts`, runs project checks, commits the approved article, and pushes `main` to GitHub.

Drafts must contain the same fields as `BlogPost` in `src/blog.ts`. Each source must include a descriptive label and a direct public URL. Copying Reddit comments or third-party articles verbatim is not permitted; drafts should synthesize recurring themes and clearly separate sourced observations from editorial inference.
