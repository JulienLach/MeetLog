import { Record } from "../models/Record.js";

export async function getAllRecords() {
    return await Record.getAllRecords();
}

export async function getRecordById(id: number) {
    return await Record.getRecordById(id);
}

export async function getRecordsByUserId(userId: number) {
    return await Record.getRecordsByUserId(userId);
}

export async function getRecordsByStatus(status: string) {
    return await Record.getRecordsByStatus(status);
}

export async function createRecord(
    userId: number,
    title: string,
    duration: number,
    fileUri: string,
    fileSize: number
) {
    return await Record.createRecord(userId, title, duration, fileUri, fileSize);
}

export async function updateRecord(id: number, title: string, duration: number) {
    return await Record.updateRecord(id, title, duration);
}

export async function updateRecordStatus(id: number, status: string) {
    return await Record.updateRecordStatus(id, status);
}

export async function deleteRecord(id: number) {
    return await Record.deleteRecord(id);
}
