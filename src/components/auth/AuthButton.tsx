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

  if (isSignedIn) {
    return (
      <button className="auth-button" type="button" onClick={handleSignOut} disabled={isDisabled}>
        {isSubmitting ? 'A sair...' : 'Sair'}
      </button>
    );
  }

  return (
    <button className="auth-button" type="button" onClick={handleSignIn} disabled={isDisabled}>
      {isSubmitting ? 'A entrar...' : 'Entrar com Google'}
    </button>
  );
}
