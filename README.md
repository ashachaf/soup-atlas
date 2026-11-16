# אטלס המרקים (Soup Atlas)

A static recipe site for soups: every variation of a soup side by side, with search by
type, tradition, flavor and the ingredients you have at home. Built with Astro, in Hebrew.

## Run it

    npm install
    npm run dev      # http://localhost:4321
    npm run build    # static site in dist/

## Branding

Everything about the look and the site's name lives in one file: `src/data/brand.json`.

| Section   | What it controls |
|-----------|------------------|
| `name`, `tagline`, `footerNote` | Site name, the line under it, and the footer text |
| `colors`  | `bg` page, `surface` cards and content sheet, `ink` text, `muted` secondary text, `line` borders, `accent` links, selected filters and step numbers, `accentSoft` tradition tags and notices, `herb` and `herbSoft` type tags, checkboxes and pantry chips, `warn` missing ingredients |
| `fonts`   | Heading and body font stacks, base text size, and the Google Fonts URL that loads them |
| `shape`   | Corner radius of cards and panels |
| `doodles` | The floating ingredient drawings: `enabled`, `animate`, their `opacity`, the `sheetOpacity` of the content sheet over them (1 hides them behind text), and the `outline` color |

Keep `ink` dark and `bg` light: the pages are meant to be read on a phone while cooking.
The drawings themselves, and which ingredient maps to which drawing, are in
`src/components/Doodles.astro`.

## Content

- `src/data/recipes/*.json`: one file per recipe. Each is a complete, standalone recipe.
  An add-on (noodles and the like) is a recipe in the `addons` family with a `goesWith` list of the soups it suits; it is not a soup variation.
- `src/data/ingredients.json`: the ingredient dictionary (names, aliases, substitutions, staples).
- `src/data/meta.json`: soup families and the labels for types and flavors.

A recipe belongs to one `family` and can be cross-listed in others with `alsoIn`.
The build fails if a recipe uses an ingredient or family that is not defined.
