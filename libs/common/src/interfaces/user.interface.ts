export interface IUser {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updateAt: Date;
}

export interface IAuthUser extends Pick<IUser, 'id' | 'email'> {
    roles: string[];
}
