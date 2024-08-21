import { serve } from "bun";
import dbooks from "./script.ts";


serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;
        const method = req.method;

        if (path === '/items' && method === 'GET') {
            const items = dbooks.getBooks();
            return new Response(JSON.stringify(items), { status: 200 });
        }

        if (path.startsWith('/item/') && method === 'GET') {
            const id = path.split('/').pop();
            const item = dbooks.getItemById(Number(id));
            return item ? new Response(JSON.stringify(item), { status: 200 }) : new Response('Not Found', { status: 404 });
        }

        if (path === '/item' && method === 'POST') {
            const { name, author, year } = await req.json();
            dbooks.addBook(name, author, year);
            return new Response('Created', { status: 201 });
        }

        if (path.startsWith('/item/') && method === 'PUT') {
            const id = path.split('/').pop();
            const { name, author, year } = await req.json();
            dbooks.updateBook(Number(id), name, author, year);
            return new Response('Updated', { status: 200 });
        }

        if (path.startsWith('/item/') && method === 'DELETE') {
            const id = path.split('/').pop();
            dbooks.deleteBook(Number(id));
            return new Response('Deleted', { status: 200 });
        }

        return new Response('Not Found', { status: 404 });
    },
});
