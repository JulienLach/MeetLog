export type EntityStatus = "pending" | "processing" | "completed" | "error";

export interface BaseEntity {
    created_at: Date;
    updated_at: Date;
}

export interface OllamaResponse {
    response: string;
}

export interface UserData extends BaseEntity {
    id_user: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface RecordData extends BaseEntity {
    id_record: number;
    id_user: number;
    title: string;
    duration: number;
    file_uri: string;
    file_size: number;
    status: EntityStatus;
    transcription?: string;
    error_message?: string;
}

export interface NoteData extends BaseEntity {
    id_note: number;
    id_record: number;
    id_user: number;
    content: string;
}
