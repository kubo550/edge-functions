import React from "https://esm.sh/react@18.2.0";
import axiod from "https://deno.land/x/axiod/mod.ts";
import {ImageResponse} from 'https://deno.land/x/og_edge/mod.ts'

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

    const {reputation, profile_image, badge_counts} = data.items[0]

    console.log({reputation, profile_image, badge_counts})

    return new ImageResponse(
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                backgroundColor: '#2D2D2D',
                height: 52,
                padding: '0 8px',

            }}
        >

                <span style={{color: '#C4C8CC'}}>
                    3,077
                </span>

            <span style={{display: "flex",
                alignItems: "center",
                justifyContent: "center",}}>
                    <span style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                    }}/>
                    12
                </span>

            <span title="12 silver badges" aria-hidden="true">
            </span>
            <span title="22 bronze badges" aria-hidden="true">
            </span>

        </div>
    )
        ;


}
