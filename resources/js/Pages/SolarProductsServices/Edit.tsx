import { useForm } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
}

export default function Edit({ product }: { product: Product }) {
    const { data, setData, put, errors } = useForm({
        name: product.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/solar-products-services/${product.id}`);
    };

    return (
        <div>
            <h1>Edit Solar Product or Service</h1>
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
