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
}