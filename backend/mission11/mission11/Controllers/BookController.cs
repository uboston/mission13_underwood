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

    // HttpGet for the books api
    [HttpGet(Name = "GetBooks")]
    public IActionResult GetBooks(int pageSize = 10, int pageNumber = 1)
    {
        // Query the books based on # of books to display and page number
        var books = _context.Books
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        // Pass the count of all book elements
        var totalBooks = _context.Books.Count();

        // Pass the both variables in an object
        var loadedObjects = new
        {
            Books = books,
            TotalBooks = totalBooks
        };
        return Ok(loadedObjects);
    }
    
}