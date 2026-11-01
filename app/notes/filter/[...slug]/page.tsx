import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import { isNoteTag, type NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const filter = slug[0];

  if (
    !filter ||
    slug.length !== 1 ||
    (filter !== "all" && !isNoteTag(filter))
  ) {
    notFound();
  }

  const tag: NoteTag | undefined = filter === "all" ? undefined : filter;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? "all"],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={filter} tag={tag} />
    </HydrationBoundary>
  );
}
