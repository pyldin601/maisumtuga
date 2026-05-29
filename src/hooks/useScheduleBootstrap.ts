import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';

import { firebaseAuth } from '../firebase.ts';
import { createLeitnerState, getStoredSchedule, syncUserSchedule } from '../services/scheduleSync.ts';
import type { LeitnerState } from '../state.ts';

type ScheduleBootstrapState = { status: 'loading' } | { leitnerState: LeitnerState; status: 'ready' };

export function useScheduleBootstrap(): ScheduleBootstrapState {
  const [bootstrapState, setBootstrapState] = useState<ScheduleBootstrapState>({ status: 'loading' });
  const authLoadIdRef = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      const authLoadId = authLoadIdRef.current + 1;
      authLoadIdRef.current = authLoadId;
      setBootstrapState({ status: 'loading' });

      if (!user) {
        const schedule = getStoredSchedule();
        setBootstrapState({ leitnerState: createLeitnerState(undefined, schedule), status: 'ready' });
        return;
      }

      void syncUserSchedule(user.uid)
        .then((schedule) => {
          if (authLoadIdRef.current !== authLoadId) {
            return;
          }

          setBootstrapState({ leitnerState: createLeitnerState(user.uid, schedule), status: 'ready' });
        })
        .catch(() => {
          if (authLoadIdRef.current !== authLoadId) {
            return;
          }

          const schedule = getStoredSchedule();
          setBootstrapState({ leitnerState: createLeitnerState(user.uid, schedule), status: 'ready' });
        });
    });

    return () => {
      authLoadIdRef.current += 1;
      unsubscribe();
    };
  }, []);

  return bootstrapState;
}
