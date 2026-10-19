import Database from "@tauri-apps/plugin-sql";

export interface Member {
  id: number;
  name: string;
  status: string[];
}

export interface Game {
  id: number;
  name: string;
  exePath: string;
}

export async function getDbConnection() {
  return await Database.load("sqlite:wp.db");
}

export async function initDb() {
  const db = await getDbConnection();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT '[]'
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      exe_path TEXT NOT NULL UNIQUE
    );
  `);
}

function rowToMember(row: any): Member {
  return {
    id: row.id,
    name: row.name,
    status: JSON.parse(row.status),
  };
}

export async function getMembers(): Promise<Member[]> {
  try {
    const db = await getDbConnection();
    const rows = await db.select<any[]>("SELECT * FROM members ORDER BY name");
    return rows.map(rowToMember);
  } catch (error) {
    return [];
  }
}

export async function getMemberById(id: number): Promise<Member | null> {
  const db = await getDbConnection();
  const rows = await db.select<any[]>("SELECT * FROM members WHERE id = ?", [
    id,
  ]);
  return rows.length > 0 ? rowToMember(rows[0]) : null;
}

export async function createMember(
  name: string,
  status: string[],
): Promise<Member> {
  const db = await getDbConnection();
  const result = await db.execute(
    "INSERT INTO members (name, status) VALUES (?, ?)",
    [name, JSON.stringify(status)],
  );
  return { id: result.lastInsertId!, name, status };
}

export async function updateMember(
  id: number,
  name: string,
  status: string[],
): Promise<void> {
  const db = await getDbConnection();
  await db.execute("UPDATE members SET name = ?, status = ? WHERE id = ?", [
    name,
    JSON.stringify(status),
    id,
  ]);
}

export async function deleteMember(id: number): Promise<void> {
  const db = await getDbConnection();
  await db.execute("DELETE FROM members WHERE id = ?", [id]);
}

function rowToGame(row: any): Game {
  return {
    id: row.id,
    name: row.name,
    exePath: row.exe_path,
  };
}

export async function getGames(): Promise<Game[]> {
  try {
    const db = await getDbConnection();
    const rows = await db.select<any[]>("SELECT * FROM games ORDER BY name");
    return rows.map(rowToGame);
  } catch (error) {
    return [];
  }
}

export async function getGameById(id: number): Promise<Game | null> {
  const db = await getDbConnection();
  const rows = await db.select<any[]>("SELECT * FROM games WHERE id = ?", [id]);
  return rows.length > 0 ? rowToGame(rows[0]) : null;
}

export async function createGame(name: string, exePath: string): Promise<Game> {
  const db = await getDbConnection();
  const result = await db.execute(
    "INSERT INTO games (name, exe_path) VALUES (?, ?)",
    [name, exePath],
  );
  return { id: result.lastInsertId!, name, exePath };
}

export async function deleteGame(id: number): Promise<void> {
  const db = await getDbConnection();
  await db.execute("DELETE FROM games WHERE id = ?", [id]);
}
