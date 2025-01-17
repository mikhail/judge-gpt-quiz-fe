"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn, decodeHTMLEntities } from "@/lib/utils";
import { Send, ShieldCheck, ShieldX } from "lucide-react";
import { MAX_ARTICLES_PER_SESSION } from "@/models/Article";
import { useTranslations } from "next-intl";
import { QuizSession } from "@/models/Response";

interface QuizViewProps {
  quizSession: QuizSession;
  humanAiOptionChecked: "human" | "ai" | null;
  realFakeOptionChecked: "real" | "fake" | null;
  setHumanAiOptionChecked(option: "human" | "ai"): void;
  setRealFakeOptionChecked(option: "real" | "fake"): void;
  onSubmitCallback({
    humanOptionSelected,
    isFakeSelected,
  }: {
    humanOptionSelected: boolean;
    isFakeSelected: boolean;
  }): void;
}
const QuizView = ({
  quizSession,
  humanAiOptionChecked,
  setHumanAiOptionChecked,
  realFakeOptionChecked,
  setRealFakeOptionChecked,
  onSubmitCallback,
}: QuizViewProps) => {
  const translations = useTranslations("Quiz");

  function getArticleHeadline() {
    return quizSession.articles[quizSession.currentArticleIndex].headline;
  }

  function getArticleContent() {
    return decodeHTMLEntities(
      quizSession.articles[quizSession.currentArticleIndex].content
    );
  }

  const HumanAiButton = (variant: "human" | "ai") => {
    return (
      <Button
        variant={"ghost"}
        className={cn(
          "w-full flex flex-row items-center justify-start gap-2 bg-transparent text-base font-normal hover:bg-transparent active:bg-transparent ring-1 ring-muted-foreground/15 hover:ring-muted-foreground/30 active:ring-transparent shadow-none",
          humanAiOptionChecked === variant &&
            "ring-primary hover:ring-primary active:ring-primary"
        )}
        onClick={() => setHumanAiOptionChecked(variant)}
      >
        <Checkbox
          asChild
          checked={humanAiOptionChecked === variant}
          className="shadow-none"
        />
        <span>
          {variant === "human"
            ? translations("quizViewAnswerHuman")
            : translations("quizViewAnswerAi")}
        </span>
      </Button>
    );
  };

  const RealFakeButton = (variant: "real" | "fake") => {
    return (
      <Button
        variant={"ghost"}
        className={cn(
          "w-full flex flex-row items-center justify-start gap-2 bg-transparent text-base font-normal hover:bg-transparent active:bg-transparent ring-1 shadow-none",
          variant === "real" &&
            "ring-green-500 hover:ring-green-500 active:ring-green-500 text-green-500 hover:text-green-500 active:text-green-500 dark:text-green-500 dark:hover:text-green-500 dark:active:text-green-500",
          variant === "fake" &&
            "ring-red-500 hover:ring-red-500 active:ring-red-500 text-red-500 hover:text-red-500 active:text-red-500 dark:text-red-500 dark:hover:text-red-500 dark:active:text-red-500",
          realFakeOptionChecked === variant &&
            variant === "real" &&
            "ring-green-500 hover:ring-green-500 active:ring-green-500 bg-green-500 hover:bg-green-500 active:bg-green-500 dark:bg-green-500 dark:hover:bg-green-500 dark:active-bg-green-500 text-white hover:text-white active:text-white dark:text-white dark:hover:text-white",
          realFakeOptionChecked === variant &&
            variant === "fake" &&
            "ring-red-500 hover:ring-red-500 active:ring-red-500 bg-red-500 hover:bg-red-500 active:bg-red-500 dark:bg-red-500 dark:hover:bg-red-500 dark:active-bg-red-500 text-white hover:text-white active:text-white dark:text-white dark:hover:text-white"
        )}
        onClick={() => setRealFakeOptionChecked(variant)}
      >
        {variant === "real" && <ShieldCheck size={24} />}
        {variant === "fake" && <ShieldX size={24} />}
        <span>
          {variant === "real"
            ? translations("quizViewAnswerReal")
            : translations("quizViewAnswerFake")}
        </span>
      </Button>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-2 gap-2">
      {/* Article Section */}
      <div className="flex flex-col items-center justify-start w-full h-full">
        {/* Article headline */}
        <span className="w-full text-left text-2xl font-medium pb-1">
          {getArticleHeadline()}
        </span>
        {/* Article content */}
        <div className="bg-muted/50 w-full border border-muted-foreground/20 px-2 md:px-4 py-2 overflow-y-scroll h-full  max-h-[45vh] md:max-h-[55vh] rounded-cmd">
          <blockquote className="text-primary/80 font-serif">
            {getArticleContent()}
          </blockquote>
        </div>
      </div>

      <div className="flex w-full items-center justify-center flex-col lg:flex-row">
        {/* Inputs section */}
        <div className="flex flex-col w-full items-center justify-center max-w-lg gap-2 lg:gap-4 lg:pb-4">
          <div className="w-full flex items-center justify-center flex-col gap-2">
            {/* Human or AI radio group */}
            <span className="w-full text-muted-foreground text-left text-base">
              {translations("quizViewQuestionHumanAi")}
            </span>
            <div className="w-full flex flex-row items-center justify-center gap-2 lg:gap-4">
              {HumanAiButton("human")}
              {HumanAiButton("ai")}
            </div>
          </div>
          {/* Real or fake buttons */}
          <div className="w-full flex items-center justify-center flex-col gap-2">
            <span className="w-full text-muted-foreground text-left text-base">
              {translations("quizViewQuestionRealFake")}
            </span>
            <div className="w-full flex flex-row items-center justify-center gap-2 lg:gap-4">
              {RealFakeButton("real")}
              {RealFakeButton("fake")}
            </div>
          </div>
        </div>
        {/* Progress indicator and submit button */}
        <div className="w-full max-w-lg flex flex-row items-center justify-center gap-4 pt-8 lg:pt-0 pb-2 lg:pb-0">
          {/* Progress indicator */}
          <div className="flex flex-row items-center justify-start gap-2">
            {[...Array(MAX_ARTICLES_PER_SESSION)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full bg-muted-foreground/20",
                  index < quizSession.currentArticleIndex + 1 &&
                    "bg-primary/80",
                  // wider if active question
                  index === quizSession.currentArticleIndex && "w-4"
                )}
              />
            ))}
          </div>
          {/* Submit button */}
          <Button
            variant={"default"}
            size={"lg"}
            disabled={!humanAiOptionChecked || !realFakeOptionChecked}
            className="flex items-center justify-center gap-4 rounded-full"
            onClick={() => {
              if (humanAiOptionChecked && realFakeOptionChecked) {
                onSubmitCallback({
                  humanOptionSelected: humanAiOptionChecked === "human",
                  isFakeSelected: realFakeOptionChecked === "fake",
                });
              }
            }}
          >
            {translations("quizViewSubmitButton")}
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
