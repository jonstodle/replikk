import { get, writable } from 'svelte/store';

interface State {
	title: string;
	records: Record<string, string>;
}

const backingStore = writable<State>({ title: 'text', records: { fieldOne: 'one' } });
const pathContainsValueError = new Error('PathContainsValueError');
const pathDoesNotExistError = new Error('PathDoesNotExist');

export const documentStore = {
	set(path: string, value: string) {
		backingStore.update((store) => {
			const segments = path.split('.');
			let currentPath = '';
			for (let i = 0; i < segments.length; i++) {
				if (i + 1 == segments.length) break;
				currentPath += segments[i];
				if (this.get(currentPath)) throw pathContainsValueError;
			}

			store.records[path] = value;
			return store;
		});
	},
	get(path: string) {
		return get(backingStore).records[path];
	},
	remove(path: string) {
		if (this.get(path))
			backingStore.update((store) => {
				delete store.records[path];
				return store;
			});
	},
	rename(oldPath: string, newPath: string) {
		const value = this.get(oldPath);
		if (!value) throw pathDoesNotExistError;

		backingStore.update((store) => {
			store.records[newPath] = value;
			delete store.records[oldPath];
			return store;
		});
	},
	async load(content: File) {
		backingStore.set({
			title: content.name,
			records: JSON.parse(await content.text())
		});
	},
	save() {
		const store = get(backingStore);

		const blob = new Blob([JSON.stringify(store.records, null, 2)]);

		const element = document.createElement('a');
		const blobUrl = window.URL.createObjectURL(blob);
		element.style.display = 'none';
		element.href = blobUrl;
		element.download = !store.title.endsWith('.json') ? `${store.title}.json` : store.title;

		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);

		window.URL.revokeObjectURL(blobUrl);
	},
	subscribe: backingStore.subscribe
};
