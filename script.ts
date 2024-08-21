import db from "./db.ts";
import books from "./books.json";

const dbooks = new db();
try {

dbooks.init();

for (const book of books) {
  dbooks.addBook(book.title, book.author, book.year);
}

dbooks.deleteRepeatedBooks();

console.log("database created successfully");
console.log(dbooks.getBooks());
} catch (error) {
  console.log(error);
}

export default dbooks;