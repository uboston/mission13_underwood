import { useEffect, useState } from "react";
import "./CategoryFilter.css";

function CategoryFilter ({selectedCategories, onCheckboxChange}: {
    selectedCategories: string[];
    onCheckboxChange: (categories: string[]) => void;}) 
{
    const [categories, setCategories] = useState<string[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('https://mission13-underwood-backend-fzawa8drezbddcay.eastus-01.azurewebsites.net/book/GetBookCategories');
            const data = await response.json();
            setCategories(data);
        }
        fetchCategories();
    }, []);

    function handleCheckboxChange({target}: {target: HTMLInputElement}){
        const updatedCategories = selectedCategories.includes(target.value) ? selectedCategories.filter(x=> x !== target.value) :
        [...selectedCategories, target.value];
        onCheckboxChange(updatedCategories);
    }

    return (
        <div className="category-filter">
            <h4>Categories</h4>
            <div className="category-list">
                {categories.map((c) => (
                    <div key={c} className="category-item">
                        <input type="checkbox" id={c} name={c} value={c} 
                        onChange={handleCheckboxChange}
                        />
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    );
    
}

export default CategoryFilter;