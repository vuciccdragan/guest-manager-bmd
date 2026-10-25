import { createContext, useContext, useState, useEffect } from "react";
import { Gost } from "../data/gosti";
import { supabase } from "@/lib/supabase";
import { izBaze, uBazu } from "@/utils/mapiranje";
import { usePostavke } from "./postavke-context";
import { generirajServise } from "@/utils/datum";

type GostiContextTip = {
  gosti: Gost[];
  dodajGosta: (noviGost: Gost) => void;
  obrisiGosta: (id: string) => void;
  urediGosta: (izmijenjeniGost: Gost) => void;
  ucitavanje: boolean;
};

const GostiContext = createContext<GostiContextTip | undefined>(undefined);

export function GostiProvider(props: { children: React.ReactNode }) {
  const [ucitavanje, postaviUcitavanje] = useState(true);
  const [gosti, postaviGoste] = useState<Gost[]>([]);
  const [objektId, postaviObjektId] = useState<string | null>(null);
  const { postavke } = usePostavke();

  function razmakZaTip(tip: string): number {
    if (!postavke) return 0;
    if (tip === "booking") return postavke.servisBooking;
    if (tip === "direkt") return postavke.servisDirekt;
    return postavke.servisPrijatelji;
  }

  async function postaviServise(gost: Gost) {
    if (!objektId) return;

    const { data: postojeci } = await supabase
      .from("servisi")
      .select("*")
      .eq("gost_id", gost.id);

    await supabase
      .from("servisi")
      .delete()
      .eq("gost_id", gost.id)
      .eq("rucno", false);

    const rucniDatumi = (postojeci ?? [])
      .filter(s => s.rucno)
      .map(s => s.datum);

    const razmak = razmakZaTip(gost.tipGosta);
    const noviDatumi = generirajServise(gost.odDatum, gost.doDatum, razmak)
      .filter(d => !rucniDatumi.includes(d));

    if (noviDatumi.length > 0) {
      const redovi = noviDatumi.map(datum => ({
        gost_id: gost.id,
        objekt_id: objektId,
        datum: datum,
      }));

      const { error } = await supabase.from("servisi").insert(redovi);
      if (error) {
        console.log("Greška pri spremanju servisa:", error.message);
      }
    }
  }

  async function dodajGosta(noviGost: Gost) {
    if (!objektId) return;

    const { data, error } = await supabase
      .from("gosti")
      .insert(uBazu(noviGost, objektId))
      .select()
      .single();

    if (error) {
      console.log("Greška pri dodavanju:", error.message);
      return;
    }

    const spremljeniGost = izBaze(data);
    postaviGoste([...gosti, spremljeniGost]);

    await postaviServise(spremljeniGost);
  }

  async function urediGosta(izmijenjeniGost: Gost) {
    if (!objektId) return;

    const { error } = await supabase
      .from("gosti")
      .update(uBazu(izmijenjeniGost, objektId))
      .eq("id", izmijenjeniGost.id);

    if (error) {
      console.log("Greška pri uređivanju:", error.message);
      return;
    }

    postaviGoste(gosti.map(g => g.id === izmijenjeniGost.id ? izmijenjeniGost : g));

    await postaviServise(izmijenjeniGost);
  }

  async function obrisiGosta(id: string) {
    if (!objektId) return;

    const { error } = await supabase.from("gosti").delete().eq("id", id);

    if (error) {
      console.log("Greška pri brisanju:", error.message);
      return;
    }

    postaviGoste(gosti.filter(g => g.id !== id));
  }

  async function dohvatiGoste() {
    const { data, error } = await supabase.from("gosti").select("*");

    if (error) {
      console.log("Greška pri dohvatu:", error.message);
      postaviUcitavanje(false);
      return;
    }

    postaviGoste(data.map(izBaze));
    postaviUcitavanje(false);
  }

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

  useEffect(() => {
    dohvatiObjekt();
    dohvatiGoste();
  }, []);

  return (
    <GostiContext.Provider
      value={{ gosti, ucitavanje, dodajGosta, obrisiGosta, urediGosta }}
    >
      {props.children}
    </GostiContext.Provider>
  );
}

export function useGosti() {
  const context = useContext(GostiContext);
  if (!context) {
    throw new Error("useGosti se mora koristiti unutar GostiProvider");
  }
  return context;
}