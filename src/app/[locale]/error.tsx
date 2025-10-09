'use client';

import ErrorSection from "@/sections/ErrorSection";


type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {

  return (
    <ErrorSection 
        errorCode={500}
        errorMessage="Внутренняя ошибка сервера"
        secondaryText={error.message}
        reloadAction={reset}
    />
  );
}
