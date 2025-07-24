
import { google } from "googleapis";

// Ensure you have a .env.local file with these variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEETS_PRIVATE_KEY = process.env
  .GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");


if (!SPREADSHEET_ID || !GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
    console.warn("Google Sheets API credentials are not set in .env.local. Functionality will be limited.");
}


export const getSheets = () => {
    if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
        return null;
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
        client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: GOOGLE_SHEETS_PRIVATE_KEY,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}


export const getSheetData = async (range: string) => {
    const sheets = getSheets();
    if (!sheets) {
        console.error("Google Sheets API not initialized.");
        return [];
    }
    
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });
        return response.data.values;
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        return [];
    }
}

export const appendSheetData = async (range: string, values: any[][]) => {
    const sheets = getSheets();
    if (!sheets) {
        console.error("Google Sheets API not initialized.");
        return null;
    }

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: values,
            },
        });
        return response;
    } catch (error) {
        console.error("Error appending sheet data:", error);
        return null;
    }
};

export const updateSheetData = async (range: string, values: any[][]) => {
    const sheets = getSheets();
    if (!sheets) {
        console.error("Google Sheets API not initialized.");
        return null;
    }

    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: values,
            },
        });
        return response;
    } catch (error) {
        console.error("Error updating sheet data:", error);
        return null;
    }
}

export const clearSheetData = async (range: string) => {
    const sheets = getSheets();
    if (!sheets) {
        console.error("Google Sheets API not initialized.");
        return null;
    }

    try {
        const response = await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });
        return response;
    } catch (error) {
        console.error("Error clearing sheet data:", error);
        return null;
    }
};
