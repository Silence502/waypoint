import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { createGame, getGames, type Game } from "@/services/db";

export function useDashboard() {
  const route = useRoute();
  const activeGameId = computed(() => {
    const id = Number(route.params.id);
    return Number.isNaN(id) ? null : id;
  });

  const appWindow = getCurrentWindow();
  const minimize = () => appWindow.minimize();
  const maximize = () => appWindow.toggleMaximize();
  const close = () => appWindow.close();

  const visible = ref(false);
  const isMobile = ref(false);
  const isOpen = ref(true);
  const loading = ref(false);
  const error = ref("");
  let mql: MediaQueryList | null = null;
  let onMqlChange: ((event: MediaQueryListEvent) => void) | null = null;

  const games = ref<Game[]>([]);
  const selectedExePath = ref("");
  const selectedGameName = ref("");

  async function loadGames() {
    games.value = await getGames();
  }

  async function pickExecutable() {
    const path = await open({
      multiple: false,
      filters: [{ name: "Exécutable", extensions: ["exe"] }],
    });
    if (typeof path !== "string") return;
    selectedExePath.value = path;
    const fileName = path.split(/[\\/]/).pop() ?? path;
    selectedGameName.value = fileName.replace(/\.exe$/i, "");
  }

  async function saveGame() {
    if (!selectedExePath.value || !selectedGameName.value) return;
    loading.value = true;
    error.value = "";
    try {
      await createGame(selectedGameName.value, selectedExePath.value);
      await loadGames();
      visible.value = false;
      selectedExePath.value = "";
      selectedGameName.value = "";
    } catch (e) {
      error.value = "Impossible d'ajouter ce jeu.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadGames();

    if (typeof window === "undefined") return;

    mql = window.matchMedia("(max-width: 1023px)");
    isMobile.value = mql.matches;
    isOpen.value = !isMobile.value;
    onMqlChange = event => {
      isMobile.value = event.matches;
      isOpen.value = !event.matches;
    };
    mql.addEventListener("change", onMqlChange);
  });

  onBeforeUnmount(() => {
    if (mql && onMqlChange) {
      mql.removeEventListener("change", onMqlChange);
    }
  });

  return {
    activeGameId,
    minimize,
    maximize,
    close,
    visible,
    isMobile,
    isOpen,
    loading,
    error,
    games,
    selectedExePath,
    selectedGameName,
    pickExecutable,
    saveGame,
  };
}
