import { Maker } from "@/pages/users/[id]/profile"

export type RacketSeries = {
  id: number,
  name_ja: string,
  name_en: string,
  maker_id: number,
  created_at: string,
  updated_at: string,
  maker: Maker
}
