import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Menu from '@/models/menu';
import Vendor from "../../../../models/vendor"

export async function GET(req) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const date = parseInt(searchParams.get('date'));
    // const dayName = searchParams.get('dayName');
    const month = searchParams.get('month');
    const year = parseInt(searchParams.get('year'));

    if (!date || !month || !year) {
      return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    const menu = await Menu.find({
      'menuDate.date': date,
      'menuDate.month': month,
      'menuDate.year': year,
    }).populate('vendor'); 
    return NextResponse.json({ success: true, menu });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
