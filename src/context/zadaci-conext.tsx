import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { zadatakIzBaze } from "@/utils/mapiranje";
import { Zadatak } from "@/data/zadaci";

type ZadaciContextTip = {
  zadaci: Zadatak[];
  ucitavanje: boolean;
  dodajZadatak: (datum: string, tekst: string) => Promise<void>;
  prebaciGotov: (id: string) => Promise<void>;
  obrisiZadatak: (id: string) => Promise<void>;
};

const ZadaciContext = createContext<ZadaciContextTip | undefined>(undefined);

export function ZadaciProvider(props: { children: React.ReactNode }) {
  const [zadaci, postaviZadatke] = useState<Zadatak[]>([]);
  const [ucitavanje, postaviUcitavanje] = useState(true);
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

  async function dohvatiZadatke() {
    const { data, error } = await supabase.from("zadaci").select("*");

    if (error) {
      console.log("Greška pri dohvatu zadataka:", error.message);
      postaviUcitavanje(false);
      return;
    }

    postaviZadatke(data.map(zadatakIzBaze));
    postaviUcitavanje(false);
  }

  async function dodajZadatak(datum: string, tekst: string) {
    if (!objektId) return;

    const { data, error } = await supabase
      .from("zadaci")
      .insert({ objekt_id: objektId, datum: datum, tekst: tekst })
      .select()
      .single();

    if (error) {
      console.log("Greška pri dodavanju zadatka:", error.message);
      return;
    }

    postaviZadatke([...zadaci, zadatakIzBaze(data)]);
  }

  async function prebaciGotov(id: string) {
    const zadatak = zadaci.find(z => z.id === id);
    if (!zadatak) return;

    const novaVrijednost = !zadatak.gotov;

    const { error } = await supabase
      .from("zadaci")
      .update({ gotov: novaVrijednost })
      .eq("id", id);

    if (error) {
      console.log("Greška pri označavanju zadatka:", error.message);
      return;
    }

    postaviZadatke(
      zadaci.map(z => z.id === id ? { ...z, gotov: novaVrijednost } : z)
    );
  }

  async function obrisiZadatak(id: string) {
    const { error } = await supabase.from("zadaci").delete().eq("id", id);

    if (error) {
      console.log("Greška pri brisanju zadatka:", error.message);
      return;
    }

    postaviZadatke(zadaci.filter(z => z.id !== id));
  }

  useEffect(() => {
    dohvatiObjekt();
    dohvatiZadatke();
  }, []);

  return (
    <ZadaciContext.Provider
      value={{ zadaci, ucitavanje, dodajZadatak, prebaciGotov, obrisiZadatak }}
    >
      {props.children}
    </ZadaciContext.Provider>
  );
}

export function useZadatke() {
  const context = useContext(ZadaciContext);
  if (!context) {
    throw new Error("useZadatke se mora koristiti unutar ZadaciProvider");
  }
  return context;
}