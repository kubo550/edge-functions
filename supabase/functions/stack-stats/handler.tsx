import React from "https://esm.sh/react@18.2.0";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { ImageResponse } from "https://deno.land/x/og_edge/mod.ts";

enum Color {
  BACKGROUND = "#2D2D2D",
  TEXT = "#C4C8CC",
  GOLD = "#F0B400",
  SILVER = "#999C9F",
  BRONZE = "#AB825F",
}
const FONT_SIZE = 16;

const getBadgeStyle = (color: Color) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  overflow: "hidden",
  marginRight: 2,
  backgroundColor: color,
  marginTop: 1  ,
});

const getBadgeContainerStyle = (color: Color) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 10,
  color: color,
});

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: FONT_SIZE,
  backgroundColor: Color.BACKGROUND,
  padding: "6px 14px",
  height: 52,
} as const;

const imageStyle = {
  width: 28,
  height: 28,
  objectFit: "cover",
  marginRight: 10,
} as const;


function formatNumber(num: number):string {
  if (num < 1000) return num.toString();
  if (num < 10000) return (num / 1000).toString().replace(".", ",");
  if (num < 1000000) return (num / 1000).toFixed(0) + "k";
  return (num / 1000000).toFixed(0) + "m";
}
export default async function handler(req: Request) {
  console.log('Got request')

  if (req.method !== "GET") {
    console.log('Invalid method')
    return new Response(
      JSON.stringify({ error: "Only GET requests are accepted" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const id = new URL(req.url).searchParams.get("id");
  const withImage = new URL(req.url).searchParams.get("withImage");

  const { data } = await axiod.get(
    `https://api.stackexchange.com/2.3/users/${id}?order=desc&sort=reputation&site=stackoverflow`
  );


  if (data.items.length === 0) {
    return new Response(
      JSON.stringify({ error: `User with id ${id} not found` }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  console.log('Got data for user', { id })
  const { reputation, profile_image, badge_counts } = data.items[0];

  const badges = [
    {
      color: Color.GOLD,
      count: badge_counts.gold,
    },
    {
      color: Color.SILVER,
      count: badge_counts.silver,
    },
    {
      color: Color.BRONZE,
      count: badge_counts.bronze,
    },
  ].filter(badge => badge.count > 0);

  return new ImageResponse(
    (
      <div style={containerStyle}>
        {withImage === "true" && (
          <img src={profile_image} alt='profile' style={imageStyle} />
        )}

        <span style={{ color: Color.TEXT }}>{formatNumber(reputation)}</span>

        {badges.map(badge => (
          <span style={getBadgeContainerStyle(badge.color)}>
            <span style={getBadgeStyle(badge.color)} />
            {formatNumber(badge.count)}
          </span>
        ))}
      </div>
    ), {
        height: 52,
      }
  );
}

