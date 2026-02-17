"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { BookingStatus, PaymentStatus } from "@/domain/types/common";
import { cn } from "@/lib/utils/cn";

export interface BookingListItem {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  searchable: string;
  rightSlot?: ReactNode;
}

interface BookingListProps {
  title: string;
  items: BookingListItem[];
  emptyMessage: string;
  className?: string;
}

const statusOptions: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const paymentOptions: PaymentStatus[] = ["UNPAID", "PAID", "FAILED"];

export function BookingList({ title, items, emptyMessage, className }: BookingListProps) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const hasPayment = items.some((item) => item.paymentStatus);
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }
      if (paymentFilter !== "ALL" && item.paymentStatus && item.paymentStatus !== paymentFilter) {
        return false;
      }
      if (fromDate && item.date < fromDate) {
        return false;
      }
      if (toDate && item.date > toDate) {
        return false;
      }
      return true;
    });
  }, [items, statusFilter, paymentFilter, fromDate, toDate]);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink-900">{title}</h2>
        <span className="text-xs text-ink-600">
          Showing {filteredItems.length} of {items.length}
        </span>
      </div>

      <div className="grid gap-3 rounded-2xl border border-charcoal-100 bg-white/80 p-4 shadow-soft md:grid-cols-[0.9fr_0.9fr_0.9fr_0.9fr_0.8fr]">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-charcoal-700">Status</label>
          <select
            className="rounded-xl border border-charcoal-100 bg-white/80 px-3 py-2 text-sm text-charcoal-900 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as BookingStatus | "ALL")}
          >
            <option value="ALL">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        {hasPayment ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-charcoal-700">Payment</label>
            <select
              className="rounded-xl border border-charcoal-100 bg-white/80 px-3 py-2 text-sm text-charcoal-900 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100"
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value as PaymentStatus | "ALL")}
            >
              <option value="ALL">All</option>
              {paymentOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-charcoal-700">From</label>
          <input
            className="rounded-xl border border-charcoal-100 bg-white/80 px-3 py-2 text-sm text-charcoal-900 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-charcoal-700">To</label>
          <input
            className="rounded-xl border border-charcoal-100 bg-white/80 px-3 py-2 text-sm text-charcoal-900 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-charcoal-100 bg-white/80 text-sm font-semibold text-charcoal-900 transition-all duration-300 hover:border-rose-600 hover:text-rose-700"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-charcoal-100 bg-white/90 p-4 shadow-soft">
        {filteredItems.length === 0 ? (
          <p className="text-sm text-ink-600">{emptyMessage}</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 py-3 last:border-b-0">
              <div>
                <p className="font-semibold text-ink-900">{item.title}</p>
                {item.subtitle ? <p className="text-xs text-ink-600">{item.subtitle}</p> : null}
              </div>
              {item.rightSlot ? <div className="flex items-center gap-3">{item.rightSlot}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
