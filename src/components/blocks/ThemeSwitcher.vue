<script setup lang="ts">
import { IconSun, IconMoon } from '@tabler/icons-vue';
import { useTheme } from '@/composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<template>
	<button @click="toggleTheme"
		class="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-emphasis text-color cursor-pointer"
		:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
		<IconMoon v-if="!isDark" :size="20" />
		<IconSun v-else :size="20" />
	</button>
</template>
