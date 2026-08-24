import { neon, neonConfig } from "@neondatabase/serverless";
import {
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  type CompiledQuery,
  type DatabaseConnection,
  type DatabaseIntrospector,
  type Dialect,
  type Driver,
  type Kysely,
  type QueryCompiler,
  type QueryResult,
} from "kysely";

type NeonSql = ReturnType<typeof neon>;

/** HTTP dialect so Better Auth can use Neon on Cloudflare Workers (no TCP). */
export function neonHttpDialect(connectionString: string): Dialect {
  neonConfig.poolQueryViaFetch = true;
  const sql = neon(connectionString);
  return {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new NeonHttpDriver(sql),
    createQueryCompiler: (): QueryCompiler => new PostgresQueryCompiler(),
    createIntrospector: (db: Kysely<unknown>): DatabaseIntrospector => new PostgresIntrospector(db),
  };
}

function toParam(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return Number(value);
  return value;
}

class NeonHttpDriver implements Driver {
  constructor(private readonly sql: NeonSql) {}
  async init(): Promise<void> {}
  async acquireConnection(): Promise<DatabaseConnection> {
    return new NeonHttpConnection(this.sql);
  }
  async beginTransaction(): Promise<void> {}
  async commitTransaction(): Promise<void> {}
  async rollbackTransaction(): Promise<void> {}
  async releaseConnection(): Promise<void> {}
  async destroy(): Promise<void> {}
}

class NeonHttpConnection implements DatabaseConnection {
  constructor(private readonly sql: NeonSql) {}

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const params = compiledQuery.parameters.map(toParam);
    const raw = await this.sql.query(compiledQuery.sql, params);
    const rows = (Array.isArray(raw) ? raw : ((raw as { rows?: O[] }).rows ?? [])) as O[];
    return { rows };
  }

  async *streamQuery<O>(): AsyncIterableIterator<QueryResult<O>> {
    throw new Error("Neon HTTP dialect does not stream queries");
  }
}
