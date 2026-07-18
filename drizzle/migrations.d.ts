// Types for the drizzle-kit generated migrations.js (matches useMigrations' param).
declare const migrations: {
  journal: {
    entries: { idx: number; when: number; tag: string; breakpoints: boolean }[];
  };
  migrations: Record<string, string>;
};
export default migrations;
