import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextTip = {
  sesija: Session | null;
  ucitavanje: boolean;
  odjaviSe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextTip | undefined>(undefined);

export function AuthProvider(props: { children: React.ReactNode }) {
  const [sesija, postaviSesiju] = useState<Session | null>(null);
  const [ucitavanje, postaviUcitavanje] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      postaviSesiju(data.session);
      postaviUcitavanje(false);
    });

    const { data: pretplata } = supabase.auth.onAuthStateChange(
      (dogadaj, novaSesija) => {
        postaviSesiju(novaSesija);
      }
    );

    return () => {
      pretplata.subscription.unsubscribe();
    };
  }, []);

  async function odjaviSe() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ sesija, ucitavanje, odjaviSe }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth se mora koristiti unutar AuthProvider");
  }
  return context;
}