import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type OdradenoContextTip = {
  kljucevi: string[];
  prebaciOdradeno: (kljuc: string) => Promise<void>;
};

const OdradenoContext = createContext<OdradenoContextTip | undefined>(undefined);

export function OdradenoProvider(props: { children: React.ReactNode }) {
  const [kljucevi, postaviKljuceve] = useState<string[]>([]);
  const [objektId, postaviObjektId] = useState<string | null>(null);

  async function dohvatiObjekt() {
    const { data, error } = await supabase
      .from("clanovi")
      .select("objekt_id")
      .single();

    if (error) {
      console.log("Greška pri dohvatu objekta:", error.message);
      return;
    }

    postaviObjektId(data.objekt_id);
  }

  async function dohvatiOdradeno() {
    const { data, error } = await supabase.from("odradeno").select("kljuc");

    if (error) {
      console.log("Greška pri dohvatu odrađenog:", error.message);
      return;
    }

    postaviKljuceve(data.map(r => r.kljuc));
  }

  async function prebaciOdradeno(kljuc: string) {
    if (!objektId) return;

    if (kljucevi.includes(kljuc)) {
      const { error } = await supabase.from("odradeno").delete().eq("kljuc", kljuc);

      if (error) {
        console.log("Greška pri skidanju kvačice:", error.message);
        return;
      }

      postaviKljuceve(kljucevi.filter(k => k !== kljuc));
    } else {
      const { error } = await supabase
        .from("odradeno")
        .insert({ objekt_id: objektId, kljuc: kljuc });

      if (error) {
        console.log("Greška pri označavanju:", error.message);
        return;
      }

      postaviKljuceve([...kljucevi, kljuc]);
    }
  }

  useEffect(() => {
    dohvatiObjekt();
    dohvatiOdradeno();
  }, []);

  return (
    <OdradenoContext.Provider value={{ kljucevi, prebaciOdradeno }}>
      {props.children}
    </OdradenoContext.Provider>
  );
}

export function useOdradeno() {
  const context = useContext(OdradenoContext);
  if (!context) {
    throw new Error("useOdradeno se mora koristiti unutar OdradenoProvider");
  }
  return context;
}