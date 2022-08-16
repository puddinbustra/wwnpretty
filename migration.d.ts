export declare type VersionString = `${number}.${number}${"" | number}${"" | `-${string}`}`;
declare type Constructor<T> = Function & {
    prototype: T;
};
export declare type UpdateData = {
    _id: string;
    [index: string]: unknown;
};
export declare type MigrationFunction<T extends Entity<unknown>> = (entity: T, pastUpdates: UpdateData) => UpdateData;
declare type MigrationData<T extends Entity<unknown>> = {
    type: Constructor<T>;
    version: VersionString;
    sort: number;
    func: MigrationFunction<T>;
};
export default function checkAndRunMigrations(): Promise<void>;
export declare function loadMigrations(): Promise<void>;
export declare function registerMigration<T extends Entity<unknown>>(type: Constructor<T>, version: VersionString, sort: number, func: MigrationFunction<T>): void;
export declare function orderedMigrations(): readonly MigrationData<Entity<unknown>>[];
export {};
