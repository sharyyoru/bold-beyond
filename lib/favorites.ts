import { createSupabaseClient } from "./supabase";

export interface FavoriteItem {
  item_type: "provider" | "service" | "product";
  item_id: string;
  item_slug: string;
  item_name: string;
  item_image_url?: string | null;
  item_category: string;
  item_price?: number | null;
}

export async function addFavorite(item: FavoriteItem): Promise<boolean> {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      ...item,
    });

    if (error) {
      // If duplicate, it's already favorited
      if (error.code === "23505") return true;
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return false;
  }
}

export async function removeFavorite(itemType: string, itemId: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
}

export async function toggleFavorite(item: FavoriteItem): Promise<{ isFavorited: boolean; success: boolean }> {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isFavorited: false, success: false };

    // Check if already favorited
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", item.item_type)
      .eq("item_id", item.item_id)
      .single();

    if (existing) {
      // Remove favorite
      await supabase.from("favorites").delete().eq("id", existing.id);
      return { isFavorited: false, success: true };
    } else {
      // Add favorite
      await supabase.from("favorites").insert({
        user_id: user.id,
        ...item,
      });
      return { isFavorited: true, success: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { isFavorited: false, success: false };
  }
}

export async function checkIsFavorited(itemType: string, itemId: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
}

export async function getFavorites(itemType?: string): Promise<FavoriteItem[]> {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (itemType) {
      query = query.eq("item_type", itemType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
}
