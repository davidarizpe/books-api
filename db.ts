import Database from "bun:sqlite";


export default class db {
  db = new Database("data.db");
  deleteRepeatedBooks() {
    this.db.exec(`
        WITH CTE AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (PARTITION BY title, author, year ORDER BY id) AS rn
            FROM books
        )
        DELETE FROM books
        WHERE id IN (
            SELECT id FROM CTE WHERE rn > 1
        );
    `);
}


  init(){
    this.db.exec(`CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER NOT NULL
    )`);

    this.deleteRepeatedBooks();
  }

  addBook(title: string, author: string, year: number) {
    this.db.exec(`INSERT INTO books (title, author, year) VALUES (?, ?, ?)`, [title, author, year]);
  }

  getBooks() {
    return this.db.prepare(`SELECT * FROM books`).all();
  }

  deleteBook(id: number) {
    const stmt = this.db.prepare(`DELETE FROM books WHERE id = ?`);
    stmt.run(id);  
  }

  updateBook(id: number, title: string, author: string, year: number) {
    this.db.exec(`UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?`, [title, author, year, id]);
  }

  getItemById(id: number) {
    return this.db.prepare(`SELECT * FROM books WHERE id = ?`).get(id);
  }

}