export const OrderList = ({ orders }) => (
    <div className="mt-4">
      {orders.map((order) => (
        <div key={order._id} className="border-b border-gray-300 py-3">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center space-x-4">
              <img src={item.itemId.imageUrl} alt={item.itemId.itemName} width={50} height={50} className="rounded-lg object-cover my-1" />
              <div className="flex-1">
                <span className="font-medium text-gray-700">{item.itemId.itemName}</span>
              </div>
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">x{item.quantity}</span>
              <span className="text-gray-600 font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );