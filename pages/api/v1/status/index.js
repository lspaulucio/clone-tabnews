import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const pgVersionResult = await database.query("SHOW server_version;");
  const pgVersionValue = pgVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const activeConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const activeConnectionsValue = activeConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: parseInt(maxConnectionsValue),
        opened_connections: activeConnectionsValue,
        version: pgVersionValue,
      },
    },
  });
}

export default status;
