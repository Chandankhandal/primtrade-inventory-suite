const Product = require('../models/Product');

const createProduct = async (req, res) => {

    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({ message: "Please fill in all the fields" })
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        user: req.user._id
    })

    if (product) {
        return res.status(201).json(product)
    }
    else {
        return res.status(400).json({ message: "Invalid product data" });
    }
}

const getProduct = async (req, res) => {
//  Need to debug the last issue in the app so added console log.
    try {
        let query = {};
        console.log("Get Products request Debug");
        console.log("Full req.user object", req.user);
        if(req.user){
            console.log("User Role:", req.user.role);
            console.log("User ID:", req.user._id || req.user.id);
        }
        else{
            console.log("Warning: req.user is completely Undefined!");
        }
        if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
            const userId = req.user._id || req.user.id;
            query = { user: userId };
            console.log("Query applied to MongoDB:", query);
        }
        else{
            console.log("Query applied to MongoDB: Global (Returning all products)");
        }
        const product = await Product.find({}).populate('user', 'name email');
        return res.status(200).json(product);
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({ message: "Server error fetching products" });
    }
}

const updateProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update another admin's product metrics" });
        }
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        return res.status(200).json(updateProduct);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error updating product" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to purge another admin's inventory records" });
        }
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Product Deleted Succesfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error deleting product" });
    }
};

module.exports = { createProduct, getProduct, updateProduct, deleteProduct };