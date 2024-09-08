import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors } = useForm({
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/solar-construction-sites');
    };

    return (
        <div>
            <h1>Create Solar Panel Construction Site</h1>
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
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
}
