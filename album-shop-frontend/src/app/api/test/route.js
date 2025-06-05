import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://album-shop.up.railway.app/health');
    const data = await res.text();

    return NextResponse.json({
      ok: true,
      status: res.status,
      data
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 });
  }
}
