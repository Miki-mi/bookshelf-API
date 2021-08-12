const { nanoid } = require('nanoid');

const books = [];

const addBook = (request, h) => {
    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
     } = request.payload;

     const id = nanoid(16);
     var finished = false;

     if(pageCount === readPage){
        finished = true; 
     }
     else{
        finished = false;
     }

     const insertedAt = new Date().toISOString();
     const updatedAt = insertedAt;

     const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
     };

    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
     }

     else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
     }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    else{
        const response = h.response({
            status: 'error',
            message: `Buku gagal ditambahkan `,
        });

        response.code(500);
        return response;
     }
     
};

const getAllBook = () => ({
    status: 'success',
    data: {
        books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
    },
});

const getDetailBook = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if(book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    else {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });

        response.code(404);
        return response;
    }
};

const updateBook = (request, h) => {
    const { bookId } = request.params;

    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
     } = request.payload;

     var finished = false;

     if(pageCount === readPage){
        finished = true; 
     }
     else{
        finished = false;
     }

     const updatedAt = new Date().toISOString();

     const i = books.findIndex((b) => b.id === bookId);

     if(!name){
         const response = h.response({
             status: 'fail',
             message: 'Gagal memperbarui buku. Mohon isi nama buku'
         });
         response.code(400);
         return response;
     }

     else if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
     }

     else if(i === -1 ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
     }

     else if (i !== -1) {
         books[i] = {
             ...books[i],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
         };
         const response = h.response({
             status: 'success',
             message: 'Buku berhasil diperbarui',
         });
         response.code(200);
         return response;
     }

}

const deleteBook = (request, h) => {
    const { bookId } = request.params;

    const i = books.findIndex((b) => b.id === bookId);

    if ( i === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }

    books.splice(i, 1); 
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    })
    response.code(200);
    return response;
 };

module.exports = { addBook, getAllBook, getDetailBook, updateBook, deleteBook };
