const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorMiddleware')


const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/products', productRoutes);

app.get('/', (req, res) =>
    res.json({ message: "API is running cleanely..." })
);

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} made on port ${PORT}`);
})