'use server'

import { getSheetData as getSheetDataFromApi, appendSheetData as appendSheetDataToApi, updateSheetData as updateSheetDataInApi, clearSheetData as clearSheetDataInApi } from "./sheets";

export async function getSheetData(range: string) {
    return await getSheetDataFromApi(range);
}

export async function appendSheetData(range: string, values: any[][]) {
    return await appendSheetDataToApi(range, values);
}

export async function updateSheetData(range: string, values: any[][]) {
    return await updateSheetDataInApi(range, values);
}

export async function clearSheetData(range: string) {
    return await clearSheetDataInApi(range);
}
