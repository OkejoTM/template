"use client";

import { useTranslations } from "@/lib/localize";
import RoundedButton from "../components/RoundedButton";

const Collaboration = () => {
  const t = useTranslations("CollaborationSection");

  return (
    <section className="container bg-site py-[50px] px-4">
      <div className="mx-auto max-w-[1200px] text-textPrimary">
        <h2 className="font-semibold text-[36px] leading-[36px] mb-[36px] text-headings text-left">
          {t("title")}
        </h2>

        <div
          className="flex justify-center"
          style={{ maxWidth: 756, margin: "0 auto" }}
        >
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 w-full">
            <RoundedButton href="/contacts" variant="filled" className="w-full">
              {t("button_joinTeam")}
            </RoundedButton>

            <RoundedButton
              href="/contacts"
              variant="outlined"
              className="w-full"
            >
              {t("button_discussProject")}
            </RoundedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
