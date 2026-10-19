<script setup>
import Bell from '@primeicons/vue/bell';
import Cog from '@primeicons/vue/cog';
import Home from '@primeicons/vue/home';
import Inbox from '@primeicons/vue/inbox';
import Search from '@primeicons/vue/search';
import SidebarIcon from '@primeicons/vue/sidebar';
import Users from '@primeicons/vue/users';
import Sidebar from 'primevue/sidebar';
import SidebarBackdrop from 'primevue/sidebarbackdrop';
import SidebarAside from 'primevue/sidebaraside';
import SidebarContent from 'primevue/sidebarcontent';
import SidebarFooter from 'primevue/sidebarfooter';
import SidebarGroup from 'primevue/sidebargroup';
import SidebarGroupAction from 'primevue/sidebargroupaction';
import SidebarGroupContent from 'primevue/sidebargroupcontent';
import SidebarGroupLabel from 'primevue/sidebargrouplabel';
import SidebarHeader from 'primevue/sidebarheader';
import SidebarMain from 'primevue/sidebarmain';
import SidebarLayout from 'primevue/sidebarlayout';
import SidebarMenu from 'primevue/sidebarmenu';
import SidebarMenuAction from 'primevue/sidebarmenuaction';
import SidebarMenuBadge from 'primevue/sidebarmenubadge';
import SidebarMenuButton from 'primevue/sidebarmenubutton';
import SidebarMenuItem from 'primevue/sidebarmenuitem';
import SidebarMenuSub from 'primevue/sidebarmenusub';
import SidebarMenuSubButton from 'primevue/sidebarmenusubbutton';
import SidebarMenuSubItem from 'primevue/sidebarmenusubitem';
import SidebarPanel from 'primevue/sidebarpanel';
import SidebarRail from 'primevue/sidebarrail';
import SidebarSpacer from 'primevue/sidebarspacer';
import SidebarTrigger from 'primevue/sidebartrigger';
import Avatar from 'primevue/avatar';
import ThemeSwitcher from '@/components/blocks/ThemeSwitcher.vue';
import SidebarMenuItemBlock from '@/components/blocks/SidebarMenuItemBlock.vue';
import Check from '@primeicons/vue/check';
import Spinner from '@primeicons/vue/spinner';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useDashboard } from './composables/useDashboard';

const {
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
	pickExecutable,
	saveGame,
} = useDashboard();
</script>



<template>
	<div class="h-screen overflow-hidden">
		<SidebarLayout class="relative! h-full min-h-0!">
			<SidebarBackdrop v-if="isMobile && isOpen" class="absolute!" />
			<Sidebar id="mobile-nav" :collapsible="isMobile ? 'offcanvas' : 'icon'" :overlay="isMobile"
				v-model:open="isOpen" width="14rem">
				<SidebarSpacer />
				<SidebarAside>
					<SidebarPanel>
						<SidebarHeader>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton class="p-1!">
										<div
											class="flex size-6 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold leading-none">
											WP</div>
										<span class="font-semibold text-sm">WayPoint</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarHeader>

						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupLabel>Games</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItemBlock v-for="game in games" :key="game.id" :fileName="game.name"
											:gameId="game.id" :isActive="activeGameId === game.id" />
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>

						<SidebarFooter>
							<SidebarMenu>
								<SidebarMenuItem>
									<Button type="button" fluid @click="visible = true">
										<Check />
										Ajouter
									</Button>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarFooter>
					</SidebarPanel>
				</SidebarAside>
			</Sidebar>

			<SidebarMain class="h-full min-h-0 flex flex-col">
				<header class="flex h-12 items-center gap-2 border-b border-surface-200 dark:border-surface-700 px-4">
					<SidebarTrigger severity="secondary" target="mobile-nav" :text="true" size="small">
						<SidebarIcon />
					</SidebarTrigger>
					<span class="text-sm font-medium">{{activeGameId ? games.find(game => game.id ===
						activeGameId)?.name : 'Dashboard' }}</span>
					<div data-tauri-drag-region class="titlebar">
						<ThemeSwitcher />
						<div class="window-controls">
							<button @click="minimize">-</button>
							<button @click="maximize">∟</button>
							<button @click="close" class="close-btn">✕</button>
						</div>
					</div>
					<!-- <span
						class="ml-auto text-xs text-muted-color rounded-md bg-surface-100 dark:bg-surface-800 px-2 py-1">{{
							isMobile ? 'Mobile' : 'Desktop' }}</span> -->
				</header>
				<main class="min-h-0 flex-1 p-2 flex flex-row gap-2">
					<router-view />
				</main>
			</SidebarMain>
		</SidebarLayout>
		<Dialog v-model:visible="visible" modal header="Ajouter un jeu" :style="{ width: '24rem' }">
			<div class="flex flex-col gap-2">
				<Button severity="secondary" variant="outlined" @click="pickExecutable">Sélectionner un
					exécutable</Button>
				<p v-if="selectedExePath" class="text-sm text-muted-color break-all">{{ selectedExePath }}</p>
				<p v-if="error" class="text-sm text-red-400">{{ error }}</p>
			</div>
			<template #footer>
				<Button severity="secondary" variant="outlined" @click="visible = false">Annuler</Button>
				<Button :disabled="loading || !selectedExePath" @click="saveGame">
					<Spinner v-if="loading" class="animate-spin" />
					{{ loading ? 'Enregistrement...' : 'Enregistrer' }}
				</Button>
			</template>
		</Dialog>
	</div>
</template>

<style scoped>
.titlebar {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 100%;
	user-select: none;
}

.window-controls button {
	width: 40px;
	height: 32px;
	border: none;
	background: transparent;
	color: rgb(78, 66, 66);
	cursor: pointer;
}

.window-controls button:hover {
	background-color: rgba(255, 255, 255, 0.1);
}

.window-controls .close-btn:hover {
	background-color: #e64553;
}
</style>