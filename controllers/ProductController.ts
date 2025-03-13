import { Request, Response } from "express";
import { Product } from "../models/mongodbModel/Product";
// import { PipelineStage } from "mongodb";


// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category, stock } = req.body;

    const product = new Product({ name, price, category, stock });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Get Product by search

export const getProductsBySearch = async (req: Request, res: Response) => {
    try {
      const { search, page = 1, limit = 10 } = req.query;
  
      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 10;
      const skip = (pageNumber - 1) * pageSize;
  
      const searchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
            ],
          }
        : {};
  
      const aggregationPipeline: any[] = [
        { $match: searchQuery },
        { $sort: { createdAt: -1 } }, // Sort by newest first
        { $skip: skip as any }, // Ensure correct typing
        { $limit: pageSize as any }, // Ensure correct typing
      ];
  
      const products = await Product.aggregate(aggregationPipeline);
  
      const totalProducts = await Product.countDocuments(searchQuery);
  
      res.json({
        products,
        totalPages: Math.ceil(totalProducts / pageSize),
        currentPage: pageNumber,
        totalProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, category, stock },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
