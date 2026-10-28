import { createContext, useContext, useEffect, useState } from "react";
import { Servis } from "@/data/servisi";
import { supabase } from "@/lib/supabase";
import { servisIzBaze } from "@/utils/mapiranje";
import { useAuth } from "./auth-context";

type ServisiContextTip = {
  servisi: Servis[];
  ucitavanje: boolean;
  pomakniServis: (id: string, noviDatum: string) => Promise<void>;
  ukloniServis: (id: string) => Promise<void>;
  vratiServis: (id: string) => Promise<void>;
  osvjeziServise: () => Promise<void>;
};

const ServisiContext = createContext<ServisiContextTip | undefined>(undefined);

export function ServisiProvider(props: { children: React.ReactNode }) {
  const [servisi, postaviServise] = useState<Servis[]>([]);
  const [ucitavanje, postaviUcitavanje] = useState(true);

  async function osvjeziServise() {
    const { data, error } = await supabase.from("servisi").select("*");

    if (error) {
      console.log("Greška pri dohvatu servisa:", error.message);
      postaviUcitavanje(false);
      return;
    }

    postaviServise(data.map(servisIzBaze));
    postaviUcitavanje(false);
  }

  async function pomakniServis(id: string, noviDatum: string) {
    const { error } = await supabase
      .from("servisi")
      .update({ datum: noviDatum, rucno: true })
      .eq("id", id);

    if (error) {
      console.log("Greška pri pomicanju servisa:", error.message);
      return;
    }

    postaviServise(
      servisi.map(s => s.id === id ? { ...s, datum: noviDatum, rucno: true } : s)
    );
  }

  async function ukloniServis(id: string) {
    const { error } = await supabase
      .from("servisi")
      .update({ uklonjen: true, rucno: true })
      .eq("id", id);

    if (error) {
      console.log("Greška pri uklanjanju servisa:", error.message);
      return;
    }

    postaviServise(
      servisi.map(s => s.id === id ? { ...s, uklonjen: true, rucno: true } : s)
    );
  }

  async function vratiServis(id: string) {
    const { error } = await supabase
      .from("servisi")
      .update({ uklonjen: false })
      .eq("id", id);

    if (error) {
      console.log("Greška pri vraćanju servisa:", error.message);
      return;
    }

    postaviServise(
      servisi.map(s => s.id === id ? { ...s, uklonjen: false } : s)
    );
  }

  const { sesija } = useAuth();

  useEffect(() => {
    if(!sesija) {
      postaviServise([]);
      postaviUcitavanje(false);
    }
    osvjeziServise();
  }, []);

  return (
    <ServisiContext.Provider
      value={{ servisi, ucitavanje, pomakniServis, ukloniServis, vratiServis, osvjeziServise }}
    >
      {props.children}
    </ServisiContext.Provider>
  );
}

export function useServisi() {
  const context = useContext(ServisiContext);
  if (!context) {
    throw new Error("useServisi se mora koristiti unutar ServisiProvider");
  }
  return context;
}