
'use client';

import { useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, persistenceInitialized } from '@/lib/firebase';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 dakika

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = useCallback(async (isInactive = false) => {
    try {
      await signOut(auth);
      if (isInactive) {
        toast({
            title: 'Oturum Sonlandırıldı',
            description: 'Güvenlik nedeniyle oturumunuz sonlandırıldı.',
            variant: 'destructive',
        });
      } else {
        toast({
            title: 'Başarılı',
            description: 'Güvenli bir şekilde çıkış yaptınız.',
        });
      }
      router.push('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      toast({
        title: 'Hata',
        description: 'Çıkış yapılırken bir sorun oluştu.',
        variant: 'destructive',
      });
    }
  }, [router, toast]);
  
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      handleSignOut(true);
    }, INACTIVITY_TIMEOUT);
  }, [handleSignOut]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    
    const eventListener = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    events.forEach(event => window.addEventListener(event, eventListener));
    
    // Set initial timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      events.forEach(event => window.removeEventListener(event, eventListener));
    };
  }, [resetInactivityTimer]);


  useEffect(() => {
    const checkAuth = async () => {
        // Wait for persistence to be set before subscribing to auth state changes.
        await persistenceInitialized;
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/login');
            }
            setLoading(false);
        });

        return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    checkAuth().then(unsub => {
        if (unsub) {
            unsubscribe = unsub;
        }
    });

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
}, [router]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Yönlendirme useEffect içinde yapılıyor
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors">
            Wafello Yönetim Paneli
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => handleSignOut(false)}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
