"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues, type FieldValues, type Resolver, type UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import type { ZodType } from "zod";
import { useAdminQuery } from "@/components/admin/search";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useConfirm } from "@/components/ui/confirm";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/misc";

type Column<T> = { header: string; cell: (item: T) => React.ReactNode };

export function CrudPage<TForm extends FieldValues, TItem extends { id: string }>({
  title,
  intro,
  notice,
  items,
  schema,
  columns,
  searchText,
  filters,
  emptyTitle,
  emptyBody,
  noun,
  detail,
  toForm,
  toItem,
  onSave,
  onDelete,
  children,
}: {
  title: string;
  intro: string;
  notice?: React.ReactNode;
  items: TItem[];
  schema: ZodType<TForm>;
  columns: Column<TItem>[];
  searchText: (item: TItem) => string;
  filters?: { id: string; label: string; test: (item: TItem) => boolean }[];
  emptyTitle: string;
  emptyBody: string;
  noun: string;
  detail: (item: TItem) => { label: string; value: React.ReactNode }[];
  toForm: (item: TItem | null) => TForm;
  toItem: (values: TForm, existing: TItem | null, all: TItem[]) => TItem;
  onSave: (item: TItem) => Promise<void>;
  onDelete: (item: TItem) => Promise<void>;
  children: (form: UseFormReturn<TForm>) => React.ReactNode;
}) {
  const params = useSearchParams();
  const { query } = useAdminQuery();
  const confirm = useConfirm();
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [current, setCurrent] = useState<TItem | null>(null);
  const [mode, setMode] = useState<"closed" | "view" | "edit">("closed");
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    if (params.get("create") === "1") {
      opened.current = true;
      setCurrent(null);
      setMode("edit");
    }
  }, [params]);

  const needle = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    if (filter !== "all" && !filters?.find((entry) => entry.id === filter)?.test(item)) return false;
    if (!needle) return true;
    return searchText(item).toLowerCase().includes(needle);
  });

  const remove = async (item: TItem) => {
    const ok = await confirm({
      title: `Delete this ${noun}?`,
      body: "This removes it from the catalog stored in this browser. Export a backup first if you may need it.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await onDelete(item);
      toast.success("Deleted.");
      setMode("closed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase leading-none">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{intro}</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setCurrent(null);
            setMode("edit");
          }}
        >
          Add {noun}
        </Button>
      </div>
      {notice}
      {filters && filters.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterButton>
          {filters.map((entry) => (
            <FilterButton key={entry.id} active={filter === entry.id} onClick={() => setFilter(entry.id)}>
              {entry.label}
            </FilterButton>
          ))}
        </div>
      ) : null}
      {query ? <p className="mb-3 text-xs text-muted">Showing matches for “{query}”.</p> : null}
      {visible.length === 0 ? (
        <EmptyState title={emptyTitle} body={emptyBody} />
      ) : (
        <>
          <div className="hidden overflow-x-auto border border-line md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-studio-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  {columns.map((column) => (
                    <th key={column.header} className="px-3 py-3 font-normal">
                      {column.header}
                    </th>
                  ))}
                  <th className="px-3 py-3 font-normal">Open</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    {columns.map((column) => (
                      <td key={column.header} className="px-3 py-3 align-top">
                        {column.cell(item)}
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <button type="button" className="text-accent" onClick={() => { setCurrent(item); setMode("view"); }}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3 md:hidden">
            {visible.map((item) => (
              <li key={item.id}>
                <button type="button" className="w-full border border-line bg-card p-4 text-left" onClick={() => { setCurrent(item); setMode("view"); }}>
                  {columns.map((column) => (
                    <div key={column.header} className="mt-2 first:mt-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{column.header}</p>
                      <div className="text-sm">{column.cell(item)}</div>
                    </div>
                  ))}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <Dialog open={mode === "view" && Boolean(current)} title={noun} onClose={() => setMode("closed")}>
        {current ? (
          <div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {detail(current).map((row) => (
                <div key={row.label} className="border-t border-line pt-3">
                  <dt className="label">{row.label}</dt>
                  <dd className="text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="button" onClick={() => setMode("edit")}>
                Edit
              </Button>
              <Button type="button" variant="danger" onClick={() => void remove(current)}>
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
      {mode === "edit" ? (
        <Editor
          key={current?.id ?? "new"}
          title={current ? `Edit ${noun}` : `New ${noun}`}
          schema={schema}
          defaults={toForm(current)}
          onClose={() => setMode("closed")}
          onSubmit={async (values) => {
            const next = toItem(values, current, items);
            await onSave(next);
            toast.success("Saved.");
          }}
        >
          {children}
        </Editor>
      ) : null}
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} className={`border px-3 py-2 text-xs uppercase tracking-wider ${active ? "border-accent text-accent" : "border-line text-muted"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Editor<TForm extends FieldValues>({
  title,
  schema,
  defaults,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  schema: ZodType<TForm>;
  defaults: TForm;
  onClose: () => void;
  onSubmit: (values: TForm) => Promise<void>;
  children: (form: UseFormReturn<TForm>) => React.ReactNode;
}) {
  const toast = useToast();
  const form = useForm<TForm, unknown, TForm>({
    resolver: zodResolver(schema) as Resolver<TForm, unknown, TForm>,
    defaultValues: defaults as DefaultValues<TForm>,
  });

  return (
    <Dialog open title={title} onClose={onClose}>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await onSubmit(values as TForm);
            onClose();
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Save failed.");
          }
        })}
      >
        {children(form as UseFormReturn<TForm>)}
        <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
