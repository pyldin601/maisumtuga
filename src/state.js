const PROGRESS_KEY = 'leitner-progress';

export function getKey(item) {
  return `${item.infinitiveForm}-${item.time}-${item.subjectShort}`;
}

export class LeitnerState {
  constructor(progress) {
    // key -> { box, due }
    this.progress = progress;
  }

  static fromStorage() {
    const progress = localStorage.getItem(PROGRESS_KEY);

    if (!progress) {
      return new LeitnerState({});
    }

    return new LeitnerState(JSON.parse(progress));
  }

  moveItemToNextBox(item) {
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

    this.progress[key] = { box: nextBox, due: nextDue.getTime() };
    this.save();
  }

  moveItemToFirstBox(item) {
    const key = getKey(item);
    const nextBox = 1;
    const nextDue = new Date();
    nextDue.setHours(0, 0, 0, 0);

    this.progress[key] = { box: nextBox, due: nextDue.getTime() };
    this.save();
  }

  isItemDue(item) {
    const key = getKey(item);
    const wordProgress = this.progress[key];

    if (!wordProgress) {
      return true;
    }

    const now = Date.now();

    return now >= wordProgress.due;
  }

  save() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.progress));
  }
}
