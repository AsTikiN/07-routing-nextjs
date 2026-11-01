"use client";

import { useEffect, useState } from "react";
import ReactPaginateOriginal from "react-paginate";
import css from "./Pagination.module.css";

const ReactPaginate =
  (
    ReactPaginateOriginal as unknown as {
      default?: typeof ReactPaginateOriginal;
    }
  ).default ?? ReactPaginateOriginal;

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };

  if (!isReady) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={handlePageChange}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
