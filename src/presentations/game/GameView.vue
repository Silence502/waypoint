<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getGameById, type Game } from '@/services/db';
import Skeleton from 'primevue/skeleton';

const route = useRoute();
const game = ref<Game | null>(null);
const loading = ref(true);
const error = ref('');

async function loadGame(id: number) {
	loading.value = true;
	error.value = '';
	try {
		game.value = await getGameById(id);
	} catch (e) {
		error.value = "Impossible de charger le jeu.";
	} finally {
		loading.value = false;
	}
}

watch(
	() => route.params.id,
	(id) => loadGame(Number(id)),
	{ immediate: true },
);
</script>

<template>
	<Skeleton v-if="loading" />
	<p v-else-if="error" class="text-sm text-red-400">{{ error }}</p>
	<section v-else-if="game" class="rounded-lg bg-surface-100 dark:bg-surface-800 flex-1"></section>
	<section class="flex flex-col gap-2 max-w-[356px] flex-2">
		<div class="rounded-lg bg-surface-100 dark:bg-surface-800 flex-1"></div>
		<div class="rounded-lg bg-surface-100 dark:bg-surface-800 flex-1"></div>
	</section>
</template>

<style scoped></style>
