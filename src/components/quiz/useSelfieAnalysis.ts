import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { supabase } from "@/integrations/supabase/client";
import { concernsFromAnalysis, describeAnalysis } from "@/lib/me22Analysis";
import type { QuizData } from "./quizConfig";

/** Runs ME-22 analysis as soon as a selfie is set and pre-fills fields the user has not edited. */
export function useSelfieAnalysis(data: QuizData, setData: Dispatch<SetStateAction<QuizData>>) {
  const goalsTouched = useRef(false);
  const [isAnalyzingSelfie, setIsAnalyzingSelfie] = useState(false);
  const [selfieAnalysisDone, setSelfieAnalysisDone] = useState(false);

  const analyzeSelfie = useCallback(async () => {
    if (!data.selfie || isAnalyzingSelfie) return;
    const photo = data.selfie;
    setIsAnalyzingSelfie(true);
    try {
      const res = await supabase.functions.invoke("me22-preview", { body: { action: "analyze", selfie: photo } });
      const analysis = res.data?.ok ? (res.data.analysis as Record<string, unknown> | null) : null;
      if (!analysis) console.warn("ME-22 analysis failed:", res.error || res.data?.error);
      setData((prev) => prev.selfie !== photo ? prev : ({
        ...prev,
        me22Analysis: analysis,
        skinDescription: prev.skinDescription.trim() ? prev.skinDescription : describeAnalysis(analysis),
        skinGoals: goalsTouched.current ? prev.skinGoals : concernsFromAnalysis(analysis),
      }));
    } catch (err) {
      console.warn("ME-22 analysis failed:", err);
    } finally {
      setSelfieAnalysisDone(true);
      setIsAnalyzingSelfie(false);
    }
  }, [data.selfie, isAnalyzingSelfie, setData]);

  useEffect(() => {
    if (data.selfie && !selfieAnalysisDone && !isAnalyzingSelfie) analyzeSelfie();
  }, [data.selfie, selfieAnalysisDone, isAnalyzingSelfie, analyzeSelfie]);

  return { goalsTouched, isAnalyzingSelfie, selfieAnalysisDone, setSelfieAnalysisDone };
}
