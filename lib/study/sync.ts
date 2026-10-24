import type { State } from './core';
export type SyncMeta = {
    revision: number | null;
    pending: boolean;
};
export function selectInitialState(local: State | null, meta: SyncMeta | null, cloud: State | null, revision: number) {
    if (local && meta?.pending) {
        const base = meta.revision === null && revision === 0 ? 0 : meta.revision;
        const conflict = base !== revision;
        return { state: local, conflict, pending: true, revision: base };
    }
    return { state: cloud ?? local, conflict: false, pending: !cloud && !!local, revision };
}
