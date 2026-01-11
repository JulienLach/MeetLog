export interface Note {
    id_note: number;
    id_record: number;
    id_user: number;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Record {
    id_record: number;
    id_user: number;
    title: string;
    duration: number;
    file_uri: string;
    file_size: number;
    status: "pending" | "processing" | "completed" | "error";
    created_at: string;
    updated_at: string;
}

export interface MeetingNote {
    id: string;
    title: string;
    date: string;
    summary: string;
    duration: string;
}
