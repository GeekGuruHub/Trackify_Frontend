import PropTypes from "prop-types";
import { useState } from "react";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      onAddCategory(newCategory);
      setNewCategory("");
      onClose();
    } else {
      alert("Category name cannot be empty.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="p-2 border border-gray-300 rounded-md w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCategory}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Prop Types
AddCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen must be a boolean and is required
  onClose: PropTypes.func.isRequired, // onClose must be a function and is required
  onAddCategory: PropTypes.func.isRequired, // onAddCategory must be a function and is required
};

export default AddCategoryModal;
