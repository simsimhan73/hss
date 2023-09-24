import { NextResponse } from "next/server";

let session : {id : string, room : Room}[];

export async function GET(request : Request, { params } : {params: {id : string}}) {
    const id = params.id;
    session.find((elem) => elem.id == id ? true : false)
}

interface Room {
    people : [URL],
    population: number
}
