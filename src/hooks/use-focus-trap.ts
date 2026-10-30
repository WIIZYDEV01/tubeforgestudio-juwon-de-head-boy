"use client";

import { useEffect, useRef, type RefObject } from "react";

type Layer = (event: KeyboardEvent) => void;
const layers: Layer[] = [];

function handleKey(event: KeyboardEvent) {
  layers[layers.length - 1]?.(event);
}

function focusables(node: HTMLElement) {
  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);
}

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const list = focusables(node);
    const field = list.find((element) => element.matches("input, textarea, select"));
    (field ?? list[0])?.focus();

    const layer: Layer = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const close = node.querySelector<HTMLElement>("[data-close='true']");
        close?.click();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables(node);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    layers.push(layer);
    if (layers.length === 1) document.addEventListener("keydown", handleKey);
    return () => {
      const index = layers.indexOf(layer);
      if (index >= 0) layers.splice(index, 1);
      if (layers.length === 0) document.removeEventListener("keydown", handleKey);
      previous.current?.focus();
    };
  }, [active, ref]);
}

let locks = 0;

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    locks += 1;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      locks -= 1;
      document.body.style.overflow = locks === 0 ? "" : previous;
    };
  }, [locked]);
}
