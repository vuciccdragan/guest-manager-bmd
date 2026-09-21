export default function formatirajDatum(datum: string) : string {
const datumTekst = datum.split("-")
const mjesecTekst = datumTekst[1];
const danTekst = datumTekst[2];

const mjesec = parseInt(mjesecTekst);
const dan = parseInt(danTekst);

return dan + "." + mjesec + "."
}