import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { firebaseAuth, googleAuthProvider } from '../../firebase';

const authStateStorageKey = 'maisumtuga.auth.isSignedIn';

function readCachedIsSignedIn() {
  return window.localStorage.getItem(authStateStorageKey) === 'true';
}

function writeCachedIsSignedIn(isSignedIn: boolean) {
  window.localStorage.setItem(authStateStorageKey, String(isSignedIn));
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [cachedIsSignedIn, setCachedIsSignedIn] = useState(readCachedIsSignedIn);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      const nextIsSignedIn = Boolean(nextUser);

      setUser(nextUser);
      setCachedIsSignedIn(nextIsSignedIn);
      setIsAuthReady(true);
      writeCachedIsSignedIn(nextIsSignedIn);
    });
  }, []);

  const handleSignIn = async () => {
    setIsSubmitting(true);

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch {
      // The user can close the popup; keep the quiz flow unchanged.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);

    try {
      await signOut(firebaseAuth);
    } catch {
      // Auth state remains authoritative via onAuthStateChanged.
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignedIn = Boolean(user) || (!isAuthReady && cachedIsSignedIn);
  const isDisabled = isSubmitting;
  const label = isSubmitting ? (isSignedIn ? 'A sair...' : 'A entrar...') : isSignedIn ? 'Sair' : 'Entrar com Google';

  if (isSignedIn) {
    return (
      <button
        className="dock__button"
        type="button"
        onClick={handleSignOut}
        disabled={isDisabled}
        aria-label={label}
        title={label}
      >
        <svg className="dock__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 4h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
          <path d="M17 16l4-4-4-4" />
          <path d="M21 12H11" />
        </svg>
      </button>
    );
  }

  return (
    <button
      className="dock__button"
      type="button"
      onClick={handleSignIn}
      disabled={isDisabled}
      aria-label={label}
      title={label}
    >
      <svg className="dock__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
        <path d="M7 16l4-4-4-4" />
        <path d="M11 12H3" />
      </svg>
    </button>
  );
}
