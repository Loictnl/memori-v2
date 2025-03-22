import { prisma } from "@/lib/prisma";
import { Word } from "@prisma/client";

export async function GET() {
    return Response.json(
        await prisma.word.findMany({
            include: {
                phrasesExemples: true,
            },
        })
    );
}
