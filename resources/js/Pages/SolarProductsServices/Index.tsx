import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
}

export default function Index({ products }: { products: Product[] }) {
    return (
        <div>
            <h1>Solar Products & Services</h1>
            <Link href="/solar-products-services/create" className="btn btn-primary">Create New Product</Link>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name}
                        <Link href={`/solar-products-services/${product.id}/edit`} className="ml-2 text-blue-500">Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
