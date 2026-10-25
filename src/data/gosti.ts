export type Gost = {
    id: string,
    ime: string,
    apartman: string,
    odDatum: string,
    doDatum: string,
    tipGosta: "booking" | "direkt" | "prijatelji",
    odrasli: number,
    djeca: number
};

export const bojaZaTipGosta = {
    booking: "#BCFFCB",
    direkt: "#B1D8FD",
    prijatelji: "#FFF9BC"
}