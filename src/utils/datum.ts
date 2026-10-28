const daniUTjednu = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"]

export function formatirajDatumGodina(datum: string): string {
  const dijelovi = datum.split("-");
  const dan = parseInt(dijelovi[2]);
  const mjesec = parseInt(dijelovi[1]);
  const godina = dijelovi[0];
  return dan + "." + mjesec + "." + godina + ".";
}

export function nazoviDane(datum: string): string {
  const nekiDatum = new Date(datum)
  const brojDana = nekiDatum.getDay();

  return daniUTjednu[brojDana];
}

export function ostatakBrojaNoci(datumDo: string): number {
  const MS_U_DANU = 1000 * 60 * 60 * 24;

  const kraj = new Date(datumDo);
  const danas = new Date();

  const razlika = kraj.getTime() - danas.getTime()

  return Math.round(razlika / MS_U_DANU);
}

export function brojNociUkupno(datumOd: string, datumDo: string): number {
  const MS_U_DANU = 1000 * 60 * 60 * 24;
  const pocetak = new Date(datumOd);
  const kraj = new Date(datumDo);

  const ukupnoBoravljenje = kraj.getTime() - pocetak.getTime()

  return Math.round(ukupnoBoravljenje / MS_U_DANU)
}

export function pomakniDatum(datum: string, brojDana: number): string {
  const MS_U_DANU = 1000 * 60 * 60 * 24;

  const pocetni = new Date(datum);
  const novoVrijeme = pocetni.getTime() + brojDana * MS_U_DANU;
  const novi = new Date(novoVrijeme);

  return novi.toISOString().split("T")[0];
}

export function generirajServise(
  odDatum: string,
  doDatum: string,
  razmak: number
): string[] {
  const datumi: string[] = [];

  if (razmak <= 0) {
    return datumi;
  }

  let trenutni = pomakniDatum(odDatum, razmak);

  while (trenutni < doDatum) {
    datumi.push(trenutni);
    trenutni = pomakniDatum(trenutni, razmak);
  }

  return datumi;
}