import EditorJS, { type OutputData } from '@editorjs/editorjs';
import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { getGameById, updateGameNotes, type Game } from '@/services/db';

export function useGame(editorHolder: Ref<HTMLDivElement | null>) {
	const route = useRoute();
	const game = ref<Game | null>(null);
	const loading = ref(true);
	const error = ref('');
	const notesError = ref('');
	const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle');

	let editor: EditorJS | null = null;
	let activeGameId: number | null = null;
	let saveTimer: number | undefined;
	let requestId = 0;
	let saveQueue: Promise<void> = Promise.resolve();

	function isOutputData(value: unknown): value is OutputData {
		if (typeof value !== 'object' || value === null || !('blocks' in value)) {
			return false;
		}
		return (
			Array.isArray(value.blocks) &&
			value.blocks.every(
				(block: unknown) =>
					typeof block === 'object' &&
					block !== null &&
					'type' in block &&
					typeof block.type === 'string' &&
					'data' in block &&
					typeof block.data === 'object' &&
					block.data !== null,
			)
		);
	}

	function parseNotes(notes: string): OutputData {
		const data: unknown = JSON.parse(notes);
		if (!isOutputData(data)) {
			throw new Error('Invalid saved Editor.js data');
		}
		return data;
	}

	function enqueueSave(instance: EditorJS, gameId: number): void {
		saveQueue = saveQueue
			.then(async () => {
				await instance.isReady;
				const data = await instance.save();
				await updateGameNotes(gameId, JSON.stringify(data));
				if (activeGameId === gameId) {
					saveStatus.value = 'saved';
					notesError.value = '';
				}
			})
			.catch(() => {
				if (activeGameId === gameId) {
					saveStatus.value = 'error';
					notesError.value = 'Impossible d’enregistrer les notes.';
				}
			});
	}

	function scheduleSave(gameId: number): void {
		if (saveTimer !== undefined) {
			window.clearTimeout(saveTimer);
		}
		saveStatus.value = 'saving';
		saveTimer = window.setTimeout(() => {
			saveTimer = undefined;
			if (editor && activeGameId === gameId) {
				enqueueSave(editor, gameId);
			}
		}, 600);
	}

	async function destroyEditor(): Promise<void> {
		if (saveTimer !== undefined) {
			window.clearTimeout(saveTimer);
			saveTimer = undefined;
		}
		const currentEditor = editor;
		const gameId = activeGameId;
		editor = null;
		activeGameId = null;
		if (!currentEditor) return;

		if (gameId !== null) {
			enqueueSave(currentEditor, gameId);
			await saveQueue;
		}
		currentEditor.destroy();
	}

	async function loadGame(id: number, currentRequest: number): Promise<void> {
		loading.value = true;
		error.value = '';
		notesError.value = '';
		saveStatus.value = 'idle';
		game.value = null;
		await destroyEditor();
		if (currentRequest !== requestId) return;

		try {
			const loadedGame = await getGameById(id);
			if (currentRequest !== requestId) return;
			if (!loadedGame) {
				error.value = 'Jeu introuvable.';
				return;
			}

			game.value = loadedGame;
			loading.value = false;
			await nextTick();
			if (currentRequest !== requestId || !editorHolder.value) return;

			const instance = new EditorJS({
				holder: editorHolder.value,
				data: parseNotes(loadedGame.notes),
				onChange: () => scheduleSave(loadedGame.id),
			});
			editor = instance;
			activeGameId = loadedGame.id;
			await instance.isReady;
			if (currentRequest === requestId) {
				saveStatus.value = 'saved';
			}
		} catch {
			if (currentRequest === requestId) {
				error.value = 'Impossible de charger le jeu.';
			}
		} finally {
			if (currentRequest === requestId) {
				loading.value = false;
			}
		}
	}

	watch(
		() => route.params.id,
		(id) => {
			const currentRequest = ++requestId;
			const gameId = Number(id);
			if (!Number.isInteger(gameId) || gameId < 1) {
				loading.value = false;
				game.value = null;
				error.value = 'Jeu introuvable.';
				void destroyEditor();
				return;
			}
			void loadGame(gameId, currentRequest);
		},
		{ immediate: true },
	);

	onBeforeUnmount(() => {
		void destroyEditor();
	});

	return { game, loading, error, notesError, saveStatus };
}
