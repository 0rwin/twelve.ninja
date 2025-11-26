// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const env = {
    SUPABASE_URL: Deno.env.get('SUPABASE_URL')!,
    SUPABASE_SERVICE_ROLE: Deno.env.get('SUPABASE_SERVICE_ROLE')!,
}

// input validator
const QuerySchema = z.object({
    bbox: z.object({ xMin: z.number(), xMax: z.number(), yMin: z.number(), yMax: z.number() }).optional(),
    qMin: z.number().optional(),
    qMax: z.number().optional(),
    rMin: z.number().optional(),
    rMax: z.number().optional(),
})

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE)

serve(async (req: Request) => {
    const parsed = QuerySchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) return new Response(JSON.stringify({ ok: false, error: parsed.error.issues }), { status: 400 })

    // simple fetch: supply q/r bounds or bbox mapping handled client-side
    const { qMin = -128, qMax = 128, rMin = -128, rMax = 128 } = parsed.data
    const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .gte('q', qMin)
        .lte('q', qMax)
        .gte('r', rMin)
        .lte('r', rMax)

    if (error) {
        return new Response(JSON.stringify({ ok: false, error }), { status: 500 })
    }

    // map each tile to include pixel coordinates (server can compute if using consistent layout)
    // However we prefer client compute to avoid coupling; send grid coords and tile_type
    return new Response(JSON.stringify({ ok: true, tiles: data }), { status: 200 })
})
