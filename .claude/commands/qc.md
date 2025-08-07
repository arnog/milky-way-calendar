Let's do quality control on the codebase.

Check that the codebase adheres to the project's coding standards and best
practices which are documented in @documents/CODING_GUIDELINES.md.

Check that there are no hard-coded colors in the UI. Colors should use an
abstract token if possible, or a color from the standard color palette, i.e.
`--blue-500`, etc...

Run `npm run prettier` (which will run lint and typecheck) and correct any
issues that arise.
