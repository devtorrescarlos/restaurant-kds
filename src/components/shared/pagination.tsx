import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        className="cursor-pointer"
        aria-label="Página anterior"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="cursor-pointer"
        aria-label="Página siguiente"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
