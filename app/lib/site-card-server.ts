import { cache } from "react";
import { getSiteCardDefinition, type SiteCardDefinition } from "../data/card-registry";
import { createSupabaseServerClient } from "./supabase/server";
import { getSupabaseAdminClient } from "./supabase/admin";
import { SITE_MEDIA_BUCKET } from "./site-media-server";

export type SiteCardRow = {
  card_key: string;
  title: string | null;
  description: string | null;
  eyebrow: string | null;
  action_label: string | null;
  href: string | null;
  secondary_action_label: string | null;
  secondary_href: string | null;
  tone: string | null;
  image_storage_path: string | null;
  image_alt: string | null;
  focal_x: number;
  focal_y: number;
  updated_at: string;
};

export type SavedSiteCard = SiteCardRow & { imageUrl: string | null };

export type ResolvedSiteCard = SiteCardDefinition & {
  imageUrl: string | null;
  imageAlt: string;
  focalX: number;
  focalY: number;
  updatedAt: string | null;
};

async function signCardImage(client: Awaited<ReturnType<typeof createSupabaseServerClient>> | ReturnType<typeof getSupabaseAdminClient>, storagePath: string | null) {
  if (!client || !storagePath) return null;
  const { data, error } = await client.storage.from(SITE_MEDIA_BUCKET).createSignedUrl(storagePath, 60 * 60);
  return error || !data?.signedUrl ? null : data.signedUrl;
}

function mergeCard(definition: SiteCardDefinition, row: SavedSiteCard | null): ResolvedSiteCard {
  return {
    ...definition,
    title: row?.title ?? definition.title,
    description: row?.description ?? definition.description,
    eyebrow: row?.eyebrow ?? definition.eyebrow,
    actionLabel: row?.action_label ?? definition.actionLabel,
    href: row?.href ?? definition.href,
    secondaryActionLabel: row?.secondary_action_label ?? definition.secondaryActionLabel,
    secondaryHref: row?.secondary_href ?? definition.secondaryHref,
    tone: row?.tone ?? definition.tone,
    imageUrl: row?.imageUrl ?? null,
    imageAlt: row?.image_alt ?? "",
    focalX: Number(row?.focal_x ?? 50),
    focalY: Number(row?.focal_y ?? 50),
    updatedAt: row?.updated_at ?? null,
  };
}

export const getSiteCard = cache(async (cardKey: string): Promise<ResolvedSiteCard | null> => {
  const definition = getSiteCardDefinition(cardKey);
  if (!definition) return null;
  const client = await createSupabaseServerClient();
  if (!client) return mergeCard(definition, null);
  const { data } = await client
    .from("site_card_content")
    .select("card_key, title, description, eyebrow, action_label, href, secondary_action_label, secondary_href, tone, image_storage_path, image_alt, focal_x, focal_y, updated_at")
    .eq("card_key", cardKey)
    .maybeSingle();
  if (!data) return mergeCard(definition, null);
  const imageUrl = await signCardImage(client, data.image_storage_path ?? null);
  return mergeCard(definition, { ...(data as SiteCardRow), imageUrl });
});

export async function getSiteCardsForAdmin(): Promise<SavedSiteCard[]> {
  try {
    const client = getSupabaseAdminClient();
    const { data } = await client
      .from("site_card_content")
      .select("card_key, title, description, eyebrow, action_label, href, secondary_action_label, secondary_href, tone, image_storage_path, image_alt, focal_x, focal_y, updated_at")
      .order("card_key");
    if (!data) return [];
    return Promise.all((data as SiteCardRow[]).map(async (row) => ({ ...row, imageUrl: await signCardImage(client, row.image_storage_path) })));
  } catch {
    return [];
  }
}
