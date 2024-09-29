import Category from "../modals/category.model.js";

// Create a new category
export const createCategory = async (req, res) => {
  const { name, image, description, price, parentCategory } = req.body;

  const newCategory = new Category({
    name,
    image,
    description,
    price,
    parentCategory,
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).populate("subcategories");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image, description, price, parentCategory, subcategories } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image, description, price, parentCategory, subcategories },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

// Get all root categories with their subcategories
export const getRootCategoriesWithSubcategories = async (req, res) => {
  try {
    // const rootCategories = await Category.find({ parentCategory: null }); // Find root categories
    const rootCategories = await Category.find({
      parentCategory: null,
    }).populate("subcategories");

    // Check if any root categories were found
    if (rootCategories.length === 0) {
      return res.status(404).json({ message: "No root categories found" });
    }

    // Populate subcategories
    const populatedCategories = await Category.populate(
      rootCategories,
      "subcategories"
    );

    // Format the response
    const response = {
      total: populatedCategories.length,
      categories: populatedCategories,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// // Get all categories
// export const getCategories = async (req, res) => {
//     try {
//         const categories = await Category.find({});
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get category by ID
// export const getCategoryById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const category = await Category.findById(id);
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Create a new category
// export const createCategory = async (req, res) => {
//     try {
//         const category = new Category(req.body);
//         await category.save();
//         res.status(201).json(category);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update an existing category
// export const updateCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedCategory) {
//             return res.status(404).json({ message: "Category not found" });
//         }
//         res.status(200).json(updatedCategory);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Delete a category
// export const deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedCategory = await Category.findByIdAndDelete(id);
//         if (!deletedCategory) {
//             return res.status(404).json({ message: "Category not found" });
//         }
//         res.status(200).json({ message: "Category deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
