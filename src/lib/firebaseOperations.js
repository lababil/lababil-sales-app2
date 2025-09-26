import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== PRODUCTS OPERATIONS ====================

// Get all products
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...productData
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: productId,
      ...productData
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== SALES OPERATIONS ====================

// Get all sales
export const getSales = async () => {
  try {
    const salesRef = collection(db, 'sales');
    const q = query(salesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const sales = [];
    querySnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sales;
  } catch (error) {
    console.error('Error getting sales:', error);
    throw error;
  }
};

// Add new sale
export const addSale = async (saleData) => {
  try {
    const salesRef = collection(db, 'sales');
    const docRef = await addDoc(salesRef, {
      ...saleData,
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...saleData
    };
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
};

// Delete sale
export const deleteSale = async (saleId) => {
  try {
    const saleRef = doc(db, 'sales', saleId);
    await deleteDoc(saleRef);
    return saleId;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() };
      if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())) {
        products.push(product);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get sales by date range
export const getSalesByDateRange = async (startDate, endDate) => {
  try {
    const salesRef = collection(db, 'sales');
    const q = query(
      salesRef, 
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const sales = [];
    querySnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sales;
  } catch (error) {
    console.error('Error getting sales by date range:', error);
    throw error;
  }
};