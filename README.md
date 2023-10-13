# Auto Generate Release Changelog by Tag

Auto Generate Release Changelog by Tag

> ref: [Generate API](https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#generate-release-notes-content-for-a-release)

## Release

1. Clone
2. `npm i`
3. Install `@vercel/ncc` : `npm i -g @vercel/ncc` (skip if installed)
4. `npm run build`
5. Push

## Inputs

see [action.yml](action.yml)

## Example usage

### Action Config

``` yml

jobs:
  example:
    steps:
      - uses: wxul/auto-generate-release-action@v1
        id: release_generate
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  ## GITHUB_TOKEN
        with:
          source_tag: 'v1.0.1' ## current tag
      - name: Echo
        run: echo "${{ steps.release_generate.outputs.release_note }}" ## show output
```
