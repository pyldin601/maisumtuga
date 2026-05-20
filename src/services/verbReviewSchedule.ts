import { deleteField, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../firebase';
import type { Progress, VerbReviewSchedule, WordProgress } from '../state';

const verbReviewSchedulesCollection = 'verbReviewSchedules';

type VerbReviewScheduleDocument = {
  items?: Progress;
  updatedAt?: number;
};

function getVerbReviewScheduleRef(userId: string) {
  return doc(firebaseDb, verbReviewSchedulesCollection, userId);
}

export async function loadVerbReviewSchedule(userId: string): Promise<VerbReviewSchedule | null> {
  const snapshot = await getDoc(getVerbReviewScheduleRef(userId));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as VerbReviewScheduleDocument;

  return {
    items: data.items ?? {},
    updatedAt: data.updatedAt ?? 0,
  };
}

export async function saveVerbReviewSchedule(userId: string, schedule: VerbReviewSchedule): Promise<void> {
  await setDoc(getVerbReviewScheduleRef(userId), schedule);
}

export async function patchVerbReviewScheduleItem(
  userId: string,
  key: string,
  updatedAt: number,
  value: WordProgress | null
): Promise<void> {
  await setDoc(
    getVerbReviewScheduleRef(userId),
    {
      items: {
        [key]: value ?? deleteField(),
      },
      updatedAt,
    },
    { merge: true }
  );
}
