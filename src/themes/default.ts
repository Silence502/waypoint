import { definePreset, palette } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const primaryPalette = palette("#D4C155");

export const defaultTheme = definePreset(Aura, {
  semantic: {
    primary: primaryPalette,
  },
});
