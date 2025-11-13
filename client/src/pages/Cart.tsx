import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success('Item removed from cart');
    setItemToRemove(null);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared successfully');
    setShowClearCartModal(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center space-x-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold text-primary">₦{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setItemToRemove(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowClearCartModal(true)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₦{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {getTotalPrice() > 50000 ? 'Free' : '₦2,000'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₦{(getTotalPrice() * 0.08).toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      ₦{(getTotalPrice() * 1.08 + (getTotalPrice() > 50000 ? 0 : 2000)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {getTotalPrice() < 50000 && (
                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                  Add ₦{(50000 - getTotalPrice()).toLocaleString()} more to get free shipping!
                </p>
              )}

              <Link to="/checkout" className="btn-primary w-full inline-flex items-center justify-center space-x-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link to="/shop" className="btn-outline w-full mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Confirmation Modal */}
      {itemToRemove && (
        <ConfirmModal
          isOpen={!!itemToRemove}
          onClose={() => setItemToRemove(null)}
          onConfirm={() => handleRemoveItem(itemToRemove)}
          title="Remove Item?"
          message="Are you sure you want to remove this item from your cart?"
          type="danger"
          confirmText="Yes, Remove"
          cancelText="Keep Item"
          icon="delete"
        />
      )}

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={handleClearCart}
        title="Clear Cart?"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        type="danger"
        confirmText="Yes, Clear Cart"
        cancelText="Keep Items"
        icon="cart"
      />
    </div>
  );
};

export default Cart;
