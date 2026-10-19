<script setup lang="ts">
import { ref } from 'vue';
import { useGame } from './composables/useGame';
import Skeleton from 'primevue/skeleton';

const editorHolder = ref<HTMLDivElement | null>(null);
const { game, loading, error, notesError, saveStatus } = useGame(editorHolder);
</script>

<template>
	<Skeleton v-if="loading" />
	<p v-else-if="error" class="text-sm text-red-400">{{ error }}</p>
	<section
		v-else-if="game"
		class="flex flex-1 flex-col overflow-y-auto rounded-lg bg-surface-100 dark:bg-surface-800"
	>
		<header class="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
			<h1 class="text-lg font-semibold">{{ game.name }}</h1>
			<p
				v-if="saveStatus === 'saved'"
				class="text-sm text-gray-500 dark:text-gray-400"
				role="status"
				aria-live="polite"
			>
				Enregistré
			</p>
			<p
				v-if="saveStatus === 'saving'"
				class="text-sm text-gray-500 dark:text-gray-400"
				role="status"
				aria-live="polite"
			>
				Enregistrement…
			</p>
			<p
				v-if="saveStatus === 'error'"
				class="text-sm text-red-400"
				role="status"
				aria-live="polite"
			>
				Erreur d’enregistrement
			</p>
		</header>
		<p v-if="notesError" class="px-6 pt-4 text-sm text-red-400">{{ notesError }}</p>
		<div
			ref="editorHolder"
			class="editor-holder min-h-[240px] flex-1 px-6 py-5 text-surface-900 dark:text-surface-100"
		></div>
	</section>
	<section class="flex flex-2 flex-col gap-2 max-w-[356px]">
		<div class="flex-1 rounded-lg bg-surface-100 dark:bg-surface-800"></div>
		<div class="flex-1 rounded-lg bg-surface-100 dark:bg-surface-800"></div>
	</section>
</template>

<style scoped>
/* Éléments générés par Editor.js, inaccessibles via des classes Tailwind : on surcharge ses variables CSS en dark mode. */
.gm-dark .editor-holder,
.gm-dark .editor-holder :deep(.ce-inline-toolbar),
.gm-dark .editor-holder :deep(.ce-popover) {
	--selectionColor: rgba(56, 138, 229, 0.3);
	--inlineSelectionColor: rgba(56, 138, 229, 0.3);
	--bg-light: #2a2f3d;
	--grayText: #9aa1b0;
	--color-dark: #e5e7eb;
	--color-gray-border: rgba(255, 255, 255, 0.16);
	--color-line-gray: rgba(255, 255, 255, 0.12);
	--color-text-primary: #e5e7eb;
	--color-text-secondary: #9aa1b0;
	--color-background: #1f2430;
	--color-background-item-hover: #2a2f3d;
	--color-background-item-focus: rgba(56, 138, 229, 0.18);
	--color-border: rgba(255, 255, 255, 0.12);
	--color-border-icon: rgba(255, 255, 255, 0.16);
	--color-shadow: rgba(0, 0, 0, 0.5);
}

.gm-dark .editor-holder :deep(.ce-popover__container),
.gm-dark .editor-holder :deep(.ce-inline-toolbar) {
	background: #1f2430;
	border-color: rgba(255, 255, 255, 0.12);
}

.gm-dark .editor-holder :deep(.ce-toolbar__plus),
.gm-dark .editor-holder :deep(.ce-toolbar__settings-btn) {
	color: #9aa1b0;
}

.gm-dark .editor-holder :deep(.ce-toolbar__plus:hover),
.gm-dark .editor-holder :deep(.ce-toolbar__settings-btn:hover) {
	background: #2a2f3d;
}
</style>
