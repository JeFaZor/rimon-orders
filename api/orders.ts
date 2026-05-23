//api/order.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {neon} from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log('[orders] DATABASE_URL present?', !!process.env.DATABASE_URL, 'len:', process.env.DATABASE_URL?.length ?? 0);
    const sql=neon(process.env.DATABASE_URL!);

    const {items, notes}=req.body;
    const result = await sql`
        INSERT INTO orders (items, notes) VALUES (${JSON.stringify(items)}, ${notes})
        RETURNING id, created_at
    `;

    res.status(200).json({orderId: result[0].id, createdAt: result[0].created_at});
}