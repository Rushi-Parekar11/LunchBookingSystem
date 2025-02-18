import { connectMongoDB } from '@/lib/mongodb';
import Menu from '@/models/menu';
import Vendor from '@/models/vendor';



export async function POST(req) {
    await connectMongoDB();

    try {
        const body = await req.json();
        const { itemName, price, vendor, description, imageUrl,type,menuDate } = body;

        if (!itemName || !price || !vendor || !type || !menuDate) {
            return new Response(JSON.stringify({ message: 'All fields are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newItem = new Menu({ itemName, price, vendor, description, imageUrl,type,menuDate });
        const savedItem = await newItem.save();

        // Find vendor and update menuItems
        const vendorDoc = await Vendor.findById(vendor);
        if (!vendorDoc) {
            return new Response(JSON.stringify({ message: 'Vendor not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        vendorDoc.menuItems.push(savedItem._id);
        await vendorDoc.save();

        return new Response(JSON.stringify({
            message: 'Menu item added successfully',
            savedItem
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        return new Response(JSON.stringify({
            message: 'Internal server error',
            error
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
