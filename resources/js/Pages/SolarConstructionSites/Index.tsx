import { Link } from '@inertiajs/react';

interface Site {
    id: number;
    name: string;
}

export default function Index({ sites }: { sites: Site[] }) {
    return (
        <div>
            <h1>Solar Panel Construction Sites</h1>
            <Link href="/solar-construction-sites/create" className="btn btn-primary">Create New Site</Link>
            <ul>
                {sites.map(site => (
                    <li key={site.id}>
                        {site.name}
                        <Link href={`/solar-construction-sites/${site.id}/edit`} className="ml-2 text-blue-500">Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
