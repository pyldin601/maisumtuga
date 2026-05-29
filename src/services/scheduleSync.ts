import { loadVerbReviewSchedule, patchVerbReviewScheduleItem, saveVerbReviewSchedule } from './verbReviewSchedule.ts';
import { LeitnerState, type Progress, type VerbReviewSchedule, type WordProgress } from '../state.ts';

export function getStoredSchedule(): VerbReviewSchedule {
  return LeitnerState.readFromStorage() ?? { items: {}, updatedAt: 0 };
}

function getHasStoredItems(schedule: VerbReviewSchedule): boolean {
  return Object.keys(schedule.items).length > 0;
}

function mergeProgressItem(firstItem: WordProgress, secondItem: WordProgress): WordProgress {
  if (firstItem.box !== secondItem.box) {
    return firstItem.box < secondItem.box ? firstItem : secondItem;
  }

  return firstItem.due <= secondItem.due ? firstItem : secondItem;
}

function mergeProgress(firstProgress: Progress, secondProgress: Progress): Progress {
  const mergedProgress: Progress = { ...firstProgress };

  Object.entries(secondProgress).forEach(([key, secondItem]) => {
    const firstItem = mergedProgress[key];

    mergedProgress[key] = firstItem ? mergeProgressItem(firstItem, secondItem) : secondItem;
  });

  return mergedProgress;
}

export function mergeSchedules(
  firstSchedule: VerbReviewSchedule,
  secondSchedule: VerbReviewSchedule
): VerbReviewSchedule {
  const items = mergeProgress(firstSchedule.items, secondSchedule.items);
  const hasItems = Object.keys(items).length > 0;

  return {
    items,
    updatedAt: hasItems ? Date.now() : Math.max(firstSchedule.updatedAt, secondSchedule.updatedAt),
  };
}

function saveScheduleToStorage(schedule: VerbReviewSchedule): void {
  LeitnerState.fromProgress(schedule.items, undefined, schedule.updatedAt).saveWithUpdatedAt(schedule.updatedAt);
}

export function createLeitnerState(userId: string | undefined, schedule: VerbReviewSchedule): LeitnerState {
  if (!userId) {
    return LeitnerState.fromProgress(schedule.items, undefined, schedule.updatedAt);
  }

  return LeitnerState.fromProgress(
    schedule.items,
    ({ key, updatedAt, value }) => {
      void patchVerbReviewScheduleItem(userId, key, updatedAt, value).catch(() => {
        // Keep local progress authoritative for the current session if remote sync fails.
      });
    },
    schedule.updatedAt
  );
}

export async function syncUserSchedule(userId: string): Promise<VerbReviewSchedule> {
  const localSchedule = getStoredSchedule();
  const legacySchedule = LeitnerState.readLegacyFromStorage();
  const localWithLegacy = legacySchedule ? mergeSchedules(localSchedule, legacySchedule) : localSchedule;
  const remoteSchedule = await loadVerbReviewSchedule(userId);
  const mergedSchedule = remoteSchedule ? mergeSchedules(localWithLegacy, remoteSchedule) : localWithLegacy;

  if (legacySchedule) {
    LeitnerState.removeLegacyFromStorage();
  }

  saveScheduleToStorage(mergedSchedule);

  if (getHasStoredItems(mergedSchedule) || remoteSchedule) {
    await saveVerbReviewSchedule(userId, mergedSchedule);
  }

  return mergedSchedule;
}
