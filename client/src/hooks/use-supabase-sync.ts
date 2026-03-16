import { useEffect, useRef, useCallback, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Person, Experience } from "@/types/experiences";
import type { CalendarNote } from "@/types/calendar";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const DEBOUNCE_MS = 1500;

interface SyncData {
  birthDate: string;
  people: Person[];
  customExperiences: Experience[];
  calendarNotes: CalendarNote[];
}

interface UseSyncOptions {
  user: User | null;
  birthDate: string;
  people: Person[];
  customExperiences: Experience[];
  calendarNotes: CalendarNote[];
  setBirthDate: (v: string) => void;
  setPeople: (v: Person[]) => void;
  setCustomExperiences: (v: Experience[]) => void;
  setCalendarNotes: (v: CalendarNote[]) => void;
}

export function useSupabaseSync({
  user,
  birthDate,
  people,
  customExperiences,
  calendarNotes,
  setBirthDate,
  setPeople,
  setCustomExperiences,
  setCalendarNotes,
}: UseSyncOptions) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const isHydratingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousUserIdRef = useRef<string | null>(null);

  // Load data from Supabase when user signs in
  useEffect(() => {
    if (!user) {
      // User signed out — reset to defaults
      if (previousUserIdRef.current) {
        setBirthDate("");
        setPeople([]);
        setCustomExperiences([]);
        setCalendarNotes([]);
        previousUserIdRef.current = null;
      }
      return;
    }

    // Skip if same user (already loaded)
    if (previousUserIdRef.current === user.id) return;
    previousUserIdRef.current = user.id;

    const loadData = async () => {
      isHydratingRef.current = true;
      try {
        const { data, error } = await supabase
          .from("user_data")
          .select("birth_date, people, custom_experiences, calendar_notes")
          .eq("id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // No row found — new user, create one with current state
          await supabase.from("user_data").insert({
            id: user.id,
            birth_date: birthDate || null,
            people: people.length > 0 ? people : [],
            custom_experiences:
              customExperiences.length > 0 ? customExperiences : [],
            calendar_notes:
              calendarNotes.length > 0 ? calendarNotes : [],
          });
          setSaveStatus("saved");
        } else if (error) {
          console.error("Failed to load user data:", error);
          setSaveStatus("error");
        } else if (data) {
          // Hydrate React state from database
          if (data.birth_date) setBirthDate(data.birth_date);
          if (data.people && Array.isArray(data.people))
            setPeople(data.people as Person[]);
          if (
            data.custom_experiences &&
            Array.isArray(data.custom_experiences)
          )
            setCustomExperiences(data.custom_experiences as Experience[]);
          if (data.calendar_notes && Array.isArray(data.calendar_notes))
            setCalendarNotes(data.calendar_notes as CalendarNote[]);
          setSaveStatus("saved");
        }
      } catch (err) {
        console.error("Unexpected error loading data:", err);
        setSaveStatus("error");
      } finally {
        // Small delay to let state settle before allowing saves
        setTimeout(() => {
          isHydratingRef.current = false;
        }, 500);
      }
    };

    loadData();
  }, [user]);

  // Debounced save to Supabase on state changes
  const saveToSupabase = useCallback(
    (data: SyncData) => {
      if (!user) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          const { error } = await supabase.from("user_data").upsert({
            id: user.id,
            birth_date: data.birthDate || null,
            people: data.people,
            custom_experiences: data.customExperiences,
            calendar_notes: data.calendarNotes,
            updated_at: new Date().toISOString(),
          });

          if (error) {
            console.error("Failed to save:", error);
            setSaveStatus("error");
          } else {
            setSaveStatus("saved");
          }
        } catch (err) {
          console.error("Unexpected save error:", err);
          setSaveStatus("error");
        }
      }, DEBOUNCE_MS);
    },
    [user]
  );

  // Watch for state changes and trigger save
  useEffect(() => {
    if (!user || isHydratingRef.current) return;

    saveToSupabase({ birthDate, people, customExperiences, calendarNotes });
  }, [user, birthDate, people, customExperiences, calendarNotes, saveToSupabase]);

  // Cleanup debounce timer on unmount or user change
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user]);

  return { saveStatus };
}
