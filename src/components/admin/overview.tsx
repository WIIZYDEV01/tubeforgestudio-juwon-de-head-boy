"use client";

import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useContent } from "@/hooks/content-provider";
import { formatWhen } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { useAdminQuery } from "@/components/admin/search";

export function Overview() {
  const { ready, projects, inquiries, services, activity, statistics } = useContent();
  const { query } = useAdminQuery();
  if (!ready) return <p className="text-sm text-muted">Loading catalog…</p>;
  const needle = query.trim().toLowerCase();
  const recentInquiries = [...inquiries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((item) => !needle || `${item.fullName} ${item.email} ${item.service} ${item.businessName}`.toLowerCase().includes(needle))
    .slice(0, 5);
  const recentActivity = activity.filter((item) => !needle || item.message.toLowerCase().includes(needle)).slice(0, 8);
  const categories = [...new Set(projects.map((project) => project.category))].map((name) => ({
    name,
    count: projects.filter((project) => project.category === name).length,
  }));
  const statuses = ["new", "reviewed", "archived"].map((name) => ({
    name,
    count: inquiries.filter((item) => item.status === name).length,
  }));
  const maxCategory = Math.max(1, ...categories.map((item) => item.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase leading-none">Overview</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Counts come from the catalog in this browser. Charts do not invent revenue or views. Sample statistics stay labelled until you verify them.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Projects", projects.length],
          ["Concept", projects.filter((item) => item.kind === "concept").length],
          ["Commissioned", projects.filter((item) => item.kind === "commissioned").length],
          ["Open inquiries", inquiries.filter((item) => item.status === "new").length],
          ["Services", services.length],
          ["Sample stats", statistics.filter((item) => item.sample).length],
        ].map(([label, value]) => (
          <article key={String(label)} className="border border-line bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="mt-3 font-display text-4xl">{value}</p>
          </article>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className={buttonClass("primary", "sm")} href="/admin/portfolio?create=1">
          New project
        </Link>
        <Link className={buttonClass("secondary", "sm")} href="/admin/inquiries">
          Review inquiries
        </Link>
        <Link className={buttonClass("secondary", "sm")} href="/admin/media">
          Upload media
        </Link>
        <Link className={buttonClass("secondary", "sm")} href="/admin/settings">
          Backup
        </Link>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Catalog by category</h2>
          {categories.length === 0 ? <p className="mt-4 text-sm text-muted">No projects yet.</p> : null}
          <ul className="mt-4 space-y-3 md:hidden">
            {categories.map((row) => (
              <li key={row.name}>
                <div className="flex justify-between text-xs">
                  <span>{row.name}</span>
                  <span>{row.count}</span>
                </div>
                <div className="mt-1 h-1.5 bg-line">
                  <div className="h-full bg-accent" style={{ width: `${(row.count / maxCategory) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 hidden h-80 md:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical" margin={{ left: 16, right: 8 }}>
                <XAxis type="number" allowDecimals={false} stroke="#a1a1aa" />
                <YAxis type="category" dataKey="name" width={130} stroke="#a1a1aa" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#171717", border: "1px solid #292929", color: "#f5f5f5" }} />
                <Bar dataKey="count" fill="#ff6b24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Inquiries by status</h2>
          <p className="mt-2 text-xs text-muted">Counted from inquiries saved in this browser.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statuses}>
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis allowDecimals={false} stroke="#a1a1aa" />
                <Tooltip contentStyle={{ background: "#171717", border: "1px solid #292929", color: "#f5f5f5" }} />
                <Bar dataKey="count" fill="#ff6b24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border border-line p-4">
          <h2 className="font-display text-2xl uppercase">Recent inquiries</h2>
          {recentInquiries.length === 0 ? <p className="mt-3 text-sm text-muted">No inquiries yet.</p> : null}
          <ul className="mt-3 space-y-3">
            {recentInquiries.map((item) => (
              <li key={item.id} className="border-t border-line pt-3 text-sm">
                <p>{item.fullName}</p>
                <p className="text-muted">{item.service} · {item.status} · {formatWhen(item.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="border border-line p-4">
          <h2 className="font-display text-2xl uppercase">Recent activity</h2>
          {recentActivity.length === 0 ? <p className="mt-3 text-sm text-muted">No activity yet.</p> : null}
          <ul className="mt-3 space-y-3">
            {recentActivity.map((item) => (
              <li key={item.id} className="border-t border-line pt-3 text-sm">
                <p>{item.message}</p>
                <p className="text-muted">{formatWhen(item.at)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
