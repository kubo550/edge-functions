import React from "https://esm.sh/react@18.2.0";
import axiod from "https://deno.land/x/axiod/mod.ts";
import {ImageResponse} from 'https://deno.land/x/og_edge/mod.ts'


enum Color {
    BACKGROUND = '#2D2D2D',
    TEXT = '#C4C8CC',
    GOLD = '#F0B400',
    SILVER = '#999C9F',
    BRONZE = '#AB825F',
}


export default async function handler(req: Request) {

    if (req.method !== "GET") {
        return new Response(
            JSON.stringify({error: "Only GET requests are accepted"}),
            {headers: {"Content-Type": "application/json"}},
        )
    }

    const id = new URL(req.url).searchParams.get('id')
    const {data} = await axiod.get(`https://api.stackexchange.com/2.3/users/${id}?order=desc&sort=reputation&site=stackoverflow`)

    if (data.items.length === 0) {
        return new Response(
            JSON.stringify({error: `User with id ${id} not found`}),
            {headers: {"Content-Type": "application/json"}},
        )
    }

    const {reputation, profile_image, badge_counts} = data.items[0];

    const getBadgeStyle = (color: Color) => ({
        width: 6,
        height: 6,
        borderRadius: '50%',
        overflow: 'hidden',
        marginRight: 2,
        backgroundColor: color,
    });

    const getBadgeContainerStyle = (color: Color) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        color: color,
    });

    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        backgroundColor: Color.BACKGROUND,
        height: 52,
        padding: '0 8px',
    };
    const imageStyle = {
        width: 24,
        height: 24,
        objectFit: 'cover',
        marginRight: 8,
    } as const;

    return new ImageResponse(
        <div style={containerStyle}>

            <img src={profile_image} alt='profile' style={imageStyle}/>

            <span style={{color: Color.TEXT}}>
               {reputation}
            </span>

            <span style={getBadgeContainerStyle(Color.GOLD)}>
                <span style={getBadgeStyle(Color.GOLD)}/>
                {badge_counts.gold}
            </span>

            <span style={getBadgeContainerStyle(Color.SILVER)}>
                <span style={getBadgeStyle(Color.SILVER)}/>
                {badge_counts.silver}
            </span>

            <span style={getBadgeContainerStyle(Color.BRONZE)}>
                <span style={getBadgeStyle(Color.BRONZE)}/>
                {badge_counts.bronze}
            </span>

        </div>
    );
}
