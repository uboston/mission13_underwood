import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import Banner from '../components/Banner';
import CartSummary from '../components/CartSummary';
import { useState } from 'react';
// Completed Book page

function BookPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  return (
    <>
      <div className="container mt-3">
        < CartSummary />
        <div className="row">
          <Banner />
        </div>
        <div className="row">
          <div className="col-md-3">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCheckboxChange={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <BookList selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BookPage;
