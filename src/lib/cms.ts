import { supabase } from "./supabase";

export async function fetchPortfolioData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const [
      { data: hero },
      { data: about },
      { data: skills },
      { data: experience },
      { data: projects },
      { data: certifications },
      { data: education },
      { data: achievements },
      { data: contact },
      { data: social },
      { data: resume },
      { data: audio },
      { data: seo },
    ] = await Promise.all([
      supabase.from("hero").select("*").single(),
      supabase.from("about").select("*").single(),
      supabase.from("skills").select("*").order("category"),
      supabase.from("experience").select("*").order("duration", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("certifications").select("*").order("issue_date", { ascending: false }),
      supabase.from("education").select("*").order("year", { ascending: false }),
      supabase.from("achievements").select("*").order("date", { ascending: false }),
      supabase.from("contact").select("*").single(),
      supabase.from("social_links").select("*"),
      supabase.from("resume").select("*").single(),
      supabase.from("audio").select("*").single(),
      supabase.from("seo_settings").select("*").single(),
    ]);

    return {
      hero: hero || null,
      about: about || null,
      skills: skills || [],
      experience: experience || [],
      projects: projects || [],
      certifications: certifications || [],
      education: education || [],
      achievements: achievements || [],
      contact: contact || null,
      social: social || [],
      resume: resume || null,
      audio: audio || null,
      seo: seo || null,
    };
  } catch (err) {
    console.error("Failed to fetch CMS data", err);
    return null;
  }
}
