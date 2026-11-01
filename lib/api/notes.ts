import type { NewNote, Note, NoteTag } from "@/types/note";
import { notehub } from "./client";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await notehub.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await notehub.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await notehub.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await notehub.delete<Note>(`/notes/${id}`);
  return response.data;
};
