'use client';

import ErrorBlock from "@/sections/ErrorSection";

export default function NotFound() {
  return (
    <ErrorBlock
      errorCode={404}
      errorMessage="Такой страницы нет"
    />
  );
}