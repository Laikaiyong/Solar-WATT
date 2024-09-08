import { useForm } from '@inertiajs/react';

interface Site {
    id: number;
    name: string;
}

export default function Edit({ site }: { site: Site }) {
    const { data, setData, put, errors } = useForm({
        name: site.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/solar-construction-sites/${site.id}`);
    };

    return (
        <div>
            <h1>Edit Solar Panel Construction Site</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                    />
                    {errors.name && <div>{errors.name}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
}
