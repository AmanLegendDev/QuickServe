
export const dynamic = "force-dynamic";
export const revalidate = false;

// GET: list all tables
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Table from "@/models/Table";

export async function GET(req, { params }) {
  try {
    await connectDB();

    console.log("PARAMS:", params);

    const table = await Table.findById(params.id);

    if (!table) {
      return NextResponse.json({
        success: false,
        message: "Table not found",
      });
    }

    return NextResponse.json({
      success: true,
      table,
    });

  } catch (err) {

    console.log("TABLE ERROR:", err);

    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
// POST: create a new table
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("BODY FROM FRONTEND:", body);
console.log("ORDER WILL SAVE AS:", orderData);


    const { name, number } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const table = await Table.create({
      name: name.trim(),
      number: number || undefined,
    });

    return NextResponse.json({ success: true, table }, { status: 201 });
  } catch (err) {
    console.error("Tables POST Error:", err);
    return NextResponse.json(
      { success: false, message: "Create table failed" },
      { status: 500 }
    );
  }
}
