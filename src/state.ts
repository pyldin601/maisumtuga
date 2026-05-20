const legacyProgressKey = 'leitner-progress';
const verbReviewSchedulesKey = 'verbReviewSchedules';

type QuizItem = {
  infinitiveForm: string;
  subjectShort: string;
  time: {
    shortName: string;
  };
};

export type WordProgress = {
  box: number;
  due: number;
};

export type Progress = Record<string, WordProgress>;

export type VerbReviewSchedule = {
  items: Progress;
  updatedAt: number;
};

type ProgressPatch = {
  key: string;
  updatedAt: number;
  value: WordProgress | null;
};

type SyncProgressPatch = (patch: ProgressPatch) => void;

function parseVerbReviewSchedule(value: string | null): VerbReviewSchedule | null {
  if (!value) {
    return null;
  }

  const parsedValue = JSON.parse(value) as Progress | Partial<VerbReviewSchedule>;

  if (!parsedValue || typeof parsedValue !== 'object') {
    return null;
  }

  if ('items' in parsedValue) {
    const schedule = parsedValue as Partial<VerbReviewSchedule>;

    return {
      items: schedule.items ?? {},
      updatedAt: schedule.updatedAt ?? 0,
    };
  }

  return {
    items: parsedValue as Progress,
    updatedAt: 0,
  };
}

export function getKey(item: QuizItem): string {
  return `${item.infinitiveForm}-${item.time.shortName}-${item.subjectShort}`;
}

export class LeitnerState {
  progress: Progress;
  updatedAt: number;
  private readonly syncProgressPatch?: SyncProgressPatch;

  constructor(progress: Progress, syncProgressPatch?: SyncProgressPatch, updatedAt = Date.now()) {
    // key -> { box, due }
    this.progress = progress;
    this.updatedAt = updatedAt;
    this.syncProgressPatch = syncProgressPatch;
  }

  static fromStorage(syncProgressPatch?: SyncProgressPatch): LeitnerState {
    const schedule = LeitnerState.readFromStorage();

    if (!schedule) {
      return new LeitnerState({}, syncProgressPatch);
    }

    return new LeitnerState(schedule.items, syncProgressPatch, schedule.updatedAt);
  }

  static readFromStorage(): VerbReviewSchedule | null {
    return parseVerbReviewSchedule(localStorage.getItem(verbReviewSchedulesKey));
  }

  static readLegacyFromStorage(): VerbReviewSchedule | null {
    return parseVerbReviewSchedule(localStorage.getItem(legacyProgressKey));
  }

  static removeLegacyFromStorage(): void {
    localStorage.removeItem(legacyProgressKey);
  }

  static fromProgress(progress: Progress, syncProgressPatch?: SyncProgressPatch, updatedAt = Date.now()): LeitnerState {
    return new LeitnerState(progress, syncProgressPatch, updatedAt);
  }

  moveItemToNextBox(item: QuizItem): void {
    const key = getKey(item);
    const wordProgress = this.progress[key];

    const currentBox = wordProgress?.box ?? 1;
    const nextBox = Math.min(currentBox + 1, 5);

    const nextDue = new Date();
    nextDue.setHours(0, 0, 0, 0);

    switch (nextBox) {
      case 2:
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case 3:
        nextDue.setDate(nextDue.getDate() + 3);
        break;
      case 4:
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case 5:
        nextDue.setDate(nextDue.getDate() + 14);
        break;
      default:
    }

    const nextProgress = { box: nextBox, due: nextDue.getTime() };

    this.progress[key] = nextProgress;
    this.save();
    this.syncProgressPatch?.({ key, updatedAt: this.updatedAt, value: nextProgress });
  }

  moveItemToFirstBox(item: QuizItem): void {
    const key = getKey(item);

    // it hits the first box by default
    delete this.progress[key];

    this.save();
    this.syncProgressPatch?.({ key, updatedAt: this.updatedAt, value: null });
  }

  isItemDue(item: QuizItem): boolean {
    const key = getKey(item);
    const wordProgress = this.progress[key];

    if (!wordProgress) {
      return true;
    }

    const now = Date.now();

    return now >= wordProgress.due;
  }

  save(): void {
    this.updatedAt = Date.now();
    this.saveWithUpdatedAt(this.updatedAt);
  }

  saveWithUpdatedAt(updatedAt: number): void {
    this.updatedAt = updatedAt;
    localStorage.setItem(
      verbReviewSchedulesKey,
      JSON.stringify({
        items: this.progress,
        updatedAt: this.updatedAt,
      })
    );
  }
}
