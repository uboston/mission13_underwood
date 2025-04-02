using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mission11.Data;

namespace mission11.Controllers;


// 
[Route("[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private BookstoreContext _context;

    public BookController(BookstoreContext context)
    {
        _context = context;
    }

    // HttpGet for the books api queried on categories
    [HttpGet(Name = "GetBooks")]
    public IActionResult GetBooks(int pageSize = 10, int pageNumber = 1, [FromQuery] List<string>? category = null)
    {
        var query = _context.Books.AsQueryable();

        if (category is not null && category.Any())
        {
            query = query.Where(b => category.Contains(b.Category));
        }
        
        var totalBooks = query.Count();
        // Query the books based on # of books to display and page number
        var books = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        // Pass the count of all book elements


        // Pass the both variables in an object
        var loadedObjects = new
        {
            Books = books,
            TotalBooks = totalBooks
        };
        return Ok(loadedObjects);
    }

    // Hosts the distinct category names
    [HttpGet("GetBookCategories")]
    public IActionResult GetBookCategories()
    {
        var BookCategories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();
        
        return Ok(BookCategories);
    }

    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        if (newBook is null)
        {
            return BadRequest(new { message = "Invalid book" });
        }
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(new { message = "Book added successfully" });
    }

    [HttpPut("UpdateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _context.Books.Find(bookId);
        
        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.Isbn = updatedBook.Isbn;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;
        _context.Books.Update(existingBook);
        _context.SaveChanges();
        
        return Ok(existingBook);
    }

    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _context.Books.Find(bookId);

        if (book is null)
        {
            return NotFound(new {message = "Book not found"});
        }
        
        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}