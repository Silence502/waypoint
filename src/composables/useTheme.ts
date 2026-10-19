import { ref } from "vue";
import { setSetting, getSetting } from "./useStore";

const isDark = ref(false);

async function initializeTheme() {
  const theme = await getSetting("theme", "light");
  if (theme === "dark") {
    isDark.value = true;
    document.documentElement.classList.add("gm-dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("gm-dark");
  }
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("gm-dark");
      setSetting("theme", "dark");
    } else {
      document.documentElement.classList.remove("gm-dark");
      setSetting("theme", "light");
    }
  }

  return { isDark, toggleTheme };
}

initializeTheme();
