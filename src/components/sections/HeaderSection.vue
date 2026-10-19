<script setup lang="ts">
import ThemeSwitcher from '../blocks/ThemeSwitcher.vue';
import Button from 'primevue/button';

</script>

<template>
	<div class="header-section">
		<div class="flex items-center justify-start w-full gap-2">
			<!-- <h1 class="text-lg font-bold text-color">Group Manager</h1> -->
		</div>
		<div class="p-2 flex items-center justify-end w-full gap-2">
			<ThemeSwitcher />
			<!-- <Button icon="pi pi-download" label="Importer" />
			<Button icon="pi pi-upload" label="Exporter" />
			<Button icon="pi pi-plus" label="Ajouter un groupe" />
			<Button icon="pi pi-cog" variant="text" /> -->
		</div>
	</div>
</template>

<style scoped></style>