<script setup lang="ts">
import SidebarMenuButton from 'primevue/sidebarmenubutton';
import SidebarMenuItem from 'primevue/sidebarmenuitem';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
	isActive?: boolean;
	fileName?: string;
	gameId?: number;
}>();

const navigate = () => {
	if (props.gameId !== undefined) {
		router.push({ name: 'game', params: { id: props.gameId } });
	}
};
</script>

<template>
	<SidebarMenuItem>
		<SidebarMenuButton :isActive="props.isActive" @click="navigate">
			<span>{{ props.fileName }}</span>
		</SidebarMenuButton>
	</SidebarMenuItem>
</template>

<style scoped></style>