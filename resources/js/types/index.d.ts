export interface User {
    id: number;
    name: string;
    role: string;
    email: string;
    email_verified_at: string;
    address?: string;
    profile?: string;
}

export type PageProps<T extends Record<string, any> = Record<string, any>> = T & {
    auth: {
        user: User;
    };
};
