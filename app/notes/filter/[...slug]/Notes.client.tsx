"use client";

import {
  useCallback,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", page, search, tag ?? "all"],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDraft(value);
    updateSearch(value);
  };

  const handleOpenModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCreated = () => {
    setPage(1);
    setIsModalOpen(false);
  };

  const handleDeleted = () => {
    if (notes.length === 1 && page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={draft} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} type="button" onClick={handleOpenModal}>
          Create note +
        </button>
      </div>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDeleted={handleDeleted} />
      )}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}
      {isFetching && !isLoading && <p>Updating...</p>}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} onCreated={handleCreated} />
        </Modal>
      )}
    </div>
  );
}
