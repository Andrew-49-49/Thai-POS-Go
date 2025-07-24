'use server'

import { getSheetData as getSheetDataFromApi } from "./sheets";

export async function getSheetData(range: string) {
    return await getSheetDataFromApi(range);
}
