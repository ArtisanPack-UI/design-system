# Baselines

One PNG per component and sheet, `<Component>/<sheet>.png` (`light`, `dark`, `high-contrast`, `rtl`), shared by every stack (D-016). Component repos point `baselines` in their `apui-gates` config here.

Baselines are Linux renders from CI. To add or update one, run the gates in CI, review the screenshots in the `quality-gates` artifact, and commit the approved ones here in a design-system PR. Never commit a render from macOS or Windows: fonts rasterize differently.
