export default function formatirajDatum(datum: string) : string {
const datumTekst = datum.split("-")
const mjesecTekst = datumTekst[1];
const danTekst = datumTekst[2];

const mjesec = parseInt(mjesecTekst);
const dan = parseInt(danTekst);

return dan + "." + mjesec + "."
}

export function ostatakBrojaNoci(datumDo: string) : number {
    const MS_U_DANU = 1000 * 60 * 60 * 24;

    const kraj = new Date(datumDo);
    const danas = new Date();

    const razlika = kraj.getTime() - danas.getTime()

    return Math.round(razlika / MS_U_DANU);
}

export function brojNociUkupno(datumOd: string, datumDo: string) : number {
    const MS_U_DANU = 1000 * 60 * 60 * 24;
    const pocetak = new Date(datumOd);
    const kraj = new Date (datumDo);

    const ukupnoBoravljenje = kraj.getTime() - pocetak.getTime()

    return Math.round(ukupnoBoravljenje / MS_U_DANU)
}